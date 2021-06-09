toInput = "11\n10 10 20 20 20 0 10 10 30 40 0".split("\n")
input = lambda: toInput.pop(0)

bLength = int(input())
b = input().split()
before = b[0]
answer = 0
for i in range(1, bLength):
    if before == b[i]:
        answer += 1
    before = b[i]

print(answer)