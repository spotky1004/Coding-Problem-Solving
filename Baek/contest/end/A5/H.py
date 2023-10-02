import sys
import math

N = int(input())
l = []

prefixSums = []
for i in range(N):
  l.append(int(sys.stdin.readline()))
  prefixSums.append((prefixSums[i - 1] if i != 0 else 0) + l[i])

L = int(input())
Q = int(input())

centers = []
for i in range(N):
  center = prefixSums[i] - l[i] / 2 - L / 2
  center = max(0, min(prefixSums[N - 1] - L, center))
  centers.append(f'{(math.floor(center * 100) / 100):.2f}')

out = []
for i in range(Q):
  sys.stdout.write(centers[int(sys.stdin.readline()) - 1] + "\n")
