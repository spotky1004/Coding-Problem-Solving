const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

const interactiveTestDatas = [
  {
    input: "0"
  }
];

/** @type {(data: (typeof interactiveTestDatas)[number]) => Promise<JudgeResult>} */
async function interactiveJudger(data) {
  const { input } = data;

  solve(input);

  const [, received] = interactiveReceiver().split(" ");
  await interactiveSender("1");

  const score = Number(received);

  return {
    type: "AC",
    score
  }
}

/** @param {string} input */
function interactiveInput(input) {
const [[x]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number))

return x;
}

/** @param {string} input */
async function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const x = await interactive(`? 1004`);
}

// Interactive
/** @type {[(output: string) => Promise<ReturnType<interactiveInput>>, () => string, (input: string) => Promise<void>}]} */
const [interactive, interactiveReceiver, interactiveSender] = !isDev ? (() => {
  let promiseResolve;
  let waitingInput = true;
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
