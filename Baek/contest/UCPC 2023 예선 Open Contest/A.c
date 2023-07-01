#include <stdio.h>

int main() {
  int acc = 0, i = 0;
  while (i < 10) {
    int t;
    scanf("%d", &t);
    acc += t * 90;
    i++;
  }
  
  const char d[4] = "NESW";
  printf("%c", d[(acc / 90) % 4]);
  return 0;
}
