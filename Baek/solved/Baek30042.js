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
check(`14 12
............
.+v+........
.<0>+...+-+.
.+^+|+-->.<.
....++.+<1>.
...+--+|+-+.
...|..++....
...|........
.+-v^-+.....
.|....|+v+..
.<.2..>>3|..
.+-v--+|.>..
.......+^+..
............
5
4 0 1 1 1
3 0 1 0
4 0 0 0 0
7 2 0 1 1 0 2 2
3 1 0 1
3 1 1 0
3 0 1 1
5 1 0 1 1 2
2 0 0
4 2 3 1 0
3
Good
(0)Day(0)Night
Hello(1)(0)ByeGood
3
1 2 0
6
0 1 2 3 3 2
1 0 1 0 0 3
4 2 1 3 8 1`,
`ldoa!!`);
check(`10 10
..........
..........
.....+^+..
.....|1|..
..++.+^+..
..|+--+...
..+--+....
.+---+.+v+
.+-----<0|
.......+-+
2
1 0
1 0
1 0
1 0
1
A
1
0
2
0 1
0 0
1 1`,
`AA`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

let line = 0;
const [H, W] = lines[line++].split(" ").map(Number);
const board = lines.slice(line, line + H);
line += H;
const Np = Number(lines[line++]);
const C = [];
const D = lines.slice(line, line + Np).map(v => v.split(" ").map(Number));
line += Np;
for (let i = 0; i < Np; i++) C.push(D[i].shift());
const E = [];
const F = lines.slice(line, line + Np).map(v => v.split(" ").map(Number));
line += Np;
for (let i = 0; i < Np; i++) E.push(F[i].shift());
const K = Number(lines[line++]);
const S = lines.slice(line, line + K);
line += K;
const Mp = Number(lines[line++]);
const G = lines[line++].split(" ").map(Number);
const Q = Number(lines[line++]);
const Y = lines[line++].split(" ").map(Number);
const O = lines[line++].split(" ").map(Number);
const P = lines[line++].split(" ").map(BigInt);

// code
const lenS = [];
for (let i = 0; i < K; i++) {
  let len = 0n;
  const Si = S[i];
  for (let j = 0; j < Si.length; j++) {
    if (Si[j] !== "(") {
      len++;
    } else {
      let subIdx = "";
      for (let k = j + 1; Si[k] !== ")"; k++) {
        subIdx += Si[k];
      }
      len += lenS[subIdx];
      j += subIdx.length + 1;
    }
  }
  lenS.push(len);
}

function parseBoard() {
  let visited = Array.from({ length: H }, _ => Array(W).fill(0));
  /** @type {Map<number, [boxIdx: number, inputIdx: number, parent: [boxIdx: number, outputIdx: number] | null]>} */
  const inputs = new Map();
  /** @type {Map<number, [boxIdx: number, outputIdx: number, direction: [di: number, dj: number]]>} */
  const outputs = new Map();

  const isOOB = (i, j) => 0 > i || i >= H || 0 > j || j >= W;
  const isNum = (c) => "0" <= c && c <= "9";
  const IOChars = ["<", ">", "^", "v"];
  const isIO = (c) => IOChars.includes(c);
  const lineChars = ["|", "-", "+"];
  const isLine = (c) => lineChars.includes(c);
  const hashPos = (i, j) => i * W + j;
  const unhashPos = (x) => [Math.floor(x / W), x % W];

  const directions = [
    [1, 0], [-1, 0],
    [0, 1], [0, -1]
  ];

  function parseBox(si, sj) {
    let i1 = si, j1 = sj, i2 = si, j2 = sj;

    let boxIdx = 0;
    for (let j = sj; j < W; j++) {
      const c = board[si][j];
      if (!isNum(c)) break;
      boxIdx = 10 * boxIdx + Number(c);
    }

    visited[si][sj] = true;
    const queue = [[si, sj]];
    for (const [i, j] of queue) {
      for (const [di, dj] of directions) {
        const [ti, tj] = [i + di, j + dj];
        if (
          isOOB(ti, tj) ||
          visited[ti][tj]
        ) continue;

        const c = board[ti][tj];
        if (
          isIO(c) ||
          isLine(c)
        ) continue;

        visited[ti][tj] = true;
        queue.push([ti, tj]);
        i1 = Math.min(i1, ti);
        j1 = Math.min(j1, tj);
        i2 = Math.max(i2, ti);
        j2 = Math.max(j2, tj);
      }
    }

    let inputCount = 0;
    let outputCount = 0;
    // up
    for (let j = j1 - 1; j <= j2 + 1; j++) {
      const i = i1 - 1;
      const c = board[i][j];
      visited[i][j] = true;
      if (c === "v") {
        inputs.set(hashPos(i, j), [boxIdx, inputCount, null]);
        inputCount++;
      } else if (c === "^") {
        outputs.set(hashPos(i, j), [boxIdx, outputCount, [-1, 0]]);
        outputCount++;
      }
    }
    // right
    for (let i = i1 - 1; i <= i2 + 1; i++) {
      const j = j2 + 1;
      const c = board[i][j];
      visited[i][j] = true;
      if (c === "<") {
        inputs.set(hashPos(i, j), [boxIdx, inputCount, null]);
        inputCount++;
      } else if (c === ">") {
        outputs.set(hashPos(i, j), [boxIdx, outputCount, [0, 1]]);
        outputCount++;
      }
    }
    // bottom
    for (let j = j2 + 1; j >= j1 - 1; j--) {
      const i = i2 + 1;
      const c = board[i][j];
      visited[i][j] = true;
      if (c === "^") {
        inputs.set(hashPos(i, j), [boxIdx, inputCount, null]);
        inputCount++;
      } else if (c === "v") {
        outputs.set(hashPos(i, j), [boxIdx, outputCount, [1, 0]]);
        outputCount++;
      }
    }
    // left
    for (let i = i2 + 1; i >= i1 - 1; i--) {
      const j = j1 - 1;
      const c = board[i][j];
      visited[i][j] = true;
      if (c === ">") {
        inputs.set(hashPos(i, j), [boxIdx, inputCount, null]);
        inputCount++;
      } else if (c === "<") {
        outputs.set(hashPos(i, j), [boxIdx, outputCount, [0, -1]]);
        outputCount++;
      }
    }
  }

  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      if (
        visited[i][j] ||
        !isNum(board[i][j])
      ) continue;
      parseBox(i, j);
    }
  }

  visited = visited.map((row, i) => row.map((_, j) => board[i][j] === "+" ? visited[i][j] : false));
  const sortedOutputs = [...outputs].sort((a, b) => a[1][0] - b[1][0]);

  loop: for (const [posHash, [boxIdx, outputIdx, [sdi, sdj]]] of sortedOutputs) {
    let [i, j] = unhashPos(posHash);
    i += sdi;
    j += sdj;
    let di = sdi;
    let dj = sdj;
    if (
      isOOB(i, j) ||
      (sdi === 0 && board[i][j] === "|") ||
      (sdj === 0 && board[i][j] === "-")
    ) continue;
    
    while (!isIO(board[i][j]) && !visited[i][j]) {
      visited[i][j] = true;
      const c = board[i][j];
      if (c === "+") {
        if (
          !isOOB(i - 1, j) &&
          !visited[i - 1][j] &&
          (board[i - 1][j] === "|" || board[i - 1][j] === "+" || board[i - 1][j] === "^")
        ) {
          i--;
          di = -1;
          dj = 0;
        } else if (
          !isOOB(i + 1, j) &&
          !visited[i + 1][j] &&
          (board[i + 1][j] === "|" || board[i + 1][j] === "+" || board[i + 1][j] === "v")
        ) {
          i++;
          di = 1;
          dj = 0;
        } else if (
          !isOOB(i, j - 1) &&
          !visited[i][j - 1] &&
          (board[i][j - 1] === "-" || board[i][j - 1] === "+" || board[i][j - 1] === "<")
        ) {
          j--;
          di = 0;
          dj = -1;
        } else if (
          !isOOB(i, j + 1) &&
          !visited[i][j + 1] &&
          (board[i][j + 1] === "-" || board[i][j + 1] === "+" || board[i][j + 1] === ">")
        ) {
          j++;
          di = 0;
          dj = 1;
        }
      } else if (c === "|") {
        if (!isOOB(i - 1, j) && di === -1) {
          i--;
        } else {
          i++;
        }
      } else if (c === "-") {
        if (!isOOB(i, j - 1) && dj === -1) {
          j--;
        } else {
          j++;
        }
      } else if (c === ".") {
        continue loop;
      }
    }

    inputs.get(hashPos(i, j))[2] = [boxIdx, outputIdx];
  }

  /** @type {[inputParents: ([boxIdx: number, outputIdx: number] | null)[], outputCount: number][]} */
  const boxes = Array.from({ length: Np }, () => [[], 0]);
  for (const [, [boxIdx, , parent]] of inputs) {
    boxes[boxIdx][0].push(parent);
  }
  for (const [, [boxIdx]] of outputs) {
    boxes[boxIdx][1]++;
  }

  return boxes;
}
const boxDatas = parseBoard();
const N = boxDatas.length;

