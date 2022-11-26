n, d = map(int, input().split())
h = list(map(int, input().split()))

count = 0
maxBuild = max(h)
breakTo = max(0, maxBuild - d)
for i in range(0, n):
  count += max(0, h[i] - breakTo)

print(count)
