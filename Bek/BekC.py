toInput = "8\n-1 -2 2 -3 7 8 -9 -10".split("\n")
input = lambda: toInput.pop(0)

nLength = int(input())
n = [*map(int, input().split())]

answer = [0, 0]

minusCounter = 0
firstMinus = [0, None]
lastMinus = [nLength-1, None]
for i in range(nLength):
    if n[i] < 0:
        minusCounter += 1
        if not firstMinus[1]:
            firstMinus = [i, n[i]]
        else:
            lastMinus = [i, n[i]]


answer = [firstMinus[0], lastMinus[0]]
if minusCounter%2:
    if not lastMinus[1] or firstMinus[1] > lastMinus[1]:
        answer[0] += 1
    else:
        answer[1] -= 1

print(" ".join([*map(lambda x: str(x+1),answer)]))
