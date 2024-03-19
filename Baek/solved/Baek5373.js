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
check(`4
1
L-
2
F+ B+
4
U- D- L+ R+
10
L- U- L+ U- L- U- U- L+ U+ U+`,
`rww
rww
rww
bbb
www
ggg
gwg
owr
bwb
gwo
www
rww`);
check(`1
16
D- R+ F- F- R+ R- F- L+ U+ U+ U+ L+ L+ D- B+ B+`,
`gwr
bwg
yoo`);
check(`8
2
F+ U+
3
L+ U+ B+
4
D- L+ U- L-
5
U- D+ R+ U+ R-
4
F+ F+ F- F-
1
D-
16
U+ R+ R+ F+ F+ R+ R+ U+ F+ F+ R+ R+ F+ F+ U- L+
8
U+ B- R- F- D+ L- B+ U-`,
`gww
gww
gww
ybb
www
www
rww
www
woo
www
www
gro
www
www
www
www
www
www
oyw
oww
byw
rgo
bwo
wby`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

// code
class Cube {
  static SIDE_NAMES = ["U", "D", "F", "B", "L", "R"];
  static SIDE_IDXES = {
    "U": 0,
    "D": 1,
    "F": 2,
    "B": 3,
    "L": 4,
    "R": 5
  };
  static SIDE_COLS = ["w", "y", "r", "o", "g", "b"];

  /** @type {string[][][]} */
  sides = [];
  
  constructor() {
    for (let i = 0; i < 6; i++) {
      const side = [];
      this.sides.push(side);
      const sideCol = Cube.SIDE_COLS[i];
      for (let j = 0; j < 3; j++) {
        side.push([sideCol, sideCol, sideCol]);
      }
    }
  }

  /**
   * @param {keyof typeof Cube["SIDE_IDXES"] | number} value 
   */
  getSide(value) {
    if (typeof value === "string") return this.sides[Cube.SIDE_IDXES[value]];
    return this.sides[value];
  }

  /**
   * @param {`${keyof typeof Cube["SIDE_IDXES"]}${"+" | "-"}`} query 
   */
  rotate(query) {
    const [sideName, direction] = query;
    if (sideName === "U") {
      if (direction === "+") {
        this.#rotateSide(0, true);
        this.#cycleCorners([[3, 0, 1], [5, 0, 1], [2, 0, 1], [4, 0, 1]]);
      } else if (direction === "-") {
        this.#rotateSide(0, false);
        this.#cycleCorners([[3, 0, 0], [4, 0, 0], [2, 0, 0], [5, 0, 0]]);
      }
    }
    if (sideName === "D") {
      if (direction === "+") {
        this.#rotateSide(1, true);
        this.#cycleCorners([[2, 2, 0], [5, 2, 0], [3, 2, 0], [4, 2, 0]]);
      } else if (direction === "-") {
        this.#rotateSide(1, false);
        this.#cycleCorners([[2, 2, 1], [4, 2, 1], [3, 2, 1], [5, 2, 1]]);
      }
    }
    if (sideName === "F") {
      if (direction === "+") {
        this.#rotateSide(2, true);
        this.#cycleCorners([[0, 2, 1], [5, 3, 1], [1, 0, 1], [4, 1, 1]]);
      } else if (direction === "-") {
        this.#rotateSide(2, false);
        this.#cycleCorners([[0, 2, 0], [4, 1, 0], [1, 0, 0], [5, 3, 0]]);
      }
    }
    if (sideName === "B") {
      if (direction === "+") {
        this.#rotateSide(3, true);
        this.#cycleCorners([[0, 0, 1], [4, 3, 1], [1, 2, 1], [5, 1, 1]]);
      } else if (direction === "-") {
        this.#rotateSide(3, false);
        this.#cycleCorners([[0, 0, 0], [5, 1, 0], [1, 2, 0], [4, 3, 0]]);
      }
    }
    if (sideName === "L") {
      if (direction === "+") {
        this.#rotateSide(4, true);
        this.#cycleCorners([[0, 3, 1], [2, 3, 1], [1, 3, 1], [3, 1, 1]]);
      } else if (direction === "-") {
        this.#rotateSide(4, false);
        this.#cycleCorners([[0, 3, 0], [3, 1, 0], [1, 3, 0], [2, 3, 0]]);
      }
    }
    if (sideName === "R") {
      if (direction === "+") {
        this.#rotateSide(5, true);
        this.#cycleCorners([[0, 1, 1], [3, 3, 1], [1, 1, 1], [2, 1, 1]]);
      } else if (direction === "-") {
        this.#rotateSide(5, false);
        this.#cycleCorners([[0, 1, 0], [2, 1, 0], [1, 1, 0], [3, 3, 0]]);
      }
    }
  }

  /**
   * @param {keyof typeof Cube["SIDE_IDXES"] | number} value 
   */
  printSide(value) {
    return this.getSide(value).map(row => row.join("")).join("\n");
  }

  printCube() {
    const figure = Array.from({ length: 9 }, () => Array(12).fill(" "));
    const offsets = [
      [0, 3], [6, 3], [3, 3],
      [3, 9], [3, 0], [3, 6]
    ];
    for (let i = 0; i < 6; i++) {
      const [oy, ox] = offsets[i];
      const side = this.sides[i];
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          figure[oy + y][ox + x] = side[y][x];
        }
      }
    }
    return figure.map(row => row.join("")).join("\n");
  }

  /**
   * @param {number} idx 
   * @param {boolean} clockwise 
   */
  #rotateSide(idx, clockwise) {
    const side = this.sides[idx];
    const clone = side.flat();
    if (clockwise) {
      side[0][0] = clone[6];
      side[0][1] = clone[3];
      side[0][2] = clone[0];
      side[1][0] = clone[7];
      side[1][1] = clone[4];
      side[1][2] = clone[1];
      side[2][0] = clone[8];
      side[2][1] = clone[5];
      side[2][2] = clone[2];
    } else {
      side[0][0] = clone[2];
      side[0][1] = clone[5];
      side[0][2] = clone[8];
      side[1][0] = clone[1];
      side[1][1] = clone[4];
      side[1][2] = clone[7];
      side[2][0] = clone[0];
      side[2][1] = clone[3];
      side[2][2] = clone[6];
    }
  }

  static #cornerOrders = [
    [
      [[0, 0], [0, 1], [0, 2]],
      [[0, 2], [0, 1], [0, 0]]
    ],
    [
      [[0, 2], [1, 2], [2, 2]],
      [[2, 2], [1, 2], [0, 2]]
    ],
    [
      [[2, 2], [2, 1], [2, 0]],
      [[2, 0], [2, 1], [2, 2]]
    ],
    [
      [[2, 0], [1, 0], [0, 0]],
      [[0, 0], [1, 0], [2, 0]]
    ]
  ];

  /**
   * @param {[sideIdx: number, cornerIdx: number, direction: number][]} corners 
   */
  #cycleCorners(corners) {
    const cornerClones = [];
    for (let i = 0; i < corners.length; i++) {
      const [sideIdx, cornerIdx, direction] = corners[i];
      const side = this.sides[sideIdx];
      const clone = [];
      cornerClones.push(clone)
      for (const [y, x] of Cube.#cornerOrders[cornerIdx][direction]) {
        clone.push(side[y][x]);
      }
    }
    for (let i = 0; i < corners.length; i++) {
      const [sideIdx, cornerIdx, direction] = corners[i];
      const side = this.sides[sideIdx];
      const clone = cornerClones[(i + 3) % 4];
      const orders = Cube.#cornerOrders[cornerIdx][direction];
      for (let j = 0; j < 3; j++) {
        const [y, x] = orders[j];
        side[y][x] = clone[j];
      }
    }
  }
}

let line = 0;
const T = Number(lines[line++]);
const out = [];
for (let caseNr = 0; caseNr < T; caseNr++) {
  const n = Number(lines[line++]);
  const queries = lines[line++].split(" ");

  const cube = new Cube();
  for (const query of queries) {
    cube.rotate(query);
    // console.log(query);
    // console.log(cube.printCube());
  }
  out.push(cube.printSide("U"));
}

// output
return out.join("\n");
}
