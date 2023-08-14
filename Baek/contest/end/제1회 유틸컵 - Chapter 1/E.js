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
check(`6 20000 10000 4
1 2000
4 1
2 3000
3 5000
L 500
L 1000
L 1500
G
L 1000
L 2000
G
L 3000
L 2000
G
L 4000
L 6000
G
L 3000
L 6000
L 9000
18
1 1
3 1
3 2
3 3
1 1
1 1
1 2
2 1
6 5
6 6
3 1
5 4
1 1
2 3
6 3
5 5
2 1
1 3`,
`WIN`);
check(`6 20000 10000 4
1 2000
2 3000
3 5000
4 1
L 500
L 1000
L 1500
G
L 1000
L 2000
G
L 3000
L 2000
G
L 4000
L 6000
G
L 3000
L 6000
L 9000
17
1 1
3 1
3 2
3 3
1 1
1 1
1 2
2 1
6 5
6 6
3 1
5 4
1 1
2 3
2 5
2 1
4 2`,
`LOSE`);
check(`4 30 10 2
3 20
4 2
L 5
L 10
L 5
G
L 10
L 5
G
L 5
6
2 3
2 2
3 1
2 4
4 3
2 1`,
`LOSE`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n, S, W, G], ...datas] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const cards = datas.splice(0, G);
const cells = datas.splice(0, 4 * n - 8);
const [I] = datas.shift();
const rolls = datas;

cells.splice(n * 0 - 0, 0, ["start"]);
cells.splice(n * 1 - 1, 0, ["island"]);
cells.splice(n * 2 - 2, 0, ["social"]);
cells.splice(n * 3 - 3, 0, ["space"]);
console.log(cells);

let money = S;
let islandTurn = 0;
let socialMoney = 0;
let isCardTurn = false;

let curCell = 0;
for (let i = 0; i < I; i++) {
  const [a, b] = isCardTurn ? [0, 0] : rolls[i];
  isCardTurn = false;
  if (islandTurn === 0) {
    curCell += Number(a) + Number(b);
    while (curCell >= cells.length) {
      money += Number(W);
      curCell -= cells.length;
    }
    const [cellType, cellData] = cells[curCell];
    if (cellType === "start") {

    } else if (cellType === "island") {
      islandTurn = 3;
    } else if (cellType === "social") {
      money += socialMoney;
      socialMoney = 0;
    } else if (cellType === "space") {
      curCell = cells.length;
    } else if (cellType === "G") {
      const [cardType, cardData] = cards.shift();
      cards.push([cardType, cardData]);
      if (cardType === "1") money += Number(cardData);
      else if (cardType === "2") money -= Number(cardData);
      else if (cardType === "3") {
        socialMoney += Number(cardData);
        money -= Number(cardData);
      } else if (cardType === "4") {
        curCell += Number(cardData);
        isCardTurn = true;
        i--;
      }

      if (money < 0) {
        return "LOSE";
      }
    } else {
      const cost = Number(cellData);
      if (cost <= money) {
        money -= cost;
        cells[curCell][1] = 0;
      }
    }
  } else {
    islandTurn--;
    if (a === b) islandTurn = 0;
  }
}

// output
return cells.every(([type, data]) => type !== "L" || data === 0) ? "WIN" : "LOSE";
}
