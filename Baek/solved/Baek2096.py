N = int(input())

minScore = [0, 0, 0]
maxScore = [0, 0, 0]
for _ in range(N):
  a, b, c = list(map(int, input().split()))
  minScore = [
    a + min(minScore[0], minScore[1]),
    b + min(minScore[0], minScore[1], minScore[2]),
    c + min(minScore[1], minScore[2]),
  ]
  maxScore = [
    a + max(maxScore[0], maxScore[1]),
    b + max(maxScore[0], maxScore[1], maxScore[2]),
    c + max(maxScore[1], maxScore[2]),
  ]

print(str(max(maxScore)) + " " + str(min(minScore)))
