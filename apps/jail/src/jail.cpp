/**
 * @brief Based on example from
 * https://man7.org/linux/man-pages/man2/seccomp_unotify.2.html
 */

#ifndef DEBUG // make DEBUG mode explicit
#undef NDEBUG // disable `stdlib` asserts if we're not in explicit DEBUG mode
#endif

#ifndef _GNU_SOURCE
#define _GNU_SOURCE
#endif

#include "_/get_syscall_name.hpp"

#include <assert.h>
#include <errno.h>
#include <fcntl.h>
#include <limits.h>
#include <linux/audit.h>
#include <linux/filter.h>
#include <linux/seccomp.h>
#include <signal.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <sys/prctl.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/un.h>
#include <sys/wait.h>
#include <unistd.h>

#include <nlohmann/json.hpp>

using json = nlohmann::json;

#define errExit(msg)                                                           \
  do {                                                                         \
    perror(msg);                                                               \
    exit(EXIT_FAILURE);                                                        \
  } while (0)

auto gray = "\033[38;5;8m";
auto yellow = "\033[38;5;11m";
auto end = "\033[0m";

/* Send the file descriptor 'fd' over the connected UNIX domain socket
   'sockfd'. Returns 0 on success, or -1 on error. */

static int sendmsg_fd(int sock_fd, int data_fd) {

  /* Allocate a char array of suitable size to hold the ancillary data.
     However, since this buffer is in reality a 'struct cmsghdr', use a
     union to ensure that it is suitably aligned. */
  union {
    char buf[CMSG_SPACE(sizeof(int))];
    /* Space large enough to hold an 'int' */
    struct cmsghdr align;
  } controlMsg;

  /* On Linux, we must transmit at least one byte of real data in
     order to send ancillary data. We transmit an arbitrary integer
     whose value is ignored by recvfd(). */

  int data = 12345;

  struct iovec iov;
  iov.iov_base = &data;
  iov.iov_len = sizeof(int);

  /* The 'msg_name' field can be used to specify the address of the
     destination socket when sending a datagram. However, we do not
     need to use this field because 'sockfd' is a connected socket. */

  struct msghdr msgh;
  msgh.msg_name = NULL;
  msgh.msg_namelen = 0;
  msgh.msg_iov = &iov;
  msgh.msg_iovlen = 1;

  /* Set 'msghdr' fields that describe ancillary data */

  msgh.msg_control = controlMsg.buf;
  msgh.msg_controllen = sizeof(controlMsg.buf);

  /* Set up ancillary data describing file descriptor to send */

  struct cmsghdr *cmsgp = CMSG_FIRSTHDR(&msgh);
  cmsgp->cmsg_level = SOL_SOCKET;
  cmsgp->cmsg_type = SCM_RIGHTS;
  cmsgp->cmsg_len = CMSG_LEN(sizeof(int));
  memcpy(CMSG_DATA(cmsgp), &data_fd, sizeof(int));

  /* Send real plus ancillary data */

  if (sendmsg(sock_fd, &msgh, 0) == -1)
    return -1;

  return 0;
}

/* Receive a file descriptor on a connected UNIX domain socket. Returns
   the received file descriptor on success, or -1 on error. */

static int recvmsg_fd(int sockfd) {
  struct msghdr msgh;
  struct iovec iov;
  int data, fd;
  ssize_t nr;

  /* Allocate a char buffer for the ancillary data. See the comments
     in sendfd() */
  union {
    char buf[CMSG_SPACE(sizeof(int))];
    struct cmsghdr align;
  } controlMsg;
  struct cmsghdr *cmsgp;

  /* The 'msg_name' field can be used to obtain the address of the
     sending socket. However, we do not need this information. */

  msgh.msg_name = NULL;
  msgh.msg_namelen = 0;

  /* Specify buffer for receiving real data */

  msgh.msg_iov = &iov;
  msgh.msg_iovlen = 1;
  iov.iov_base = &data; /* Real data is an 'int' */
  iov.iov_len = sizeof(int);

  /* Set 'msghdr' fields that describe ancillary data */

  msgh.msg_control = controlMsg.buf;
  msgh.msg_controllen = sizeof(controlMsg.buf);

  /* Receive real plus ancillary data; real data is ignored */

  nr = recvmsg(sockfd, &msgh, 0);
  if (nr == -1)
    return -1;

  cmsgp = CMSG_FIRSTHDR(&msgh);

  /* Check the validity of the 'cmsghdr' */

  if (cmsgp == NULL || cmsgp->cmsg_len != CMSG_LEN(sizeof(int)) ||
      cmsgp->cmsg_level != SOL_SOCKET || cmsgp->cmsg_type != SCM_RIGHTS) {
    errno = EINVAL;
    return -1;
  }

  /* Return the received file descriptor to our caller */

  memcpy(&fd, CMSG_DATA(cmsgp), sizeof(int));
  return fd;
}

