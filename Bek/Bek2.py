n=500001
p=[*range(n)]
p[0]=p[1]=None
for x in range(n):
 if x and p[x]:
  for y in range(x*2,n,x):
   p[y]=None
p=[*filter(lambda x:x is not None,p)]
p=[p[i-1]for i in[*filter(lambda x:x<len(p),p)]]
for i in range(int("1")):
  print("YES") if int("5") in p else print("NO")