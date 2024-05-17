const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

const EMPTY_WEIGHT = 1.2;
const VALUE_WEIGHT = 2;
const CORNER_WEIGHT = 10;
const SNAKE_WEIGHT = 4;
const POSITION_WEIGHT = 2;
const MERGEABLE_WEIGHT = 1.2;
const DANGER_WEIGHT = 0.01;

class Game2048 {
  /** @type {[dx: number, dy: number]} */
  prevMove = [0, 0];
  /** @type {number[][]} */
  board = Array.from({ length: 4 }, () => Array(4).fill(0));

  constructor() {}

  move(dx, dy) {
    const newGame = new Game2048();
    newGame.prevMove = [dx, dy];
    newGame.board = this.board.map(row => [...row]);
    const board = newGame.board;
    if (dy === 0) {
      for (let i = 0; i < 4; i++) {
        const row = board[i].filter(v => v !== 0);
        for (let j = 0; j < 4; j++) board[i][j] = 0;
        if (dx === 1) row.reverse();
        for (let j = 0; j < row.length; j++) {
          if (row[j] === row[j + 1]) {
            row.splice(j + 1, 1);
            row[j] *= 2;
          }
        }
        if (dx === -1) {
          for (let j = 0; j < row.length; j++) board[i][j] = row[j];
        } else {
          for (let j = 0; j < row.length; j++) board[i][3 - j] = row[j];
        }
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const col = [];
        for (let i = 0; i < 4; i++) {
          if (board[i][j] !== 0) col.push(board[i][j]);
          board[i][j] = 0;
        }
        if (dy === 1) col.reverse();
        for (let i = 0; i < col.length; i++) {
          if (col[i] === col[i + 1]) {
            col.splice(i + 1, 1);
            col[i] *= 2;
          }
        }
        if (dy === -1) {
          for (let i = 0; i < col.length; i++) board[i][j] = col[i];
        } else {
          for (let i = 0; i < col.length; i++) board[3 - i][j] = col[i];
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== board[i][j]) return newGame;
      }
    }
    return false;
  }

