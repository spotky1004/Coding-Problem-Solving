k = int(input())
inputStr = str(input())

maxLen = 0
prevStateLen = 0
state = "N"
stateLen = 0
for i in range(0, k):
  part = inputStr[i]
  if not state == part:
    prevStateLen = stateLen
    state = part
    stateLen = 0
  stateLen += 1
  maxLen = max(maxLen, min(prevStateLen, stateLen) * 2)

print(maxLen)
