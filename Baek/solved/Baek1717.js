const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const roots = Array.from({ length: 1000000 + 1 }, (_, i) => i);

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

let out = "";
rl.on('line', function(line) {
  const [type, a, b] = line.split(" ").map(Number);
  if (typeof b === "undefined") return;

  if (type === 0) {
    union(a, b);
  } else if (type === 1) {
    out += find(a) === find(b) ? "YES\n" : "NO\n";
  }
}).on("close", function() {
  console.log(out.trim());
  process.exit();
});
