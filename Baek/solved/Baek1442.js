i=(require("fs").readFileSync("/dev/stdin")+"").trim().split("\n");
n=i.shift().split(" ")[1]
s=i.sort((a,b)=>(b+a)-(a+b)).slice(0,n)
l=Math.max(...s.map(v=>v.length))
m=i.filter(t=>t.length===l)[0]
o=i.concat(Array(n-s.length).fill(m)).sort((a,b)=>(b+a)-(a+b)).join("")
console.log(o.split("").every(c=>c==="0")?"0":o)