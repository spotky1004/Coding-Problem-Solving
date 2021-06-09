toInput = "5 6\n-2 -1\n0 0\n1 1\n-2 4\n-3 2\n1 2\n2 3\n3 4\n4 5\n1 5\n2 4".split("\n")
sys.stdin.readline = lambda: toInput.pop(0)

import sys
from functools import reduce

n,m = map(int, input().split())
numCount=[0]*50001
for i in range(n):
    sys.stdin.readline()

for j in range(m):
    s = [*map(int, sys.stdin.readline().rstrip().split())]
    numCount[s[0]+10000] += 1
    numCount[s[1]+10000] += 1

print(reduce(lambda a,b:a+max(0, b-2), numCount)+1)