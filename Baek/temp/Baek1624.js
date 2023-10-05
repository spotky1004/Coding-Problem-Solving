const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`6
3
6
0
9
5
4`,
`2`, "예제 입력 1");
check(`10
50
45
55
60
65
40
70
35
30
75`,
`1`, "예제 입력 2");
check(`10
0
2
1
4
3
6
5
8
7
9`,
`5`, "예제 입력 3");
check(`12
55
45
55
60
45
65
40
70
70
35
30
75`,
`1`, "예제 입력 4");
check(`6
3
6
0
9
5
4`,
`2`, "예제 입력 5");
check(`10
0
2
1
4
3
6
5
8
7
9`,
`5`, "예제 입력 6");
check(`17
454
537
7
976
537
908
976
908
-94
454
908
64
454
-731
908
-646
537`,
`4`, "예제 입력 7");
check(`3
3
3
3`,
`1`, "같은 숫자");
check(`6
3
6
0
9
6
3`,
`2`, "교차 1");
check(`6
3
6
3
6
3
6`,
`1`, "교차 2");
check(`1
1`,
`1`, "1");
check(`5
1
3
5
8
6`,
`2`, "마지막 2개 뒤집기");
check(`4
3
4
1
2`,
`2`, "마지막 2개 앞으로");
check(`4
1
3
5
3`,
`2`, "중간 거 뒤로");
check(`7
1
2
3
4
1
2
3
4`,
`2`, "중복 오름차 두번");
}

function solve(input) {
// input
const [N, ...rawNumbers] = input
  .trim()
  .split("\n")
  .map(Number);

// code
const numbers = rawNumbers.map(v => v + 1000);
let numberTypes = [...new Set(numbers)].length;

const sorted = [...numbers].sort((a, b) => a - b);
const nextNumber = Array(2001).fill(null);
const prevNumber = Array(2001).fill(null);
const numCount = Array(2001).fill(0);
for (let i = 0; i < N; i++) {
  numCount[sorted[i]]++;
  nextNumber[sorted[i]] = sorted[i + 1] ?? nextNumber[sorted[i]];
}
for (let i = N - 1; i >= 0; i--) {
  prevNumber[sorted[i]] = sorted[i - 1] ?? prevNumber[sorted[i]];
}

/**
 * 0: not watching
 * 
 * 1: watching left
 * 
 * 2: watching right
 * @type {(0 | 1 | 2)[]}
*/
const watching = Array(2001).fill(0);
let count = 0;
for (let i = 0; i < N; i++) {
  const n = numbers[i];
  numCount[n]--;
  
  const watchingStatus = watching[n];

  const sameLeft = numCount[n] > 0;
  let prev = sameLeft ? n : prevNumber[n]; 
  let next = sameLeft ? n : nextNumber[n];
  if (watchingStatus === 0) {
    console.log("t", nextNumber[n], n, watching[nextNumber[n]]);
    if (nextNumber[n] === n || watching[nextNumber[n]] !== 0) prev = prevNumber[n];
    if (prevNumber[n] === n || watching[prevNumber[n]] !== 0) next = nextNumber[n];
  }

  if (watchingStatus === 0) {
    count++;
    watching[prev] = 1;
    watching[next] = 2;
  } else if (watchingStatus === 1) {
    watching[prev] = 1;
  } else if (watchingStatus === 2) {
    watching[next] = 2;
  }
  console.log(n - 1000, count, prev - 1000, next - 1000);
}

// output
return count;
}