/** @type {bigint[]} */
const lenPROCs = [];
/** @type {[inputLens: bigint[], outputLens: bigint[]][]} */
const lenIOs = [];
for (let boxIdx = 0; boxIdx < N; boxIdx++) {
  /** @type {[inputLens: bigint[], outputLens: bigint[]]} */
  const lens = [[], []];
  lenIOs.push(lens);

  const [inputParents, outputCount] = boxDatas[boxIdx];
  const inputCount = inputParents.length;
  let lenPROC = 0n;
  const Di = D[boxIdx];
  for (let i = 0; i < inputCount; i++) {
    const parent = inputParents[i];
    const len = parent !== null ? lenIOs[parent[0]][1][parent[1]] : 0n;
    if (Di.includes(i)) lenPROC += len;
    lens[0].push(len);
  }
  lenPROCs.push(lenPROC);

  if (outputCount === 0) continue;
  if (boxIdx !== 0) {
    const Ei = E[boxIdx];
    const Fi = F[boxIdx];
    const loopCount = lenPROC / BigInt(Ei);
    const rem = Number(lenPROC % BigInt(Ei));
    for (let i = 0; i < outputCount; i++) {
      let count = 0n;
      for (const Fij of Fi) {
        if (Fij === i) count++;
      }
      const len = count * loopCount;
      lens[1].push(len);
    }
    for (let i = 0; i < rem; i++) {
      lens[1][Fi[i]]++;
    }
  } else {
    for (let i = 0; i < outputCount; i++) {
      lens[1].push(lenS[G[i]]);
    }
  }
}

