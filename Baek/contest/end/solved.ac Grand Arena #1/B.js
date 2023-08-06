const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
charlie
echo
?
romeo
oscar
3
alfa
oscar
or`
)
  .trim()
  .split("\n");

const N = Number(input.shift());
const S = input.splice(0, N);
const M = Number(input.shift());
const A = input.splice(0, M);

let questionWords = [];
for (let i = 0; i < N; i++) {
  if (S[i] !== "?") continue;
  questionWords.push(S[i - 1] ?? "?");
  questionWords.push(S[i + 1] ?? "?");
  break;
}

for (let i = 0; i < M; i++) {
  const word = A[i];
  if (
    S.includes(word) ||
    (questionWords[0] !== "?" && questionWords[0].slice(-1) !== word[0]) ||
    (questionWords[1] !== "?" && questionWords[1][0] !== word.slice(-1))
  ) continue;
  console.log(word);
  break;
}
