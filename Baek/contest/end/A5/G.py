import functools

N = int(input())
p = list(map(int, input().split()))
questions = []

for i in range(N):
  questions.append(list(map(int, input().split())))

def compare(item1, item2):
  if item1[0] != item2[0]:
    return item1[0] - item2[0]
  return item1[1] - item2[1]

questions.sort(key = functools.cmp_to_key(compare))

aTime = 0
qIdx = 0
i = 0
j = 0
while i < 5:
  if i != 0:
    aTime += 60
  prevTime = None
  j = 0
  while j < p[i]:
    k, t = questions[qIdx]
    qIdx += 1
    if k != i + 1:
      continue
    aTime += t + (abs(t - prevTime) if (prevTime is not None) else 0)
    prevTime = t
    j += 1
  i += 1

print(aTime)