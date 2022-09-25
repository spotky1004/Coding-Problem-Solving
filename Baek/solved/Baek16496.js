const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10
1 1 1 123 1 1 1 1 1 10`
)
  .trim()
  .split("\n")

/** const [N] = */ void input.shift();
const numbers = input.shift().split(" ").sort((a, b) => b.padEnd(14, "8") - a.padEnd(14, "8"));
const outputTrack = [];
let output = "";

while (numbers.length > 0) {
  let selectedIdx = 0;
  let selectedNumber = numbers[0];
  loop: for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    if (selectedNumber === number) continue;
    const m1 = selectedNumber + number;
    const m2 = number + selectedNumber;
    for (let j = 0; j < m1.length; j++) {
      const d1 = m1[j];
      const d2 = m2[j];
      if (d1 > d2) break;
      if (d1 === d2) continue;
      selectedIdx = i;
      selectedNumber = number;
      break loop;
    }
  }

  output += selectedNumber;
  outputTrack.push(selectedNumber);
  void numbers.splice(selectedIdx, 1);
}

if (output.startsWith("0")) {
  console.log(0);
} else {
  console.log(output);
}
