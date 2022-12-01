const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
2 B A
4 A B C D
2 A C`
)
  .trim()
  .split("\n")
  .slice(1)
  .map(line => line.split(" ").slice(1));

const root = new Map();
for (const data of input) {
  let watchingNode = root;
  for (const nextNodeName of data) {
    if (watchingNode.has(nextNodeName)) {
      watchingNode = watchingNode.get(nextNodeName);
    } else {
      const nextNode = new Map();
      watchingNode.set(nextNodeName, nextNode);
      watchingNode = nextNode;
    }
  }
}

/**
 * @typedef {Map<string, NodeMap>} NodeMap
 * 
 * @param {NodeMap} root 
 */
function outputify(root, depth=0) {
  const entries = [...root.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  let output = "";
  for (const [name, node] of entries) {
    output += "--".repeat(depth) + name + "\n";
    output += outputify(node, depth + 1);
  }
  return output;
}

console.log(outputify(root).trim());