  calcRank() {
    const board = this.board;

    let rank = this.board.flat().reduce((a, b) => a + b ** VALUE_WEIGHT, 0);

    let maxSnakeRank = 0;
    let posValue;
    let snakeRank;
    let snakeLen;
    let prev;
    for (const djs of [-1, 1]) {
      let dj = djs;
      posValue = 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let i = 0; i < 4; i++) {
        let j = dj === -1 ? 3 : 0;
        while (0 <= j && j <= 3) {
          const cur = board[i][j];
          if (prev > cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue**8 * cur;
            snakeLen++;
          } else {
            snakeRank = posValue**8 * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue--;
          j += dj;
        }
        dj *= -1;
      }
      dj = djs;
      posValue = 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let i = 3; i >= 0; i--) {
        let j = dj === -1 ? 3 : 0;
        while (0 <= j && j <= 3) {
          const cur = board[i][j];
          if (prev > cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue**8 * cur;
            snakeLen++;
          } else {
            snakeRank = posValue**8 * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue--;
          j += dj;
        }
        dj *= -1;
      }
    }
    for (const dis of [-1, 1]) {
      let di = dis;
      posValue = 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let j = 0; j < 4; j++) {
        let i = di === -1 ? 3 : 0;
        while (0 <= i && i <= 3) {
          const cur = board[i][j];
          if (prev > cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue**8 * cur;
            snakeLen++;
          } else {
            snakeRank = posValue**8 * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue--;
          i += di;
        }
        di *= -1;
      }
      di = dis;
      posValue = 16;
      snakeRank = 0;
      snakeLen = 0;
      prev = null;
      for (let j = 3; j >= 0; j--) {
        let i = di === -1 ? 3 : 0;
        while (0 <= i && i <= 3) {
          const cur = board[i][j];
          if (prev > cur) {
            snakeRank += SNAKE_WEIGHT ** snakeLen * posValue**8 * cur;
            snakeLen++;
          } else {
            snakeRank = posValue**8 * cur;
            snakeLen = 1;
          }
          maxSnakeRank = Math.max(maxSnakeRank, snakeRank);
          prev = cur;
          posValue--;
          i += di;
        }
        di *= -1;
      }
    }

    rank *= maxSnakeRank;

    const maxBlock = Math.max(...board.flat());
    if (
      board[0][0] === maxBlock ||
      board[0][3] === maxBlock ||
      board[3][0] === maxBlock ||
      board[3][3] === maxBlock
    ) rank *= CORNER_WEIGHT;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) rank *= EMPTY_WEIGHT;
      }
    }
    rank *= MERGEABLE_WEIGHT ** this.mergeableCount();

    return Math.round(rank);
  }

  calcBestMove(depth = 1) {
    const directions = [
      [0, -1], [0, 1],
      [-1, 0], [1, 0]
    ];

    /** @type {[direction: [dx: number, dy: number], game: Game2048, rank: number][]} */
    let moves = [];
    for (const [dx, dy] of directions) {
      const game = this.move(dx, dy);
      if (!game) continue;
      moves.push([[dx, dy], game, game.calcRank()]);
    }
    moves = moves.filter(v => v[1]);

    for (let i = 1; i < depth; i++) {
      const newMoves = [];
      for (const [direction, game] of moves) {
        for (const [dx, dy] of directions) {
          const subMoves = [];
          let canEnd = false;
          for (let is = 0; is < 4; is++) {
            for (let js = 0; js < 4; js++) {
              if (game.board[is][js] !== 0) continue; 
              game.board[is][js] = 2;
              const subGame = game.move(dx, dy);
              if (!subGame) continue;
              game.board[is][js] = 0;
              subMoves.push([direction, subGame, subGame.calcRank()]);
              if (subGame.isEnd()) canEnd = true;
            }
          }
          if (subMoves.length === 0) continue;
          const worstSubMove = subMoves.sort((a, b) => a[2] - b[2])[0];
          if (canEnd) worstSubMove[2] *= DANGER_WEIGHT;
          newMoves.push(worstSubMove);
        }
      }
      if (newMoves.length === 0) break;
      moves = newMoves.filter(v => v[1]);
    }

    const bestMove = moves.sort((a, b) => b[2] - a[2])[0][0];

    let bestMoveName = "";
    if (bestMove[0] === -1) bestMoveName = "LEFT";
    else if (bestMove[0] === 1) bestMoveName = "RIGHT";
    else if (bestMove[1] === -1) bestMoveName = "UP";
    else if (bestMove[1] === 1) bestMoveName = "DOWN";
    /** @type {Game2048} */
    const bestGame = this.move(bestMove[0], bestMove[1]);

    return [bestMoveName, bestGame];
  }

  mergeableCount() {
    const board = this.board;
    let count = 0;
    for (let i = 0; i < 4; i++) {
      loop: for (let j = 0; j < 4; j++) {
        const cur = board[i][j];
        if (
          cur === 0 ||
          i !== 3 && board[i + 1][j] === cur ||
          board[i][j + 1] === cur
        ) {
          count++;
          continue loop;
        }
      }
    }
    return count;
  }

  isEnd() {
    return this.mergeableCount() === 0;
  }

  place(pos, value) {
    pos--;
    const y = Math.floor(pos / 4);
    const x = pos - 4 * y;
    this.board[y][x] = value;
  }

  print() {
    const out = Array.from({ length: 12 }, () => Array(24).fill(" "));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[3 * i][6 * j] = "┌";
        out[3 * i][6 * j + 1] = "─";
        out[3 * i][6 * j + 2] = "─";
        out[3 * i][6 * j + 3] = "─";
        out[3 * i][6 * j + 4] = "─";
        out[3 * i][6 * j + 5] = "┐";
        out[3 * i + 1][6 * j] = "│";
        out[3 * i + 1][6 * j + 5] = "│";
        out[3 * i + 2][6 * j] = "└";
        out[3 * i + 2][6 * j + 1] = "─";
        out[3 * i + 2][6 * j + 2] = "─";
        out[3 * i + 2][6 * j + 3] = "─";
        out[3 * i + 2][6 * j + 4] = "─";
        out[3 * i + 2][6 * j + 5] = "─";
        out[3 * i + 2][6 * j + 5] = "┘";
        if (this.board[i][j] === 0) continue;
        let numToPrint = this.board[i][j].toString();
        if (numToPrint.length < 4) numToPrint = " " + numToPrint;
        numToPrint = numToPrint.padEnd(4, " ");
        for (let k = 0; k < 4; k++) {
          out[3 * i + 1][6 * j + 1 + k] = numToPrint[k];
        }
      }
    }
    for (let i = 0; i < 12; i++) {
      out[i].unshift("│ ");
      out[i].push(" │");
    }
    const [dx, dy] = this.prevMove;
    let moveStr = dx === 0 && dy === 0 ? "NONE" : dx === -1 ? "LEFT" : dx === 1 ? "RIGHT" : dy === -1 ? "UP" : "DOWN";
    const score = Math.max(...this.board.flat());
    out.unshift(["┌" + (`Move: ${moveStr.padEnd(5, " ")} ─ Score:` + score.toString().padStart(5, " ") + " ").padStart(26, "─") + "┐"]);
    const rank = this.calcRank();
    out.push(["└" + `Rank: ${rank.toString().padStart(18, " ")}`.padStart(26, "─") + "┘"]);
    return out.map(row => row.join("")).join("\n");
  }
}




