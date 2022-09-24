const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10
1 111101111 1011111 10 10101010 101101110 101010101 111111111 111111110 1011111`
)
  .trim()
  .split("\n")

/** const [N] = */ void input.shift();
const numbers = input.shift().split(" ").sort((a, b) => b.padEnd(14, "8") - a.padEnd(14, "8"));
const outputTrack = [];
let output = "";

while (numbers.length > 0) {
  // const maxDigit = [...new Set(numbers.join("").split(""))].sort((a, b) => b - a)[0];
  let selectedIdx = 0;
  let selectedNumber = numbers[0];
  for (let i = 0; i < numbers.length; i++) {
    if (selectedNumber.length === 1) break;
    const number = numbers[i];
    if (selectedNumber === number) continue;
    for (let j = 0; j < number.length; j++) {
      const d1 = selectedNumber[j];
      const d2 = number[j];
      if (d1 > d2) break;
      if (d1 === d2) continue;
      if (+selectedNumber >= +number.slice(j, j + selectedNumber.length)) break;
      selectedIdx = i;
      selectedNumber = number;
      break;
    }
  }

  output += selectedNumber;
  outputTrack.push(selectedNumber);
  void numbers.splice(selectedIdx, 1);
}

if (output.startsWith("0")) {
  console.log(0);
} else {
  console.log(outputTrack, output);
}
