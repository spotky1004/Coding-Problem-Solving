const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 11
0 1 7
0 3 5
1 2 8
1 3 9
1 4 7
2 4 5
3 4 15
3 5 6
4 5 8
4 6 9
5 6 11
0 0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let i = 0;
let output = "";
while (i + 1 < input.length) {
  const [V, E] = input[i];
  i++;
  const lines = input.slice(i, i + E);
  i += E;

  const roots = Array.from({ length: V + 1 }, (_, i) => i);
  
  /**
   * @param {number} a 
  */
  function find(a) {
    if (roots[a] === a) return a;
  
    const root = find(roots[a]);
    roots[a] = root;
    return root;
  }
  
  /**
   * @param {number} a 
   * @param {number} b 
  */
  function union(a, b){
    a = find(a);
    b = find(b);
  
    roots[b] = a;
  }
  
  
  
  void lines.sort((a, b) => a[2] - b[2]);
  
  let costAcc = 0;
  for (const [from, to, cost] of lines) {
    if(find(from) !== find(to)) {
      costAcc += cost;
      union(from, to);
    }
  }
  
  output += (lines.reduce((a, b) => a + b[2], 0) - costAcc) + "\n";
}

console.log(output.trim());
