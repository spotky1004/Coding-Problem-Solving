const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`8
10
GD?DD??D?G
LWLWWWLWLL
10
GOG?GO???O
DDDDDDDDDD
10
GOGGGOGO?O
DDDDDDDDDD
10
G??????G??
DDDDDDDDDD
10
?GG?GD??GD
WWLWWLLLLW
10
D?GDOGD?DO
WLLDWLWWLL
7
G?G?GG?
WWWLWWL
7
??????D
WLLLLLL`,
`YES
GDGDDDGDGG
YES
GOGDGODDDO
YES
GOGGGOGODO
YES
GGGGGGGGGG
NO
NO
YES
GGGOGGO
YES
ODDDDDD`);
check(`7
2
??
DD
6
??????
WWWLLL
6
GOD???
DDDDDD
6
GGGGG?
DDDDDD
2
GO
DD
5
GGGGOO
DDDDDD
5
GGGDD
WWWLL`,
`YES
GG
YES
GGGOOO
YES
GODGGG
YES
GGGGGG
NO
NO
NO`);
check(`2
6
GGGGGG
WWWWWW
3
?G?
WWD`,
`NO
NO`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");
const T = Number(lines[0]);

// code
const vegIdx = new Map([
  ["G", 0],
  ["O", 1],
  ["D", 2],
]);
const vegNames = ["G", "O", "D"];
const out = [];
let line = 1;
caseLoop: for (let caseNr = 0; caseNr < T; caseNr++) {
  const N = Number(lines[line++]);
  const V = Array.from(lines[line++]);
  const R = Array.from(lines[line++]);

  if (R.every(v => v === "W") || R.every(v => v === "L")) {
    out.push("NO");
    continue caseLoop;
  }

  if (R.every(v => v === "D")) {
    const seenFalg = Array(3).fill(false);
    let qCount = 0;
    for (const Vi of V) {
      if (Vi === "?") {
        qCount++;
      } else {
        seenFalg[vegIdx.get(Vi)] = true;
      }
    }

    const seen = seenFalg.reduce((a, b) => a + (b === true), 0);
    const missing = 3 - seen;
    if (seen <= 1) {
      let seenIdx = seenFalg.findIndex(v => v);
      if (seenIdx === -1) seenIdx = 0;
      out.push(`YES`);
      out.push(V.fill(vegNames[seenIdx]).join(""));
    } else if (missing <= qCount) {
      out.push(`YES`);
      loop: for (let i = 0; i < N; i++) {
        if (V[i] !== "?") continue;
        for (let j = 0; j < 3; j++) {
          if (seenFalg[j]) continue;
          V[i] = vegNames[j];
          continue loop;
        }
        V[i] = "G";
      }
      out.push(V.join(""));
    } else {
      out.push(`NO`);
    }
  } else {
    if (R.includes("D")) {
      out.push("NO");
      continue caseLoop;
    }

    let wonVeg = null;
    let lostVeg = null;
    for (let i = 0; i < N; i++) {
      if (V[i] === "?") continue;
      if (R[i] === "W") {
        if (wonVeg === null) wonVeg = V[i];
        else if (wonVeg !== V[i]) {
          out.push("NO");
          continue caseLoop;
        }
      } else if (R[i] === "L") {
        if (lostVeg === null) lostVeg = V[i];
        else if (lostVeg !== V[i]) {
          out.push("NO");
          continue caseLoop;
        }
      }
    }

    if (wonVeg === null && lostVeg === null) {
      wonVeg = "G";
      lostVeg = "O";
    }
    if (wonVeg === null) {
      if (lostVeg === "O") wonVeg = "G";
      if (lostVeg === "D") wonVeg = "O";
      if (lostVeg === "G") wonVeg = "D";
    }
    if (lostVeg === null) {
      if (wonVeg === "D") lostVeg = "G";
      if (wonVeg === "G") lostVeg = "O";
      if (wonVeg === "O") lostVeg = "D";
    }

    if (
      !(
        (wonVeg === "G" && lostVeg === "O") ||
        (wonVeg === "O" && lostVeg === "D") ||
        (wonVeg === "D" && lostVeg === "G")
      )
    ) {
      out.push("NO");
      continue caseLoop;
    }

    for (let i = 0; i < N; i++) {
      if (R[i] === "W") V[i] = wonVeg;
      else V[i] = lostVeg;
    }
    out.push("YES");
    out.push(V.join(""));
  }
}

// output
return out.join("\n");
}
