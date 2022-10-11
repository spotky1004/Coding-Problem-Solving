acc = [0] * 10000
for _ in range(0, int(input())):
  acc[int(input()) - 1] += 1

out = ""
for i in range(1, 10000):
  out += (str(i) + "\n") * acc[i - 1]

print(out.rstrip())
