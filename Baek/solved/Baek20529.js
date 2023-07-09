const isDev = process?.platform !== "linux";
const [[T], ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
3
ENTJ INTP ESFJ
4
ESFP ESFP ESFP ESFP
5
INFP INFP ESTP ESTJ ISTJ`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

function calcDist(a, b, c) {
  let dist = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) dist++;
  for (let i = 0; i < 4; i++) if (b[i] !== c[i]) dist++;
  for (let i = 0; i < 4; i++) if (a[i] !== c[i]) dist++;
  return dist;
}

const mbtiTypes = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
const mbtiIdxes = new Map(mbtiTypes.map((v, i) => [v, i]));

let line = 0;
const out = [];
while (line < input.length) {
  line++;
  const mbti = input[line].map(v => mbtiIdxes.get(v));
  line++;

  const counts = Array(16).fill(0);
  for (const n of mbti) {
    if (counts[n] >= 3) continue;
    counts[n]++;
  }
  
  if (counts.includes(3)) {
    out.push(0);
    continue;
  }

  let min = Infinity;

  if (counts.includes(2)) {
    for (let i = 0; i < 16; i++) {
      if (counts[i] !== 2) continue;
      for (let j = 0; j < 16; j++) {
        if (i === j || counts[j] === 0) continue;
        min = Math.min(min, calcDist(mbtiTypes[i], mbtiTypes[i], mbtiTypes[j]));
      }
    }
  }
  for (let i = 0; i < 16; i++) {
    if (counts[i] === 0) continue;
    for (let j = i + 1; j < 16; j++) {
      if (counts[j] === 0) continue;
      for (let k = j + 1; k < 16; k++) {
        if (counts[k] === 0) continue;
        min = Math.min(min, calcDist(mbtiTypes[i], mbtiTypes[j], mbtiTypes[k]));
      }
    }
  }

  out.push(min);
}
console.log(out.join("\n"));
