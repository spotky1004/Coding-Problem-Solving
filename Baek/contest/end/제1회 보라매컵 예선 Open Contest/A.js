[a,b]=(require('fs').readFileSync(0)+"").split("\n")
console.log(b.split(" ").reduce((a,b)=>a+Math.min(a,b),0))