N = int(input())
papers = list(enumerate(list(map(int, input().split()))))

out = []
curIdx = 0
for _ in range(N):
  realIdx, moveCount = papers[curIdx]
  out.append(realIdx + 1)
  del papers[curIdx]
  if len(papers) == 0: break
  if moveCount > 0: curIdx -= 1
  curIdx += moveCount
  curIdx %= len(papers)

print(" ".join(map(str, out)))
