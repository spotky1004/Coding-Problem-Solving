l=int(input())
s=0
n=[*map(int,input().split())]
for i in range(l):
 s+=int(n[i])
if s<l*5000:
 print(s)