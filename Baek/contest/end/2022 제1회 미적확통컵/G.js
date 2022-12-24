const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    : require("fs").readFileSync(__dirname + "/G_Input.txt", "utf-8")
)
  .trim()
  .split("\n")
  .map(Number);

const n = 5000;
for (let i = 0; i < input.length; i += n) {
  const numbers = input.slice(i, i + n);
  const avg = numbers.reduce((a, b) => a + b, 0)/n;
  const v = numbers.map(n => (n - avg)**2).reduce((a, b) => a + b, 0)/n;
  console.log(Math.abs(1/12 - v) < 0.01 ? "A" : "B");
}