static void sigchldHandler(int sig) {
  int wstat;
  auto pid = wait3(&wstat, WNOHANG, (struct rusage *)NULL);

  if (wstat) {
    fprintf(stderr, "\n%sExited with: %s%s %s= %d\n", gray, yellow,
            strsignal(wstat), gray, wstat);
  } else {
    fprintf(stderr, "\n%sExited with: %s%d\n", gray, yellow, wstat);
  }

  _exit(wstat);
}

static void testHandler(int sig) {
  fprintf(stderr, "JAIL: sig $d\n", sig);
  _exit(sig);
}

static int seccomp(unsigned int operation, unsigned int flags, void *args) {
  return syscall(__NR_seccomp, operation, flags, args);
}

/* The following is the x86-64-specific BPF boilerplate code for checking
   that the BPF program is running on the right architecture + ABI. At
   completion of these instructions, the accumulator contains the system
   call number. */

/* For the x32 ABI, all system call numbers have bit 30 set */

#define X32_SYSCALL_BIT 0x40000000

#define X86_64_CHECK_ARCH_AND_LOAD_SYSCALL_NR                                  \
  BPF_STMT(BPF_LD | BPF_W | BPF_ABS, (offsetof(struct seccomp_data, arch))),   \
      BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, AUDIT_ARCH_X86_64, 0, 2),            \
      BPF_STMT(BPF_LD | BPF_W | BPF_ABS, (offsetof(struct seccomp_data, nr))), \
      BPF_JUMP(BPF_JMP | BPF_JGE | BPF_K, X32_SYSCALL_BIT, 0, 1),              \
      BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_TRAP)

/* installNotifyFilter() installs a seccomp filter that generates
   user-space notifications (SECCOMP_RET_USER_NOTIF) when the process
   calls mkdir(2); the filter allows all other system calls.

   The function return value is a file descriptor from which the
   user-space notifications can be fetched. */

static int installNotifyFilter(void) {
  struct sock_filter filter[] = {
      X86_64_CHECK_ARCH_AND_LOAD_SYSCALL_NR,

      /* mkdir() triggers notification to user-space supervisor */

      BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_mkdir, 0, 1),
      BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_USER_NOTIF),

      /* Every other system call is allowed */

      BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_TRAP),
  };

  struct sock_fprog prog = {
      .len = sizeof(filter) / sizeof(filter[0]),
      .filter = filter,
  };

  /* Install the filter with the SECCOMP_FILTER_FLAG_NEW_LISTENER flag;
     as a result, seccomp() returns a notification file descriptor. */

  int notifyFd =
      seccomp(SECCOMP_SET_MODE_FILTER, SECCOMP_FILTER_FLAG_NEW_LISTENER, &prog);
  if (notifyFd == -1)
    errExit("seccomp-install-notify-filter");

  return notifyFd;
}

/* Close a pair of sockets created by socketpair() */

static void closeSocketPair(int sockPair[2]) {
  if (close(sockPair[0]) == -1)
    errExit("closeSocketPair-close-0");

  if (close(sockPair[1]) == -1)
    errExit("closeSocketPair-close-1");
}

//

static void sigtrap_handler(int signal, siginfo_t *info, void *_context) {
  assert(signal == SIGTRAP);

  if (info->si_code != SYS_seccomp)
    return; // ignore - not ours

  assert(info->si_signo == SIGSYS);

  auto seccomp_ret_data = info->si_errno;

  auto context = (ucontext_t *)_context;
  assert(context);

  fprintf(stderr, "! syscall %d", info->si_syscall);

  json report = {{
      "siginfo",
      {
          {"si_syscall", info->si_syscall},
          {"si_arch", info->si_arch},
          {"SECCOMP_RET_DATA", seccomp_ret_data},
          {"si_call_addr", (unsigned long long)info->si_call_addr},
      },

      //  {"ucontext",
      //   {{"uc_flags", context->uc_flags},
      //    {
      //        {"uc_mcontext",
      //         {
      //             {"gregs", std::to_array(context->uc_mcontext.gregs)},
      //             //  {"fpregs", {

      //             //  }}
      //         }},
      //    },

      //    //  {"uc_sigmask", context->uc_sigmask},
      //    //  {"uc_stack", context->uc_stack},
      //    {"uc_link", (unsigned long long)context->uc_link}}
  }};

  auto reportStr = report.dump(2);
  fprintf(stdout, "report: %s\n", reportStr.c_str());
  // write(report_fd, reportStr.c_str(), reportStr.size());

  _exit(signal);
}

