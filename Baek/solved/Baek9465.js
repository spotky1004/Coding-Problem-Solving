p=`2
5
50 10 100 20 40
30 50 70 10 60
7
10 30 10 50 100 20 40
20 40 30 50 60 20 80`.split("\n").map(e=>e.split(" ").map(Number))
o=""
for(i=0,l=p.shift()[0];i<l;i++){n=p.shift()[0]-1
s=p.splice(0,2)
for(x=1;x<=n;x++)for(y of [0,1])s[y][x]+=Math.max(s[y^1][x-1],s[y^1][x-2]|0)
o+=Math.max(s[0][n],s[1][n])+"\n"}console.log(o.trim())