/**
 * @param {number} SIdx 
 * @param {bigint} charIdx 
 */
function getNthSChar(SIdx, charIdx) {
  let acc = 0n;
  const Si = S[SIdx];
  for (let i = 0; i < Si.length; i++) {
    const c = Si[i];
    if (c !== "(") {
      if (charIdx === acc) return c;
      acc++;
    } else {
      let subIdx = "";
      for (let j = i + 1; Si[j] !== ")"; j++) {
        subIdx = subIdx += Si[j];
      }
      const subLen = lenS[subIdx];
      if (charIdx < acc + subLen) return getNthSChar(Number(subIdx), charIdx - acc);
      acc += subLen;
      i += subIdx.length + 1;
    }
  }
  return "!";
}

const E19 = 10n**19n;
const simulateableChunks = Array.from({ length: N }, () => []);
loop: for (let boxIdx = 0; boxIdx < N; boxIdx++) {
  const Ai = boxDatas[boxIdx][0].length;
  const Di = D[boxIdx];

  const chunks = simulateableChunks[boxIdx];

  const inLens = lenIOs[boxIdx][0];
  const inCharIdxes = Array(Ai).fill(0n);

  let newDi = Di.filter(Dij => inLens[Dij] !== inCharIdxes[Dij]);
  let incrementPerLoop = Array(Ai).fill(0n);
  for (const Dij of newDi) incrementPerLoop[Dij]++;
  const increments = Array(Ai).fill(0n);

  while (true) {
    if (newDi.length === 0) {
      chunks.push(E19);
      continue loop;
    }
    const loopLength = BigInt(newDi.length);

    let l = 1n, r = E19;
    binSearchLoop: while (l + 1n < r) {
      const m = (l + r) / 2n;

      const loopCount = m / loopLength;
      const rem = Number(m % loopLength);
      increments.fill(0n);
      for (let i = 0; i < Ai; i++) {
        increments[i] += loopCount * incrementPerLoop[i];
      }
      for (let i = 0; i < rem; i++) {
        increments[newDi[i]]++;
      }

      for (let i = 0; i < Ai; i++) {
        if (inLens[i] - inCharIdxes[i] >= increments[i]) continue;
        r = m;
        continue binSearchLoop;
      }
      l = m;
    }

    const simCount = l;
    const loopCount = simCount / loopLength;
    const rem = Number(simCount % loopLength);
    for (let i = 0; i < Ai; i++) {
      inCharIdxes[i] += loopCount * incrementPerLoop[i];
    }
    for (let i = 0; i < rem; i++) {
      inCharIdxes[newDi[i]]++;
    }
    chunks.push(simCount);

    newDi.push(...newDi.splice(0, rem));
    newDi = newDi.filter(Dij => inLens[Dij] !== inCharIdxes[Dij]);
    incrementPerLoop = Array(Ai).fill(0n);
    for (const Dij of newDi) incrementPerLoop[Dij]++;
  }
}

