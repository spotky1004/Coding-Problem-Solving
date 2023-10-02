import sys
from heapq import *

N, K = list(map(int, input().split()))
p = [list(map(int, sys.stdin.readline().split())) for _ in range(N)]
poses = [[] for _ in range(11)]

for i in range(N):
  P, W = p[i]
  poses[P - 1].append(-W)

for i in range(11):
  heapify(poses[i])

for _ in range(K):
  for i in range(11):
    if len(poses[i]) == 0:
      continue
    W = heappop(poses[i])
    heappush(poses[i], W + 1)

out = 0
for i in range(11):
  if len(poses[i]) == 0:
    continue
  W = heappop(poses[i])
  out += -W

print(out)
