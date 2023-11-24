#include <bits/stdc++.h>
using namespace std;

#include "xpledge.h"
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
  cout << "example: HELLO" << endl;
  unsigned x;

  /* Open /dev/urandom, which should succeed */
  FILE *urandom = fopen("/dev/urandom", "r");
  if (!urandom) {
    printf("example: open(\"/dev/urandom\")[1]: %s\n", strerror(errno));
    exit(EXIT_FAILURE);
  }

  /* Demonstrate a read */
  x = 0;
  fread(&x, sizeof(x), 1, urandom);
  printf("example: fread(\"/dev/urandom\")[1] = 0x%08x\n", x);

  /* Pledge to no longer open files */
  puts("example: XPledging...");
  if (xpledge(XPLEDGE_RDWR) == -1)
    printf("example: XPledge failed: %s\n", strerror(errno));

  /* Try to open /dev/urandom a second time */
  FILE *urandom2 = fopen("/dev/urandom", "r");
  if (!urandom2) {
    printf("example: fopen(\"/dev/urandom\")[2]: %s\n", strerror(errno));
  } else {
    /* Prove we can read from it */
    x = 0;
    fread(&x, sizeof(x), 1, urandom2);
    printf("example: fread(\"/dev/urandom\")[2] = 0x%08x\n", x);
  }

  /* Should still be able to read from first /dev/urandom handle */
  x = 0;
  fread(&x, sizeof(x), 1, urandom);
  printf("example: fread(\"/dev/urandom\")[1] = 0x%08x\n", x);

  if (urandom2)
    fclose(urandom2);
  fclose(urandom);

  cout << "example: BYE" << endl;
  return 0;
}
