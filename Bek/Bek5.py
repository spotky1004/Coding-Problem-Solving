import math
n=int(input())
l=lambda x:str(len(str(math.ceil(x))))
fact=0
for x in range(1,n+1):
 fact+=math.log10(x)
print("\n".join([*map(l,[math.log(n,5),n**.5,n**3])]+[str(math.ceil(fact))]))