toInput = "3 4\n0 0 10000 10000\n2500 2500 7500 7500\n4567 1234 4567 1234\n0 0\n10000 10000\n5600 5600\n4567 1234".split("\n")
input = lambda: toInput.pop(0)


inverseSq = []

A,B=[*map(int,input().split())]

for i in range(A):
    inverseSq.append([*map(int,input().split())])

inverseSq = sorted(inverseSq,key=lambda l:l[0])

ans = ""
for i in range(B):
    toSearch = [*map(int,input().split())]
    spot = 0
    for j in range(A):
        inverse = inverseSq[j]
        if inverse[0] <= toSearch[0] and inverse[1] <= toSearch[1] and toSearch[0] <= inverse[2] and toSearch[1] <= inverse[3]:
            spot += 1
    ans += str(spot%2) + "\n"

print(ans.rstrip())