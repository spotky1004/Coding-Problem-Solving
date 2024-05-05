const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

const interactiveTestDatas = [
  // {
  //   T: 300,
  //   answers: Array.from({ length: 300 }, (_, i) => 2100 + i)
  // },
  {
    T: 1,
    answers: [2345]
  }
];

/** @type {(data: (typeof interactiveTestDatas)[number]) => Promise<JudgeResult>} */
async function interactiveJudger(data) {
  const { T, answers } = data;

  solve(T.toString());

  let maxQCount = 0;
  for (const x of answers) {
    let qCount = 0;
    let didMistake = false;
    while (true) {
      const received = interactiveReceiver().split(" ");
      const type = received[0];
      const value = Number(received[1]);
      if (type === "?") {
        qCount++;
        if (qCount > 18) return { type: "WA" };
        const isUp = x <= value;
        let doMistake = false;
        if (
          !didMistake &&
          (
            qCount === 13 ||
            Math.random() <= 0.15
          )
        ) doMistake = true;
        if (doMistake) didMistake = true;
        await interactiveSender((isUp ^ doMistake).toString());
      } else if (type === "!") {
        if (x !== value) return { type: "WA" };
        break;
      } else {
        return { type: "WA" };
      }
    }
    maxQCount = Math.max(maxQCount, qCount);
  }

  let score = 0;
  if (maxQCount <= 18) score += 23;
  if (maxQCount <= 14) score += 29;
  if (maxQCount <= 48) score += 48;

  return {
    type: "AC",
    score
  }
}

/** @param {string} input */
function interactiveInput(input) {
  const [[isUp]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number))

  return isUp;
}

/** @param {string} input */
async function solve(input) {
// input
const [[T]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @typedef {[value: number, isUp: boolean][]} Conditions
 */

/**
 * @param {Conditions} conditions 
 */
function genAvaiables(conditions) {
  const avaiables = [];
  loop: for (let i = 2100; i < 2400; i++) {
    for (const [value, isUp] of conditions) {
      if (
        (isUp && value < i) ||
        (!isUp && value >= i)
      ) continue loop;
    }
    avaiables.push(i);
  }
  return avaiables;
}

for (let caseNr = 0; caseNr < T; caseNr++) {
  /** @type {Conditions} */
  const conditions = [];
  while (true) {
    let avaiables = genAvaiables(conditions);
    const center = avaiables[Math.floor(avaiables.length / 2)];
    const isUp = await interactive(`? ${center}`);
    conditions.push([center, isUp]);
    console.log(conditions);
  }
}

// end
if (!isDev) process.exit(0);
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
      return;
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
