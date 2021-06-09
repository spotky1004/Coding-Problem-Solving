b=[*map(int,list(input()))]
c=[]
for i in range(int(input())):
 c=b.copy()
 for j in range(*map(int,[*input().split()[1:]])):
  c[j]=b[j-1]^b[j]
 b=c.copy()
 print("".join([*map(str,b)]))