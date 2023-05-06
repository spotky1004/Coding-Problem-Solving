const [, ...cases] =
(require('fs').readFileSync(0)+"")
// `6
// 4
// 2 00
// 3 10
// 4 01
// 4 00
// 5
// 3 01
// 3 01
// 5 01
// 2 10
// 9 10
// 1
// 5 11
// 3
// 9 11
// 8 01
// 7 10
// 6
// 4 01
// 6 01
// 7 01
// 8 00
// 9 01
// 1 00
// 4
// 8 00
// 9 10
// 9 11
// 8 11
// `
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];

let i = 0;
while (i < cases.length) {
  const n = cases[i][0];
  i++;
  const books = cases.slice(i, i + n);
  i += n;

  let minSkills = Infinity;
  const minSkill = [Infinity, Infinity];

  for (const [m, s] of books) {
    if (s === 11) {
      minSkills = Math.min(minSkills, m);
    } else if (s === 10) {
      minSkill[0] = Math.min(minSkill[0], m);
    } else if (s === 1) {
      minSkill[1] = Math.min(minSkill[1], m);
    }
  }

  minSkills = Math.min(
    minSkills,
    minSkill[0] + minSkill[1]
  );

  out.push(isFinite(minSkills) ? minSkills : -1);
}

console.log(out.join("\n"));
