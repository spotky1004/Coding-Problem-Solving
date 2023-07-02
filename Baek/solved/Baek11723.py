import sys

n = int(sys.stdin.readline())
s = 0
for _ in range(n):
  line = sys.stdin.readline().split()
  command = line[0]
  mask = 0 if len(line) == 1 else (1 << int(line[1]))
  if   command == "add":
    s |= mask
  elif command == "remove":
    s &= ~mask
  elif command == "check":
    print(1 if (s & mask) else 0)
  elif command == "toggle":
    s ^= mask
  elif command == "all":
    s = (1 << 21) - 1
  else:
    s = 0