//

/* Implementation of the target process; create a child process that:

   (1) installs a seccomp filter with the
       SECCOMP_FILTER_FLAG_NEW_LISTENER flag;
   (2) writes the seccomp notification file descriptor returned from
       the previous step onto the UNIX domain socket, 'sockPair[0]';
   (3) calls mkdir(2) for each element of 'argv'.

   The function return value in the parent is the PID of the child
   process; the child does not return from this function. */

static pid_t prisoner(int sockPair[2], char program[], char *programArgs[]) {
  pid_t targetPid = fork();
  if (targetPid == -1)
    errExit("fork");

  if (targetPid > 0) /* In parent, return PID of child */
    return targetPid;

  /* Child falls through to here */

  fprintf(stderr, "%sPID =%s %s%ld%s\n", gray, end, yellow, (long)getpid(),
          end);

  /* Install seccomp filter(s) */

  if (prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0))
    errExit("prctl");

  int notifyFd = installNotifyFilter();

  /* Pass the notification file descriptor to the tracing process over
     a UNIX domain socket */

  if (sendmsg_fd(sockPair[0], notifyFd) == -1)
    errExit("sendfd");

  /* Notification and socket FDs are no longer needed in target */

  if (close(notifyFd) == -1)
    errExit("close-target-notify-fd");

  closeSocketPair(sockPair);

  /* Ignore stderr */
  auto devNull = open("/dev/null", O_WRONLY);
  dup2(devNull, STDERR_FILENO);

  // struct sigaction sa;
  // sa.sa_flags = SA_SIGINFO;
  // sa.sa_sigaction = sigtrap_handler;
  // sigemptyset(&sa.sa_mask);
  // if (sigaction(SIGTRAP, &sa, NULL) == -1)
  //   errExit("sigaction");

  execvp(program, programArgs);
  errExit("execvp");
}

/* Check that the notification ID provided by a SECCOMP_IOCTL_NOTIF_RECV
   operation is still valid. It will no longer be valid if the target
   process has terminated or is no longer blocked in the system call that
   generated the notification (because it was interrupted by a signal).

   This operation can be used when doing such things as accessing
   /proc/PID files in the target process in order to avoid TOCTOU race
   conditions where the PID that is returned by SECCOMP_IOCTL_NOTIF_RECV
   terminates and is reused by another process. */

static bool cookieIsValid(int notifyFd, uint64_t id) {
  return ioctl(notifyFd, SECCOMP_IOCTL_NOTIF_ID_VALID, &id) == 0;
}

/* Access the memory of the target process in order to fetch the
   pathname referred to by the system call argument 'argNum' in
   'req->data.args[]'.  The pathname is returned in 'path',
   a buffer of 'len' bytes allocated by the caller.

   Returns true if the pathname is successfully fetched, and false
   otherwise. For possible causes of failure, see the comments below. */

