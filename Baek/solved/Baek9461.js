n=(require("fs").readFileSync("/dev/stdin")+"").trim().split("\n").slice(1)
dp=[1,1,1]
a=1,b=1,c=1
for(i=2;i<105;i++)t=c,u=b,c=a+b,b=t,a=u,dp.push(c)
n.map(n=>console.log(dp[n-1]))