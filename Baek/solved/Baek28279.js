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
check(`11
6
1 3
1 8
7
8
3
2 5
1 2
5
4
4`,
`1
8
3
8
3
5
3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @template T
*/
class Deque {
  /** @type {T[]} */
  #arr = Array(1 << 10);
  l = 1 << 9;
  r = 1 << 9;

  constructor() {}

  #reallocate() {
    const len = this.r - this.l;
    const newArr = len >= (this.#arr.length >> 2) ? Array(this.#arr.length << 1) : Array(this.#arr.length);
    const center = this.#arr.length >> 1, offset = center - (len >> 1);
    for (let i = len - 1; i >= 0; i--) newArr[offset + i] = this.#arr[this.l + i];
    this.#arr = newArr;
    this.l = offset, this.r = offset + len;
  }

  entries() { return this.#arr.slice(this.l, this.r); }

  get length() { return this.r - this.l; }

  /** @param {T} item */
  unshift(item) {
    this.#arr[--this.l] = item;
    if (this.l === 0) this.#reallocate();
    return this.r - this.l;
  }

  /** @param {T} item */
  push(item) {
    this.#arr[this.r++] = item;
    if (this.r === this.#arr.length - 1) this.#reallocate();
    return this.r - this.l;
  }

  first() { return this.r - this.l !== 0 ? this.#arr[this.l] : null; }
  shift() { return this.r - this.l !== 0 ? this.#arr[this.l++] : null; }

  last() { return this.r - this.l !== 0 ? this.#arr[this.r - 1] : null; }
  pop() { return this.r - this.l !== 0 ? this.#arr[--this.r] : null; }
}



const out = [];
/** @type {Deque<number>} */
const deque = new Deque();
for (const [type, X] of queries) {
  if (type === 1) deque.unshift(X);
  else if (type === 2) deque.push(X);
  else if (type === 3) out.push(deque.length ? deque.shift() : -1);
  else if (type === 4) out.push(deque.length ? deque.pop() : -1);
  else if (type === 5) out.push(deque.length);
  else if (type === 6) out.push(deque.length ? 0 : 1);
  else if (type === 7) out.push(deque.length ? deque.first() : -1);
  else if (type === 8) out.push(deque.length ? deque.last() : -1);
}

// output
return out.join("\n");
}
