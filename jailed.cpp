
// #include <errno.h>
// #include <fcntl.h>
// #include <limits.h>
// #include <linux/audit.h>
// #include <linux/filter.h>
// #include <linux/seccomp.h>
// #include <signal.h>
// #include <stdbool.h>
// #include <stddef.h>
// #include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
// #include <sys/ioctl.h>
// #include <sys/prctl.h>
// #include <sys/socket.h>
#include <sys/stat.h>
// #include <sys/syscall.h>
// #include <sys/types.h>
// #include <sys/un.h>
// #include <unistd.h>

int main(int argc, char *argv[]) {
  /* Perform a mkdir() call for each of the command-line arguments */

  for (char **ap = argv + 1; *ap != NULL; ap++) {
    printf("\nJAILED: about to mkdir(\"%s\")\n", *ap);

    int s = mkdir(*ap, 0700);
    if (s == -1)
      perror("JAILED: ERROR: mkdir(2)");
    else
      printf("JAILED: SUCCESS: mkdir(2) returned %d\n", s);
  }

  printf("\nJAILED: terminating\n");
  exit(EXIT_SUCCESS);
}
