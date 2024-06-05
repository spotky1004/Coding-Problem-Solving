const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

const interactiveTestDatas = [
  // {
  //   choco: [[0, 0], [1, 0]],
  // },
  // {
  //   choco: [[9, 9], [9, 8]],
  // },
  // {
  //   choco: [[9, 9], [8, 9]],
  // },
  {
    choco: [[5, 5], [5, 6]],
  },
  {
    choco: [[5, 5], [5, 6]],
  },
  {
    choco: [[5, 5], [5, 6]],
  },
  {
    choco: [[5, 5], [5, 6]],
  },
  {
    choco: [[5, 5], [5, 6]],
  }
];

/** @type {(data: (typeof interactiveTestDatas)[number]) => Promise<JudgeResult>} */
async function interactiveJudger(data) {
  const { choco: [[x1, y1], [x2, y2]] } = data;

  solve("");
  const chocoBoard = Array.from({ length: 10 }, () => Array(10).fill(false));
  chocoBoard[y1][x1] = true;
  chocoBoard[y2][x2] = true;

  for (let i = 0; i < 51; i++) {
    const [type, x1, y1, x2, y2] = interactiveReceiver().split(" ");
    if (type === "?" && i < 50) {
      await interactiveSender(chocoBoard[y1][x1] ? "1" : "0");
    } else {
      if (
        typeof x2 === "undefined" ||
        typeof y2 === "undefined" ||
        (x1 === x2 && y1 === y2) ||
        !chocoBoard[y1][x1] ||
        !chocoBoard[y2][x2]
      ) return { type: "WA" };
      return { type: "AC" };
    }
  }

  return { type: "WA" };
}

/** @param {string} input */
function interactiveInput(input) {
const [[result]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number))

return result;
}

async function solve() {
// code
const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
const avaiables = [];
for (let r = 0; r <= 9; r++) {
  for (let c = 0; c <= 9; c++) {
    if (
      (r + c) % 2 === 1 ||
      (r === 0 && c === 0) ||
      (r === 9 && c === 9)
    ) continue;
    avaiables.push([r, c]);
  }
}

let found = false;
for (let i = 0; i < 48; i++) {
  const [r, c] = avaiables.splice(Math.floor(Math.random() * avaiables.length), 1)[0];
  const result1 = await interactive(`? ${r} ${c}`);
  if (!result1) continue;
  for (const [dr, dc] of directions) {
    const [tr, tc] = [r + dr, c + dc];
    if (
      0 > tr || tr > 9 ||
      0 > tc || tc > 9
    ) continue;
    const result2 = await interactive(`? ${tr} ${tc}`);
    if (!result2) continue;
    await interactive(`! ${r} ${c} ${tr} ${tc}`, true);
    found = true;
  }
}

if (!found) {
  const result1 = await interactive(`? 0 0`);
  if (result1) {
    const result2 = await interactive(`? 0 1`);
    if (result2) await interactive(`! 0 0 0 1`, true);
    else await interactive(`! 0 0 1 0`, true);
  } else {
    const result2 = await interactive(`? 9 8`);
    if (result2) await interactive(`! 9 9 9 8`, true);
    else await interactive(`! 9 9 8 9`, true);
  }
}


throw "!";
}

// Interactive
/** @type {[(output: string) => Promise<ReturnType<interactiveInput>>, () => string, (input: string) => Promise<void>}]} */
const [interactive, interactiveReceiver, interactiveSender] = !isDev ? (() => {
  let promiseResolve;
  let waitingInput = false;
  let waitingInteractive = false;

  const reader = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  reader.on("line", line => {
    if (waitingInteractive) {
      waitingInteractive = false;
      promiseResolve(interactiveInput(line));
    } else if (waitingInput) {
      waitingInput = false;
      solve(line);
    }
  });

  /** @type {(output: string, isEnd?: boolean) => Promise<ReturnType<interactiveInput>>} */
  async function interactive(output, isEnd = false) {
    if (isEnd) {
      console.log(output);
      process.exit(0);
    }

    /** @type {Promise<ReturnType<interactiveInput>>} */
    const question = new Promise((resolve) => {
      waitingInteractive = true;
      promiseResolve = resolve;
    });
    process.stdout.write(output);
    process.stdout.write("\n", () => { /** flush */ });
    return await question;
  }
  return [interactive, null, null];
})() : (() => {
  let receivedOutput = null;
  let interactiveResolve = null;

  /** @type {(output: string, isEnd?: boolean) => Promise<ReturnType<interactiveInput>>} */
  async function interactive(output, isEnd = false) {
    receivedOutput = output.toString();
    console.log("\x1b[35m%s\x1b[0m", `<-`, `${output}`);

    const answer = await new Promise((resolve) => {
      interactiveResolve = resolve;
    });
    console.log("\x1b[34m%s\x1b[0m\x1b[90m%s\x1b[0m", `->`, ` ${answer}`);

    return await new Promise((resolve) => resolve(interactiveInput(answer)));
  }

  /** @type {() => string} */
  function interactiveReceiver() {
    const output = receivedOutput;
    receivedOutput = null;
    return output;
  }

  /** @type {(input: string) => Promise<void>} */
  async function interactiveSender(input) {
    interactiveResolve(input);
    await new Promise((resolve) => {
      const intervalID = setInterval(() => {
        if (receivedOutput === null) return;
        clearInterval(intervalID);
        resolve();
      });
    });
  }

  return [interactive, interactiveReceiver, interactiveSender];
})();
solve();

/**
 * @typedef JudgeResult
 * @prop {"AC" | "PAC" | "WA"} type 
 * @prop {number?} score 
 */

if (isDev) {
  async function judge() {
    if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');
  
    let CASE_NR = 0;
    for (const data of interactiveTestDatas) {
      CASE_NR++;
      const startTime = new Date().getTime();
      const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
  
      const result = await interactiveJudger(data);
  
      const timeDeltaStr = (new Date().getTime() - startTime).toString();
      const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
      const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
      const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
  
      const displayScore = typeof result.score !== "undefined";
      const scoreStr = (result.score ?? 0).toString().padStart("10", " ");
  
      if (result.type === "AC") console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `Case ${CASE_NR}: `, ` ${displayScore ? scoreStr + " pt" : "AC"} `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
      else if (result.type === "PAC") console.log("\x1b[1m%s\x1b[43m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `Case ${CASE_NR}: `, ` ${displayScore ? scoreStr + " pt" : "AC"} `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
      else if (result.type === "WA") console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m", `Case ${CASE_NR}: `, ` ${displayScore ? scoreStr + " pt" : "WA"} `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    }
  }

  const ogSolve = solve;
  solve = (input) => {
    console.log("\x1b[34m%s\x1b[0m\x1b[90m%s\x1b[0m", `->`, ` ${input}`);
    ogSolve(input);
  }
  judge();
}
