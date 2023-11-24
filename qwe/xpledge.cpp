#include <bits/stdc++.h>

// #define _POSIX_C_SOURCE 200112L
// #define _GNU_SOURCE
#include <asm/prctl.h> /* XXX This should get the constants from libc */
#include <linux/sched.h>
// #include <linux/syscalls.h>
#include <linux/types.h>
// #include <linux/uaccess.h>
// #include <os.h>
// #include <registers.h>
#include <sched.h>
#include <sys/mman.h>
#include <unistd.h>

using namespace std;

// loops
#define FOR_3(i, a, b) for (int i = (a), bb##i = (b); i <= bb##i; ++i)
#define FORR_3(i, a, b) for (int i = (b), aa##i = (a); i >= aa##i; --i)

#define FOR_2(i, n) FOR_3(i, 0, (n)-1)
#define FORR_2(i, n) FORR_3(i, 0, (n)-1)

#define FOR_1(n) FOR_2(_i##__LINE__, n)
#define FOR_0() for (;;)

#define OVERLOAD(_0, _1, _2, _3, NAME, ...) NAME
#define FOR(...)                                                               \
  OVERLOAD(_0 __VA_OPT__(, )##__VA_ARGS__, FOR_3, FOR_2, FOR_1, FOR_0)         \
  (__VA_ARGS__)

#define FORR(...)                                                              \
  OVERLOAD(_0 __VA_OPT__(, )##__VA_ARGS__, FORR_3, FORR_2, FORR_1, FOR_0)      \
  (__VA_ARGS__)

// in - expr style
template <class T> T read() {
  T x;
  cin >> x;
  return x;
}
#define II read<int>()
#define ILL read<ll>()
#define ISTR read<string>()

// in - macro style
void _I() {}
template <class ARG, class... ARGS> void _I(ARG &&arg, ARGS &&...args) {
  cin >> arg;
  _I(forward<ARGS>(args)...);
}
#define I(...) _I(__VA_ARGS__);

// out
template <class T> void _print(T x, ostream &os = cout) {
  os << x;
  bool space = true;
  if constexpr (is_same_v<T, char>)
    if (x == '\n')
      space = false;

  if (space)
    os << " ";
}
// template <class T> void _print(const vector<T> &d, ostream &os = cout) {
//   os << '[';
//   for (auto &e : d)
//     os << e << " ";
//   os << ']';
// }
void _O() {}
template <class ARG, class... ARGS> void _O(ARG &&arg, ARGS &&...args) {
  _print(arg);
  _O(forward<ARGS>(args)...);
}
#define O(...) _O(__VA_ARGS__ __VA_OPT__(, ) '\n');
#define OO(...) _O(__VA_ARGS__);

// err
const int _indentSize = 2;
string _indent;

void _E() { cerr << endl; }
template <class ARG, class... ARGS> void _E(ARG &&arg, ARGS &&...args) {
  _print(forward<ARG>(arg), cerr);
  _E(std::forward<ARGS>(args)...);
}

#define ERR(...)                                                               \
  {                                                                            \
    cerr << _indent << "[" << __LINE__ << "] ";                                \
    _E(__VA_ARGS__);                                                           \
  }

#define _V8(x) #x, "==", (x)
#define _V7(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V8(__VA_ARGS__))
#define _V6(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V7(__VA_ARGS__))
#define _V5(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V6(__VA_ARGS__))
#define _V4(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V5(__VA_ARGS__))
#define _V3(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V4(__VA_ARGS__))
#define _V2(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V3(__VA_ARGS__))
#define _V1(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V2(__VA_ARGS__))
#define ERRV(...) ERR(_V1(__VA_ARGS__))
#define INDENT auto _indenter = Indenter();

struct Indenter {
  Indenter() { FOR(_indentSize) _indent.push_back(' '); }
  ~Indenter() { FOR(_indentSize) _indent.pop_back(); }
};

#ifdef DEBUG
#define FAIL(str)                                                              \
  {                                                                            \
    cerr << "ASSERT FAILED   " << str << "   " << __FILE__ << ':' << __LINE__  \
         << endl;                                                              \
    abort();                                                                   \
  }
#define SLEEP(X) this_thread::sleep_for(X);
#else
#define FAIL(x)                                                                \
  {}
#define SLEEP(X)                                                               \
  {}
#endif

// asserts
#define CHECK(cond)                                                            \
  if (!(cond))                                                                 \
  FAIL(#cond)

#define CHECK_OP(op, a, b, cond)                                               \
  if (!(cond))                                                                 \
  FAIL(#a " " op " " #b "   (" + to_string(a) + " vs " + to_string(b) + ")")

#define CHECK_EQ(a, b) CHECK_OP("==", a, b, (a) == (b))
#define CHECK_NE(a, b) CHECK_OP("!=", a, b, (a) != (b))
#define CHECK_LE(a, b) CHECK_OP("<=", a, b, (a) <= (b))
#define CHECK_GE(a, b) CHECK_OP(">=", a, b, (a) >= (b))
#define CHECK_LT(a, b) CHECK_OP("<", a, b, (a) < (b))
#define CHECK_GT(a, b) CHECK_OP(">", a, b, (a) > (b))

#define CHECK_RANGE(x, a, b)                                                   \
  if (!(a <= x && x < b))                                                      \
  FAIL(#x " in [" #a "," #b ")")

//

//

//

//

//

#include "syscall-names.hpp"

/* C standard library */
#include <errno.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* POSIX */
#include <sys/user.h>
#include <sys/wait.h>
#include <unistd.h>

/* Linux */
#include <sys/ptrace.h>
#include <sys/reg.h>
#include <syscall.h>

#define FATAL(...)                                                             \
  do {                                                                         \
    fprintf(stderr, "strace: " __VA_ARGS__);                                   \
    fputc('\n', stderr);                                                       \
    exit(EXIT_FAILURE);                                                        \
  } while (0)

//

void printRegs(user_regs_struct &regs) {
  ERRV(regs.cs);
  ERRV(regs.ds);
  ERRV(regs.eflags);
  ERRV(regs.es);
  ERRV(regs.fs);
  ERRV(regs.fs_base);
  ERRV(regs.gs);
  ERRV(regs.gs_base);
  ERRV(regs.orig_rax);
  ERRV(regs.r10);
  ERRV(regs.r11);
  ERRV(regs.r12);
  ERRV(regs.r13);
  ERRV(regs.r14);
  ERRV(regs.r15);
  ERRV(regs.r8);
  ERRV(regs.r9);
  ERRV(regs.rax);
  ERRV(regs.rbp);
  ERRV(regs.rbx);
  ERRV(regs.rcx);
  ERRV(regs.rdi);
  ERRV(regs.rdx);
  ERRV(regs.rip);
  ERRV(regs.rsi);
  ERRV(regs.rsp);
  ERRV(regs.ss);
}

//

auto mapFlags = map<unsigned long, string>{
    {MAP_SHARED, "MAP_SHARED"},
    {MAP_SHARED_VALIDATE, "MAP_SHARED_VALIDATE"},
    {MAP_PRIVATE, "MAP_PRIVATE"},
    {MAP_32BIT, "MAP_32BIT"},
    {MAP_ANON, "MAP_ANON"},
    {MAP_ANONYMOUS, "MAP_ANONYMOUS"},
    {MAP_DENYWRITE, "MAP_DENYWRITE"},
    {MAP_EXECUTABLE, "MAP_EXECUTABLE"},
    {MAP_FILE, "MAP_FILE"},
    {MAP_FIXED, "MAP_FIXED"},
    {MAP_FIXED_NOREPLACE, "MAP_FIXED_NOREPLACE"},
    {MAP_GROWSDOWN, "MAP_GROWSDOWN"},
    {MAP_HUGETLB, "MAP_HUGETLB"},
    //  {MAP_HUGE_2MB, "MAP_HUGE_2MB"},
    //  {MAP_HUGE_1GB, "MAP_HUGE_1GB"},
    {MAP_LOCKED, "MAP_LOCKED"},
    {MAP_NONBLOCK, "MAP_NONBLOCK"},
    {MAP_NORESERVE, "MAP_NORESERVE"},
    {MAP_POPULATE, "MAP_POPULATE"},
    {MAP_STACK, "MAP_STACK"},
    {MAP_SYNC, "MAP_SYNC"},
    //  {MAP_UNINITIALIZED, "MAP_UNINITIALIZED"}};
};

const int MAX_SYS_CALL = 1'024;
// std::map<string, int> sysCallsUsed;
array<int, MAX_SYS_CALL> sysCallsUsed;

auto getName(int sysCall) {
  auto iter = sysCallNames.find(sysCall);
  auto name = iter != sysCallNames.end() ? (iter->second) : string("");
  return name;
}

//

long long brkSize = 0;
long long maxBrkSize = 0;

long long mmapSize = 0;
long long maxMmapSize = 0;

long long heapSize = 0;
long long maxHeapSize = 0;

void updateHeap() {
  heapSize = brkSize + mmapSize;
  maxHeapSize = max(maxHeapSize, heapSize);
}

void onBrk(long long newSize) {
  brkSize = newSize;
  maxBrkSize = max(maxBrkSize, brkSize);
  updateHeap();
}

void onMmap(long long diff) {
  mmapSize += diff;
  maxMmapSize = max(maxMmapSize, mmapSize);
  updateHeap();
}

//

int main(int argc, char **argv) {
  if (argc <= 1)
    FATAL("too few arguments: %d", argc);

  // cout << "FORK" << endl;
  pid_t pid = fork();
  switch (pid) {
  case -1: /* error */
    FATAL("%s", strerror(errno));
  case 0: /* child */
    ptrace(PTRACE_TRACEME, 0, 0, 0);
    /* Because we're now a tracee, execvp will block until the parent
     * attaches and allows us to continue. */
    execvp(argv[1], argv + 1);
    FATAL("%s", strerror(errno));
  }

  /* parent */
  waitpid(pid, 0, 0); // sync with execvp
  ptrace(PTRACE_SETOPTIONS, pid, 0, PTRACE_O_EXITKILL);

  for (;;) {
    /* Enter next system call */
    if (ptrace(PTRACE_SYSCALL, pid, 0, 0) == -1) {
      FATAL("%s", strerror(errno));
    }
    if (waitpid(pid, 0, 0) == -1)
      FATAL("%s", strerror(errno));

    /* Gather system call arguments */
    struct user_regs_struct regs;
    if (ptrace(PTRACE_GETREGS, pid, 0, &regs) == -1)
      FATAL("%s", strerror(errno));

    auto sysCall = regs.orig_rax;

    if (sysCall == (unsigned long long)(-1)) {
      // cout << "????????????????" << endl;
      // if (ptrace(PTRACE_POKEUSER, pid, RAX * 8, -EPERM) == -1)
      //   FATAL("%s", strerror(errno));
      break;
    }

    cout << "! " << sysCall << " " << getName(sysCall) << endl;

    auto block = false;

    if (sysCall >= 0 && sysCall < MAX_SYS_CALL) {
      // sysCallsUsed[name] += 1;
      sysCallsUsed[sysCall] += 1;

      if (sysCall == SYS_read) {
        unsigned int fd = regs.rdi;
        // char *buf = (char *)regs.rsi;
        // size_t count = regs.rdx;
        // ERRV(getName(sysCall), fd, count);

        if (fd != 0) {
          block = true;
        } else {
          // cout << "read STDIN(0) into memory block of size " << count / 1024
          //      << " KB  -  at offset " << (unsigned long long)buf / 1024 /
          //      1024
          //      << " MB" << endl
          //      << endl;
        }
      } else if (sysCall == SYS_write) {
        unsigned int fd = regs.rdi;
        // char *buf = (char *)regs.rsi;
        // size_t count = regs.rdx;
        // ERRV(getName(sysCall), fd, count);

        if (fd != 1 && fd != 2) {
          block = true;
        }
      } else if (sysCall == SYS_mmap) {
        // unsigned long addr = regs.rdi;
        long long len = regs.rsi;
        // unsigned long prot = regs.rdx;
        unsigned long flags = regs.r10;
        // unsigned long fd = regs.r8;
        // unsigned long off = regs.r9;
        // ERRV(getName(sysCall), addr, len, prot, flags, fd, off);

        // cout << "Allocate (mmap) block of size " << len / 1024 / 1024 << "
        // MB"
        //      << "   with flags ";

        if (flags != (MAP_FILE | MAP_ANON | MAP_PRIVATE)) {
          block = true;
        } else {
          onMmap(len);
        }

        // for (auto &[flag, flagStr] : mapFlags) {
        //   if ((flag & flags) == flag) {
        //     flags ^= flag;
        //     cout << " - " << flagStr;

        //     if (flagStr == "MAP_FILE") {
        //       // good - ignored compat flag
        //     } else if (flagStr == "MAP_ANON" || flagStr == "MAP_ANONYMOUS") {
        //       // good - not backed by file
        //     } else if (flagStr == "MAP_PRIVATE") {
        //       // ok
        //     } else {
        //       block = true;
        //     }
        //   }
        // }

        // cout << endl;

        // if (flags) {
        //   cout << "!!!! UNKNOWN MAP_ FLAGS " << flags << endl;
        //   block = true;
        // }

        // cout << endl << endl;

        //

      } else if (sysCall == SYS_munmap) {
        // unsigned long addr = regs.rdi;
        long long len = regs.rsi;
        // ERRV(getName(sysCall), addr, len);

        // cout << "Deallocate (munmap) block of size " << len / 1024
        //      << " KB   at offset " << addr / 1024 / 1024 << " MB" << endl;

        // cout << endl;

        onMmap(-len);
      } else if (sysCall == SYS_brk) {
        unsigned long brk = regs.rdi;
        // ERRV(getName(sysCall), brk);
        // cout << "RESIZE HEAP to " << brk / 1024 / 1024 << " MB" << endl <<
        // endl;
        onBrk(brk);
      } else if (sysCall == SYS_mremap) {
        // unsigned long addr = regs.rdi;
        // unsigned long old_len = regs.rsi;
        // unsigned long new_len = regs.rdx;
        // unsigned long flags = regs.r10;
        // unsigned long new_addr = regs.r8;
        // ERRV(getName(sysCall), addr, old_len, new_len, flags, new_addr);

        block = true; // ! TODO ?
      } else if (sysCall == SYS_arch_prctl) {
        // auto prctlCodes = map<int, string>({{ARCH_SET_GS, "ARCH_SET_GS"},
        //                                     {ARCH_SET_FS, "ARCH_SET_FS"},
        //                                     {ARCH_GET_FS, "ARCH_GET_FS"},
        //                                     {ARCH_GET_GS, "ARCH_GET_GS"}});

        // for (auto &[code, name] : prctlCodes)
        //   ERRV(name, code);

        // printRegs(regs);
        // auto task_ptr = regs.rdi;
        // int code = regs.rsi;
        // unsigned long *addrUser;
        // ERRV(getName(sysCall), code, addrUser);
      } else if (sysCall == SYS_mprotect) {
        // auto start = regs.rdi;
        // auto len = regs.rsi;
        // auto prot = regs.rdx;
        // ERRV(getName(sysCall), start, len, prot);
        // cout << "PROTECT MEMORY of size " << len / 1024
        //      << " KB  -  starting at offset " << start / 1024 / 1024 << " MB"
        //      << endl
        //      << endl;
      } else if (sysCall == SYS_uname) {
        // ERRV(getName(sysCall));
        // cout << "allow uname" << endl << endl;
        // block = true;
      } else if (sysCall == SYS_readlink) {
        const char *path = (const char *)regs.rdi;
        char *buf = (char *)regs.rsi;
        int bufsiz = regs.rdx;

        array<char, 16 + 1> pathStr;
        *(long *)pathStr.data() = ptrace(PTRACE_PEEKDATA, pid, path);
        *(long *)(pathStr.data() + 8) = ptrace(PTRACE_PEEKDATA, pid, path + 8);

        ERRV(getName(sysCall), bufsiz, pathStr.data());

        if (strcmp(pathStr.data(), "/proc/self/exe"))
          block = true;
      } else if (sysCall == SYS_exit || sysCall == SYS_exit_group) {
        cout << "EXIT" << endl;
        break;
      } else {
        block = true;
      }

      if (block) {
        // if (getName(sysCall) != "")
        cout << "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! BLOCK " << sysCall
             << " " << getName(sysCall) << endl;

        regs.orig_rax = -1; // set to invalid system call
        if (ptrace(PTRACE_SETREGS, pid, 0, &regs) == -1)
          FATAL("%s", strerror(errno));
      }

      // ERRV(getName(sysCall));
    }

    /* Special handling per system call (entrance) */
    // switch (regs.orig_rax) {
    // case SYS_exit:
    //   exit(regs.rdi);
    // case SYS_exit_group:
    //   exit(regs.rdi);
    // break;
    // }

    /* Run system call and stop on exit */
    // if (ptrace(PTRACE_SYSCALL, pid, 0, 0) == -1)
    //   FATAL("%s", strerror(errno));

    // if (waitpid(pid, 0, 0) == -1)
    //   FATAL("%s", strerror(errno));
  }

  cout << endl;

  auto usageMap = map<int, int>();

  FOR(i, (int)(sysCallsUsed.size())) {
    if (sysCallsUsed[i])
      usageMap[i] = sysCallsUsed[i];
  }

  cout << endl;

  cout << "max brk " << maxBrkSize / 1024 / 1024 << " MB" << endl;
  cout << "max mmap " << maxMmapSize / 1024 / 1024 << " MB" << endl;
  cout << "max total heap (brk+mmap) " << maxHeapSize / 1024 / 1024 << " MB"
       << endl;

  cout << endl;

  cout << "total " << usageMap.size() << " different syscalls used" << endl;
  cout << endl;

  for (auto &[id, num] : usageMap) {
    cout << sysCallNames[id] << " used " << num << " times" << endl;
  }

  kill(pid, SIGKILL);
}