static bool getTargetPathname(struct seccomp_notif *req, int notifyFd,
                              int argNum, char *path, size_t len) {
  char procMemPath[PATH_MAX];

  snprintf(procMemPath, sizeof(procMemPath), "/proc/%d/mem", req->pid);

  int procMemFd = open(procMemPath, O_RDONLY | O_CLOEXEC);
  if (procMemFd == -1)
    return false;

  /* Check that the process whose info we are accessing is still alive
     and blocked in the system call that caused the notification.
     If the SECCOMP_IOCTL_NOTIF_ID_VALID operation (performed in
     cookieIsValid()) succeeded, we know that the /proc/PID/mem file
     descriptor that we opened corresponded to the process for which we
     received a notification. If that process subsequently terminates,
     then read() on that file descriptor will return 0 (EOF). */

  if (!cookieIsValid(notifyFd, req->id)) {
    close(procMemFd);
    return false;
  }

  /* Read bytes at the location containing the pathname argument */

  ssize_t nread = pread(procMemFd, path, len, req->data.args[argNum]);

  close(procMemFd);

  if (nread <= 0)
    return false;

  /* Once again check that the notification ID is still valid. The
     case we are particularly concerned about here is that just
     before we fetched the pathname, the target's blocked system
     call was interrupted by a signal handler, and after the handler
     returned, the target carried on execution (past the interrupted
     system call). In that case, we have no guarantees about what we
     are reading, since the target's memory may have been arbitrarily
     changed by subsequent operations. */

  if (!cookieIsValid(notifyFd, req->id)) {
    perror("\tS: notification ID check failed!!!");
    return false;
  }

  /* Even if the target's system call was not interrupted by a signal,
     we have no guarantees about what was in the memory of the target
     process. (The memory may have been modified by another thread, or
     even by an external attacking process.) We therefore treat the
     buffer returned by pread() as untrusted input. The buffer should
     contain a terminating null byte; if not, then we will trigger an
     error for the target process. */

  if (strnlen(path, nread) < nread)
    return true;

  return false;
}

/* Allocate buffers for the seccomp user-space notification request and
   response structures. It is the caller's responsibility to free the
   buffers returned via 'req' and 'resp'. */

static void allocSeccompNotifBuffers(struct seccomp_notif **req,
                                     struct seccomp_notif_resp **resp,
                                     struct seccomp_notif_sizes *sizes) {
  /* Discover the sizes of the structures that are used to receive
     notifications and send notification responses, and allocate
     buffers of those sizes. */

  if (seccomp(SECCOMP_GET_NOTIF_SIZES, 0, sizes) == -1)
    errExit("seccomp-SECCOMP_GET_NOTIF_SIZES");

  *req = (seccomp_notif *)malloc(sizes->seccomp_notif);
  if (*req == NULL)
    errExit("malloc-seccomp_notif");

  /* When allocating the response buffer, we must allow for the fact
     that the user-space binary may have been built with user-space
     headers where 'struct seccomp_notif_resp' is bigger than the
     response buffer expected by the (older) kernel. Therefore, we
     allocate a buffer that is the maximum of the two sizes. This
     ensures that if the supervisor places bytes into the response
     structure that are past the response size that the kernel expects,
     then the supervisor is not touching an invalid memory location. */

  size_t resp_size = sizes->seccomp_notif_resp;
  if (sizeof(struct seccomp_notif_resp) > resp_size)
    resp_size = sizeof(struct seccomp_notif_resp);

  *resp = (seccomp_notif_resp *)malloc(resp_size);
  if (resp == NULL)
    errExit("malloc-seccomp_notif_resp");
}

/* Handle notifications that arrive via the SECCOMP_RET_USER_NOTIF file
   descriptor, 'notifyFd'. */

