import math

N, K, C, R = list(map(int, input().split()))
base = list(map(int, input().split()))
s = list(map(int, input().split()))
p = list(map(int, input().split()))

stardust = 0
stress = 0
combo = 0
skills = [0] * K
for _ in range(N):
  toUse = int(input()) - 1
  if toUse == -1:
    stress = max(0, stress - R)
    combo = 0
    continue

  bi = base[toUse]
  si = s[toUse]
  pi = p[toUse]
  skill = skills[toUse]

  stress += pi
  if stress > 100:
    print(-1)
    exit()
  
  stardust += math.floor(bi * (1 + C * combo / 100) * (1 + skill * si / 100))
  skills[toUse] += 1
  combo += 1

print(stardust)
