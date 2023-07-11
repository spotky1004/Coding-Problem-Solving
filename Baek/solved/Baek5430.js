const isDev = process?.platform !== "linux";
const [T, ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
DDDRD
5
[1,5,3,76,2]`
)
  .trim()
  .split("\n")

let line = 0;
const out = [];
while (line < input.length) {
  const commands = input[line++];
  const n = Number(input[line++]);
  const arr = input[line++].slice(1,-1).split(",");

  const removeCounts = [0, 0];
  let removeState = 0;
  for (const command of commands) {
    if (command === "R") removeState ^= 1;
    else removeCounts[removeState]++;
  }
  
  if (removeCounts[0] + removeCounts[1] > n) {
    out.push("error");
  } else {
    const removedArr = arr.slice(removeCounts[0], -removeCounts[1] || Infinity);
    if (removeState === 1) removedArr.reverse();
    out.push(`[${removedArr.join(",")}]`)
  }
}
console.log(out.join("\n"));