const bigE = E.map(BigInt);

/**
 * @param {number} boxIdx 
 * @param {number} outputIdx 
 * @param {bigint} charIdx 
 */
function getNthOutputChar(boxIdx, outputIdx, charIdx) {
  if (boxIdx === 0) {
    return getNthSChar(G[outputIdx], charIdx);
  }

  const lenPROC = lenPROCs[boxIdx];
  const Ai = boxDatas[boxIdx][0].length;
  const Di = D[boxIdx];
  const Ei = bigE[boxIdx];
  const Fi = F[boxIdx];

  let countF = 0n;
  for (const Fij of Fi) {
    if (Fij === outputIdx) countF++;
  }
  if (countF === 0n) return "!";
  const ELoopCount = (charIdx + 1n) / countF - 1n;
  let PROCIdx = BigInt(Ei) * ELoopCount;
  let charIdxRem = (charIdx + 1n) - countF * ELoopCount;
  for (let i = 0; i < 2; i++) {
    for (const Fij of Fi) {
      if (charIdxRem === 0n) break;
      PROCIdx++;
      if (Fij === outputIdx) charIdxRem--;
    }
  }

  if (lenPROC < PROCIdx) return "!";

  let PROCleft = PROCIdx;
  const inLens = lenIOs[boxIdx][0];
  const inCharIdxes = Array(Ai).fill(0n);

  let newDi = Di.filter(Dij => inLens[Dij] !== inCharIdxes[Dij]);
  let incrementPerLoop = Array(Ai).fill(0n);
  for (const Dij of newDi) incrementPerLoop[Dij]++;
  const chunks = simulateableChunks[boxIdx];
  let chunkNr = 0;

  while (true) {
    if (newDi.length === 0) return "!";
    const loopLength = BigInt(newDi.length);

    let simCount = PROCleft;
    if (simCount > chunks[chunkNr]) simCount = chunks[chunkNr];
    PROCleft -= simCount;
    const loopCount = simCount / loopLength;
    const rem = Number(simCount % loopLength);
    for (let i = 0; i < Ai; i++) {
      inCharIdxes[i] += loopCount * incrementPerLoop[i];
    }
    for (let i = 0; i < rem; i++) {
      inCharIdxes[newDi[i]]++;
    }

    if (PROCleft === 0n) {
      const inputIdx = newDi[(rem + newDi.length - 1) % newDi.length];
      const parent = boxDatas[boxIdx][0][inputIdx];
      if (parent === null) return "!";
      return getNthOutputChar(parent[0], parent[1], inCharIdxes[inputIdx] - 1n);
    }

    newDi.push(...newDi.splice(0, rem));
    newDi = newDi.filter(Dij => inLens[Dij] !== inCharIdxes[Dij]);
    incrementPerLoop = Array(Ai).fill(0n);
    for (const Dij of newDi) incrementPerLoop[Dij]++;
    chunkNr++;
  }
}

// console.log(getNthOutputChar(1, 0, 5n))

// let tmp = "";
// for (let i = 0n; i < 40n; i++) {
//   tmp += getNthOutputChar(3, 0, i);
// }
// console.log(tmp);

const out = [];
for (let i = 0; i < Q; i++) {
  const Yi = Y[i];
  const Oi = O[i];
  const Pi = P[i];
  out.push(getNthOutputChar(Yi, Oi, Pi - 1n));
}

// output
return out.join("");
}
