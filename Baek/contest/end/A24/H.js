const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

const interactiveTestDatas = [
  {
    N: "3",
    tree: [[], [2], [1, 3]]
  },
  {
    N: "10",
    tree: [[], [2, 4, 8], [1, 3, 5], [2], [1, 7], [2, 6], [5], [4], [1, 9], [8, 10], [9]]
  }
];

/** @type {(data: (typeof interactiveTestDatas)[number]) => Promise<JudgeResult>} */
async function interactiveJudger(data) {
  const { N, tree } = data;

  solve(N);

  const visited = Array(N + 1).fill(false);
  visited[1] = true;
  let curNode = 1;
  let count = 0;
  while (true) {
    const rec = interactiveReceiver();
    const [type, m] = rec.split(" ");
    if (type === "maze") {
      const moveables = tree[curNode];
      const notVisited = moveables.filter(v => !visited[v]);
      if (notVisited.length > 0) {
        curNode = notVisited[Math.floor(Math.random() * notVisited.length)];
        visited[curNode] = true;
        await interactiveSender(`${curNode}`);
      } else {
        curNode = moveables[Math.floor(Math.random() * moveables.length)];
        visited[curNode] = true;
        await interactiveSender(`${curNode}`);
      }
    } else if (type === "gaji") {
      const moveables = tree[curNode];
      if (!moveables.includes(Number(m))) return { type: "WA" };
      curNode = Number(m);
      await interactiveSender(`${curNode}`);
    } else {
      break;
    }
    count++;
    if (count > N * 4) return { type: "WA" };
  }

  return {
    type: "AC",
  }
}

/** @param {string} input */
function interactiveInput(input) {
  const [[k]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number))

  return k;
}

/** @param {string} input */
async function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
class Node {
  idx = -1;
  parent = null;
  children = [];
  done = false;
  constructor(idx, parent = null) {
    this.idx = idx;
    this.parent = parent;
  }
}



const nodes = Array(N + 1).fill(null);
const visited = Array(N + 1).fill(false);
visited[0] = true;
visited[1] = true;
let nodeLeft = N - 1;


const root = new Node(1);
nodes[1] = root;
let curNode = root;
while (nodeLeft !== 0) {
  const k = await interactive(`maze`);

  if (visited[k]) {
    curNode.done = true;
    curNode = nodes[k];
    while (curNode.done) {
      await interactive(`gaji ${curNode.parent.idx}`);
      curNode = curNode.parent;
    }
  } else {
    visited[k] = true;
    nodeLeft--;
    const newNode = new Node(k, curNode);
    curNode.children.push(newNode);
    curNode = newNode;
    nodes[k] = newNode;
  }
}

const out = ["answer"];
const queue = [root];
for (const node of queue) {
  for (const child of node.children) {
    out.push(`${node.idx} ${child.idx}`);
    queue.push(child);
  }
}

console.log(out.join("\n"));

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

  /** @type {(output: string) => Promise<ReturnType<interactiveInput>>} */
  async function interactive(output) {
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

  /** @type {(output: string) => Promise<ReturnType<interactiveInput>>} */
  async function interactive(output) {
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
