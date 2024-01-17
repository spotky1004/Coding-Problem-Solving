import sys
input = sys.stdin.readline

while True:
  f = input()
  if f == "" or f == "\n": break

  x = int(f)
  n = int(input())
  legos = []
  for i in range(n):
    legos.append(int(input()))
  legos.sort()

  ans = None
  goal = x * 1e7
  r = 0
  while r < n - 1 and legos[0] + legos[r] < goal: r += 1
  for l in range(n):
    while r >= 0 and legos[l] + legos[r] > goal: r -= 1
    if r < 0: break
    if legos[l] + legos[r] != goal or l == r: continue
    maxDiff = legos[r] - legos[l]
    ans = [legos[l], legos[r]]
    break

  if ans is None: print("danger")
  else: print(f"yes {ans[0]} {ans[1]}")

