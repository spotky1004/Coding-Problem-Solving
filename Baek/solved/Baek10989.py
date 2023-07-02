import sys

n = int(sys.stdin.readline())

valueCounts = [0] * 10001
for i in range(n):
  valueCounts[int(sys.stdin.readline())] += 1

for i in range(10001):
  for j in range(valueCounts[i]):
    print(i)
