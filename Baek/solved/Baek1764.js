const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 4
ohhenrie
charlie
baesangwook
obama
baesangwook
ohhenrie
clinton`
)
  .trim()
  .split("\n")

const [N, M] = input.shift().split(" ").map(Number);

const dut = new Set();
for (let i = 0; i < N; i++) {
  dut.add(input[i]);
}

const out = [];
for (let i = N; i < input.length; i++) {
  if (dut.has(input[i])) out.push(input[i]);
}
console.log(out.length + "\n" + out.sort().join("\n"));
