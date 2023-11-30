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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`6 10
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
`,
`N T T T X W W P P P
N N T X X X W W P P
L N T U X U F W Z Z
L N Y U U U F F Z V
L Y Y Y Y F F Z Z V
L L I I I I I V V V`);
check(`8 8
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 1 1 0 0 0
0 0 0 1 1 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
`,
`T I I I I I P P
T T T N N X P P
T N N N X X X P
V V V 1 1 X F F
V U U 1 1 F F Y
V U W W Z Z F Y
L U U W W Z Y Y
L L L L W Z Z Y`);
check(`7 11
1 0 0 0 0 0 0 0 0 0 1
0 0 0 1 0 1 0 1 0 0 0
0 1 0 0 0 0 0 0 0 1 0
0 0 0 1 0 1 0 1 0 0 0
0 1 0 0 0 0 0 0 0 1 0
0 0 0 1 0 1 0 1 0 0 0
1 0 0 0 0 0 0 0 0 0 1
`,
`1 P P P I I I I I F 1
V P P 1 T 1 X 1 F F F
V 1 T T T X X X Z 1 F
V V V 1 T 1 X 1 Z Z Z
W 1 L L L L U U U 1 Z
W W L 1 Y 1 U 1 U N N
1 W W Y Y Y Y N N N 1`);
check(`8 11
0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 1 1 1 0 0 0
0 1 1 1 1 1 1 1 0 0 0
0 1 1 1 1 1 1 1 0 0 0
0 1 1 1 1 1 1 1 0 0 0
0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0
`,
`V V V I I I I I U U U
V 1 1 1 1 1 1 1 U X U
V 1 1 1 1 1 1 1 X X X
Y 1 1 1 1 1 1 1 F X N
Y 1 1 1 1 1 1 1 F F N
Y Y W Z Z P T F F N N
Y W W Z P P T T T N L
W W Z Z P P T L L L L`);
check(`8 11
1 1 0 0 1 1 1 0 0 1 1
1 0 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 0 1
0 0 1 1 0 0 0 1 1 0 0
0 0 1 1 0 0 0 1 1 0 0
0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0
1 0 1 1 1 1 1 1 1 0 1
`,
`1 1 W W 1 1 1 U U 1 1
1 W W F T T T U Z Z 1
1 W F F F T V U U Z 1
P P 1 1 F T V 1 1 Z Z
P P 1 1 V V V 1 1 L N
P X Y Y Y Y L L L L N
X X X Y I I I I I N N
1 X 1 1 1 1 1 1 1 N 1`);
check(`11 10
1 1 1 0 0 0 0 1 1 1
1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 1 0 1 1
0 0 0 0 1 1 0 0 0 1
0 0 0 0 1 1 0 0 0 0
0 0 0 0 1 1 0 0 0 1
0 0 0 0 1 1 1 0 1 1
0 0 0 0 0 0 0 0 1 1
1 1 0 0 0 0 0 0 1 1
1 1 0 0 1 1 0 0 1 1
1 1 0 0 1 1 0 0 1 1
`,
`1 1 1 F F W W 1 1 1
1 1 F F 1 1 W W 1 1
1 1 P F 1 1 1 W 1 1
L L P P 1 1 U U X 1
L T P P 1 1 U X X X
L T T T 1 1 U U X 1
L T N N 1 1 1 I 1 1
V V V N N N Y I 1 1
1 1 V Z Z Y Y I 1 1
1 1 V Z 1 1 Y I 1 1
1 1 Z Z 1 1 Y I 1 1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= M ||
    0 > y || y >= N
  ) return true;
  return false;
}



const shapes = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0]
  ],
  [
    [1],
    [1],
    [1],
    [1],
    [1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, 0]
  ],
  [
    [1, 1],
    [1, 1],
    [1, 0]
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0]
  ],
  [
    [1, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 1],
    [1, 1],
    [0, 1],
    [0, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ]
];
const shapeNames = [
  "F", "I", "L", "N",
  "P", "T", "U", "V",
  "W", "X", "Y", "Z"
];

function getMatData(shape) {
  return [shape[0].length, shape.length];
}
function rotateShape(shape) {
  const [w, h] = getMatData(shape);
  const rotated = Array.from({ length: w }, _ => Array(h).fill(0));
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      rotated[i][j] = shape[h - j - 1][i];
    }
  }
  return rotated;
}
function flipShape(shape) {
  const [w, h] = getMatData(shape);
  const fliped = Array.from({ length: h }, _ => Array(w).fill(0));
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      fliped[i][w - j - 1] = shape[i][j];
    }
  }
  return fliped;
}
function isSameShape(a, b) {
  const [w, h] = getMatData(a);
  const [w1, h1] = getMatData(b);
  if (w !== w1 || h !== h1) return false;
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}
function canFitShape(shape, x, y) {
  const [w, h] = getMatData(shape);
  const poses = [];
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (shape[i][j] === 0) continue;

      const [px, py] = [x + j, y + i];
      if (checkOOB(px, py) || board[py][px] !== 0) return false;
      poses.push([px, py]);
    }
  }
  return poses;
}

const avaiablePoses = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    if (board[i][j] === 1) continue;
    avaiablePoses.push([j, i]);
  }
}
const posComp = new Map();
for (let i = 0; i < avaiablePoses.length; i++) {
  const [x, y] = avaiablePoses[i];
  const key = y * 1000 + x;
  posComp.set(key, i);
}

const sets = [];
const setSize = 60 + 12;
for (let i = 0; i < shapes.length; i++) {
  const variants = [];
  let cur = shapes[i];
  for (let j = 0; j < 8; j++) {
    if (!variants.some(s => isSameShape(s, cur))) {
      variants.push(cur);
    }

    cur = rotateShape(cur);
    if (j === 3) cur = flipShape(cur);
  }

  for (const shape of variants) {
    const [w, h] = getMatData(shape);
    const seenSets = new Set();

    for (const [x, y] of avaiablePoses) {
      for (let xOff = 0; xOff < w; xOff++) {
        for (let yOff = 0; yOff < h; yOff++) {
          if (
            shape[yOff][xOff] === 0 ||
            x - xOff < 0 ||
            y - yOff < 0
          ) continue;
          const set = Array(setSize).fill(0);

          const result = canFitShape(shape, x - xOff, y - yOff);
          if (!result) break;
          for (const [px, py] of result) {
            set[posComp.get(py * 1000 + px)] = 1;
          }
          set[60 + i] = 1;

          const setBin = set.reduce((a, b, i) => a + BigInt(b) * 2n**BigInt(i), 0n);
          if (seenSets.has(setBin)) continue;
          sets.push(set);
          seenSets.add(setBin);
        }
      }
    }
  }
}

function dlx(sets) {
  class Node {
    /** @type {number} */
    setIdx = -1;
  
    /** @type {number} */
    size = 0;
    /** @type {Node} */
    top;
    
    /** @type {Node} */
    l;
    /** @type {Node} */
    r;
    /** @type {Node} */
    u;
    /** @type {Node} */
    d;

    constructor() {}
  }

  const setLen = sets[0].length;
  const setCount = sets.length;
  /** @type {(Node | null)[][]} */
  const setsTable = Array.from({ length: setCount + 1 }, _ => Array(setLen + 1).fill(null));
  for (let i = 0; i <= setLen; i++) {
    const node = new Node();
    node.setIdx = -1;
    node.size = 0;
    node.top = node;

    setsTable[0][i] = node;
  }
  for (let i = 0; i < setCount; i++) {
    const set = sets[i];
    for (let j = 0; j < setLen; j++) {
      if (set[j] === 0) continue;
      const node = new Node();
      node.setIdx = i;
      node.top = setsTable[0][j + 1];
      node.top.size++;

      setsTable[i + 1][j + 1] = node;
    }
  }

  for (let i = 0; i <= setLen; i++) {
    /** @type {Node | null} */
    let firstNode = null;
    /** @type {Node | null} */
    let prevNode = null;
    for (let j = 0; j <= setCount; j++) {
      const curNode = setsTable[j][i];
      if (curNode === null) continue;
      if (prevNode !== null) {
        prevNode.d = curNode;
        curNode.u = prevNode;
      }
      prevNode = curNode;
      if (firstNode === null) firstNode = curNode;
    }
    if (firstNode !== null && prevNode !== null) {
      firstNode.u = prevNode;
      prevNode.d = firstNode;
    }
  }
  for (let i = 0; i <= setCount; i++) {
    /** @type {Node | null} */
    let firstNode = null;
    /** @type {Node | null} */
    let prevNode = null;
    for (let j = 0; j <= setLen; j++) {
      const curNode = setsTable[i][j];
      if (curNode === null) continue;
      if (prevNode !== null) {
        prevNode.r = curNode;
        curNode.l = prevNode;
      }
      prevNode = curNode;
      if (firstNode === null) firstNode = curNode;
    }
    if (firstNode !== null && prevNode !== null) {
      firstNode.l = prevNode;
      prevNode.r = firstNode;
    }
  }

  /** @type {Node} */
  const root = setsTable[0][0];
  function findMinHead() {
    /** @type {Node | -1} */
    let minHead = -1;
    let minHeadSize = Infinity;

    for (let head = root.r; head !== root; head = head.r) {
      if (head.size === 0) return -1;
      if (head.size >= minHeadSize) continue;
      minHead = head;
      minHeadSize = head.size;
    }

    return minHead;
  }

  /**
   * @param {Node} head 
   */
  function cover(head) {
    head.l.r = head.r;
    head.r.l = head.l;

    for (let a = head.d; a !== head; a = a.d) {
      for (let b = a.r; b !== a; b = b.r) {
        b.top.size--;
        b.u.d = b.d;
        b.d.u = b.u;
      }
    }
  }

  /**
   * @param {Node} head 
   */
  function uncover(head) {
    head.l.r = head;
    head.r.l = head;

    for (let a = head.d; a !== head; a = a.d) {
      for (let b = a.r; b !== a; b = b.r) {
        b.top.size++;
        b.u.d = b;
        b.d.u = b;
      }
    }
  }

  let depth = -1;
  const minHeads = [];
  const selectedNodes = [];
  const covered = [];
  while (true) {
    depth++;
    if (root.r === root) {
      return selectedNodes.map(node => node.setIdx).sort((a, b) => a - b);
    }

    const minHead = findMinHead();
    if (minHead === -1) {
      depth--;
      if (depth === -1) return -1;
      while (true) {
        if (depth === -1) {
          return -1;
        }
        while (true) {
          const toUncover = covered.pop();
          if (toUncover === -1) break;
          uncover(toUncover);
        }

        selectedNodes[depth] = selectedNodes[depth].d;
        const moved = selectedNodes[depth];
        if (moved === moved.top) {
          depth--;
          minHeads.pop();
          selectedNodes.pop();
          continue;
        }

        const minHead = minHeads[depth];
        covered.push(-1);
        covered.push(minHead);
        cover(minHead);
        for (let node = moved.r; node !== moved; node = node.r) {
          covered.push(node.top);
          cover(node.top);
        }
        break;
      }
      continue;
    }

    minHeads.push(minHead);
    const selected = minHead.d;
    selectedNodes.push(selected);
    covered.push(-1);
    covered.push(minHead);
    cover(minHead);
    for (let node = selected.r; node !== selected; node = node.r) {
      covered.push(node.top);
      cover(node.top);
    }
  }

  return -1;
}

const result = dlx(sets);
if (result === -1) return "??? ????? ??";

for (const idx of result) {
  const set = sets[idx];

  let shapeName = "?";
  for (let i = 0; i < 12; i++) {
    if (set[60 + i] === 1) shapeName = shapeNames[i];
  }

  for (let i = 0; i < 60; i++) {
    if (set[i] === 0) continue;
    const [x, y] = avaiablePoses[i];
    board[y][x] = shapeName;
  }
}

// output
return board.map(row => row.join(" ")).join("\n");
}
