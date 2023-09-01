import sys

n = int(input())
avaiables = []
for i in range(n):
  avaiables.append([True, True, True])

for i in range(2):
  out = ""
  for j in range(n):
    a, b, c = avaiables[j]
    if a == True:
      out += "swimming "
      avaiables[j][0] = False
    elif b == True:
      out += "bowling "
      avaiables[j][1] = False
    else:
      out += "soccer "
      avaiables[j][2] = False

  print(out)
  sys.stdout.flush()
  if i == 1:
    break
  fs = list(map(str, input().split()))
  for j in range(n):
    f = fs[j]
    avaialbe = avaiables[j]
    if f == "swimming":
      avaialbe[0] = False
    elif f == "bowling":
      avaialbe[1] = False
    else:
      avaialbe[2] = False
