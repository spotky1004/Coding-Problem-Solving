[A,B]=`100 40021`.split(" ")
loop=1
while(B&&B!=A){loop++
if(!(B%10-1)){B--;B/=10}else if(!(B%2))B/=2
else break
}console.log(B!=A?-1:loop)