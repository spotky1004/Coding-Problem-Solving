const isDev = process.platform !== "linux";
const [, ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
5
a b
b c
a d
a e
e a`
)
  .trim()
  .split("\n");

let i = 0;
let out = "";
while (i < input.length) {
  const F = Number(input[i]);
  i++;

  /** @type {Map<string, number>} */
  const nameIndexMap = new Map();
  const roots = Array.from({ length: 1 }, (_, i) => i);
  const rootCountSum = Array(1).fill(1);

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

    if (roots[b] !== a) {
      rootCountSum[a] += rootCountSum[roots[b]];
      rootCountSum[roots[b]] = 0;
      roots[b] = a;
    }
  }

  /**
   * @param {string} name 
   */
  function getNameIndex(name) {
    const index = nameIndexMap.get(name);
    if (typeof index !== "undefined") return index;
    nameIndexMap.set(name, roots.length)
    roots.push(roots.length);
    rootCountSum.push(1);
    return roots.length - 1;
  }

  for (let j = 0; j < F; j++) {
    const toUnion = input[i].split(" ").map(v => getNameIndex(v));
    union(...toUnion);
    out += Math.max(rootCountSum[find(toUnion[0])], rootCountSum[find(toUnion[1])]) + "\n";
    i++;
  }
}

console.log(out.trim());
