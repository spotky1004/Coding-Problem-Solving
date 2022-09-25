o=(require("fs").readFileSync("/dev/stdin")+"").split("\n")[1].split(" ").sort((a,b)=>(b+a)-(a+b)).join("")
console.log(o.split("").every(c=>c==="0")?"0":o)