n=+require("fs").readFileSync("/dev/stdin")
a=1,b=1
for(i=1;i<n;i++)t=b,b=(a+b)%15746,a=t
console.log(b)