static void handleNotifications(int notifyFd) {
  struct seccomp_notif_sizes sizes;
  struct seccomp_notif *req;
  struct seccomp_notif_resp *resp;
  char path[PATH_MAX];

  allocSeccompNotifBuffers(&req, &resp, &sizes);

  /* Loop handling notifications */

  for (;;) {

    /* Wait for next notification, returning info in '*req' */

    memset(req, 0, sizes.seccomp_notif);
    if (ioctl(notifyFd, SECCOMP_IOCTL_NOTIF_RECV, req) == -1) {
      if (errno == EINTR)
        continue;
      errExit("\tS: ioctl-SECCOMP_IOCTL_NOTIF_RECV");
    }

    printf("\tS: got notification (ID %#llx) for PID %d\n", req->id, req->pid);

    /* The only system call that can generate a notification event
       is mkdir(2). Nevertheless, we check that the notified system
       call is indeed mkdir() as kind of future-proofing of this
       code in case the seccomp filter is later modified to
       generate notifications for other system calls. */

    if (req->data.nr != __NR_mkdir) {
      printf("\tS: notification contained unexpected "
             "system call number; bye!!!\n");
      exit(EXIT_FAILURE);
    }

    bool pathOK = getTargetPathname(req, notifyFd, 0, path, sizeof(path));

    /* Prepopulate some fields of the response */

    resp->id = req->id; /* Response includes notification ID */
    resp->flags = 0;
    resp->val = 0;

    /* If getTargetPathname() failed, trigger an EINVAL error
       response (sending this response may yield an error if the
       failure occurred because the notification ID was no longer
       valid); if the directory is in /tmp, then create it on behalf
       of the supervisor; if the pathname starts with '.', tell the
       kernel to let the target process execute the mkdir();
       otherwise, give an error for a directory pathname in any other
       location. */

    if (!pathOK) {
      resp->error = -EINVAL;
      printf("\tS: spoofing error for invalid pathname (%s)\n",
             strerror(-resp->error));
    } else if (strncmp(path, "/tmp/", strlen("/tmp/")) == 0) {
      printf("\tS: executing: mkdir(\"%s\", %#llo)\n", path, req->data.args[1]);

      if (mkdir(path, req->data.args[1]) == 0) {
        resp->error = 0;          /* "Success" */
        resp->val = strlen(path); /* Used as return value of
                                     mkdir() in target */
        printf("\tS: success! spoofed return = %lld\n", resp->val);
      } else {

        /* If mkdir() failed in the supervisor, pass the error
           back to the target */

        resp->error = -errno;
        printf("\tS: failure! (errno = %d; %s)\n", errno, strerror(errno));
      }
    } else if (strncmp(path, "./", strlen("./")) == 0) {
      resp->error = resp->val = 0;
      resp->flags = SECCOMP_USER_NOTIF_FLAG_CONTINUE;
      printf("\tS: target can execute system call\n");
    } else {
      resp->error = -EOPNOTSUPP;
      printf("\tS: spoofing error response (%s)\n", strerror(-resp->error));
    }

    /* Send a response to the notification */

    printf("\tS: sending response "
           "(flags = %#x; val = %lld; error = %d)\n",
           resp->flags, resp->val, resp->error);

    if (ioctl(notifyFd, SECCOMP_IOCTL_NOTIF_SEND, resp) == -1) {
      if (errno == ENOENT)
        printf("\tS: response failed with ENOENT; "
               "perhaps target process's syscall was "
               "interrupted by a signal?\n");
      else
        perror("ioctl-SECCOMP_IOCTL_NOTIF_SEND");
    }

    /* If the pathname is just "/bye", then the supervisor breaks out
       of the loop and terminates. This allows us to see what happens
       if the target process makes further calls to mkdir(2). */

    if (strcmp(path, "/bye") == 0)
      break;
  }

  free(req);
  free(resp);
  printf("\tS: terminating **********\n");
  exit(EXIT_FAILURE);
}

/**
 * Implementation of the supervisor process:
 *
 * (1) obtains the notification file descriptor from 'sockPair[1]'
 * (2) handles notifications that arrive on that file descriptor.
 */
static void supervisor(int sockPair[2]) {
  int notifyFd = recvmsg_fd(sockPair[1]);
  if (notifyFd == -1)
    errExit("recvfd");

  closeSocketPair(sockPair); /* We no longer need the socket pair */

  handleNotifications(notifyFd);
}

int main(int argc, char *argv[]) {
  int sockPair[2];

  setbuf(stdout, NULL);

  if (argc < 2) {
    fprintf(stderr, "Usage: %s PROGRAM [ arg [ arg ... ] ]\n", argv[0]);
    exit(EXIT_FAILURE);
  }

  auto program = argv[1];
  auto programArgs = &argv[2];

  /* Create a UNIX domain socket that is used to pass the
     seccomp notification file descriptor from the target
     process to the supervisor process. */

  if (socketpair(AF_UNIX, SOCK_STREAM, 0, sockPair) == -1)
    errExit("socketpair");

  /* Create a child process--the "target"--that installs seccomp
     filtering. The target process writes the seccomp notification
     file descriptor onto 'sockPair[0]' and then calls mkdir(2) for
     each directory in the command-line arguments. */

  (void)prisoner(sockPair, program, programArgs);

  /* Catch SIGCHLD when the target terminates, so that the
     supervisor can also terminate. */

  struct sigaction sa;
  sa.sa_handler = sigchldHandler;
  sa.sa_flags = 0;
  sigemptyset(&sa.sa_mask);
  if (sigaction(SIGCHLD, &sa, NULL) == -1)
    errExit("sigaction");

  //

  struct sigaction sa;
  sa.sa_flags = SA_SIGINFO;
  sa.sa_sigaction = sigtrap_handler;
  sigemptyset(&sa.sa_mask);
  if (sigaction(SIGTRAP, &sa, NULL) == -1)
    errExit("sigaction");

  //

  supervisor(sockPair);

  exit(EXIT_SUCCESS);
}
