import sys

gameCount = 100

K = int(input())
machine = ["5"] * gameCount
inverse = {"0": "5", "2": "0", "5": "2"}
for i in range(gameCount):
  machine[i] = "0"
  print("? " + "".join(map(lambda v: inverse[v], machine)))
  sys.stdout.flush()
  
  newK = int(input())
  if newK < K:
    machine[i] = "5"
    newK += 1
  elif newK == K:
    machine[i] = "2"
    newK += 1
  elif newK > K:
    machine[i] = "0"

  K = newK

print("! " + "".join(machine))
sys.stdout.flush()