const interactiveTestDatas = [
  {
    seed: 234
  },
  {
    seed: 32
  },
  {
    seed: 1004
  }
];

/** @type {(data: (typeof interactiveTestDatas)[number]) => Promise<JudgeResult>} */
async function interactiveJudger(data) {
  const { seed } = data;

  let x = seed;
  /** @param {number[]} avaiables */
  const select = (avaiables) => {
    x = (x * x + 1) % 12343;
    return avaiables[x % avaiables.length];
  }

  let beforeSolve = true;
  let game = new Game2048();
  while (true) {
    if (game.isEnd()) break;
    const avaialbes = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (game.board[i][j] === 0) avaialbes.push(4 * i + j + 1);
      }
    }
    const selected = select(avaialbes);
    game.place(selected, 2);
    if (game.isEnd()) break;
    if (!beforeSolve) await interactiveSender(selected.toString());
    else solve(selected.toString());
    beforeSolve = false;

    const move = interactiveReceiver().trim();
    if (move === "") break;
    if (move === "UP") game = game.move(0, -1);
    else if (move === "DOWN") game = game.move(0, 1);
    else if (move === "LEFT") game = game.move(-1, 0);
    else if (move === "RIGHT") game = game.move(1, 0);
  }
  await interactiveSender("-1");
  interactiveReceiver();
  if (isDev) console.log(game.print());
  
  const score = Number(Math.max(...game.board.flat()));

  if (score < 8) return { type: "WA" };
  if (score < 2048) return { type: "PAC", score };
  return { type: "PAC", score };
}

/** @param {string} input */
function interactiveInput(input) {
  return Number(input);
}

/** @param {string} input */
async function solve(input) {
// input
const [[firstPos]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let game = new Game2048();
game.place(firstPos, 2);
while (true) {
  const [bestMoveName, bestGame] = game.calcBestMove(3);
  
  const placePos = await interactive(bestMoveName);
  if (placePos === -1) {
    if (Math.max(...game.board.flat()) < 8) throw "??";
    if (!isDev) process.exit(0);
    else await interactive("");
  }
  game = bestGame;
  game.place(placePos, 2);
}
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
    // console.log("\x1b[35m%s\x1b[0m", `<-`, `${output}`);

    const answer = await new Promise((resolve) => {
      interactiveResolve = resolve;
    });
    // console.log("\x1b[34m%s\x1b[0m\x1b[90m%s\x1b[0m", `->`, ` ${answer}`);

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
    // console.log("\x1b[34m%s\x1b[0m\x1b[90m%s\x1b[0m", `->`, ` ${input}`);
    ogSolve(input);
  }
  judge();
}
