const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`ajskdlf;`
)
  .trim();

const taBub = new Map([
  ["fdsajkl;", "in-out"],
  ["jkl;fdsa", "in-out"],
  ["asdf;lkj", "out-in"],
  [";lkjasdf", "out-in"],
  ["asdfjkl;", "stairs"],
  [";lkjfdsa", "reverse"],
]);
console.log(taBub.get(input) ?? "molu");
