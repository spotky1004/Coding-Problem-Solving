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
check(`XXXOO.XXX
XOXOXOXOX
OXOXOXOXO
XXOOOXXOX
XO.OX...X
.XXX.XOOO
X.OO..X..
OOXXXOOXO
end`,
`invalid
valid
invalid
valid
valid
invalid
invalid
invalid`);
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
const vaildBoards = new Set(["XOXOXOX..", "XOXOXOOXX", "XOXOXOXXO", "XOXOXO..X", "XOXOXXOOX", "XOXOXXOXO", "XOXOX.O.X", "XOXOXXXOO", "XOXOX.XO.", "XOXOX..OX", "XOXOX.X.O", "XOXOOXXO.", "XOXOOXXXO", "XOXOOXOXX", "XOXOOX..X", "XOXO.XO.X", "XOXO.X.OX", "XOXOOOXX.", "XOXOOOX.X", "XOXOO.XOX", "XOXOXOXOX", "XOXOOO.XX", "XOXXOOX..", "XOXXOOOXX", "XOXXOOXXO", "XOXXOO.OX", "XOXXOXOO.", "XOXXOXOXO", "XOXXO.OOX", "XOXXO..O.", "XOXXOX.OO", "XOXXO.X.O", "XOX.OXO.X", "XOX.OX.O.", "XOX.OXXOO", "XOX.OOXOX", "XOX.O.XO.", "XOX.O..OX", "XOXXXOOOX", "XOXXXOOXO", "XOXXXOXOO", "XOXX.OXO.", "XOXX.OX.O", "XOX.XOO.X", "XOX.XOXO.", "XOX.XO.OX", "XOX.XOX.O", "XOXXX.OOO", "XOXX.XOOO", "XOX.XXOOO", "XOX.X.OOX", "XOX..XOOX", "XOXX..XOO", "XOX.X.XOO", "XOOXXOX..", "XOOXXOOXX", "XOOXXO.XO", "XOOXXO..X", "XOOXXXO..", "XOOXXXOXO", "XOOXX.O.X", "XOOXXX.O.", "XOOXX.XO.", "XOOXX..OX", "XOOXXX..O", "XOOXX.X.O", "XOOXOXX..", "XOOXOXOX.", "XOOXOXXXO", "XOOXOXO.X", "XOOXOX.OX", "XOOXXXOOX", "XOOX.XXO.", "XOOX.XX.O", "XOOX..X..", "XOOXO.XX.", "XOOXOOXXX", "XOOXO.OXX", "XOOX.OXX.", "XOOX..XXO", "XOOXO.X.X", "XOOX.OX.X", "XOOX..XOX", "XO.XOXOOX", "XO.XOX.O.", "XO.XOXX.O", "XO.XO.X..", "XO.XOOXX.", "XO.XO.XXO", "XO.XOOX.X", "XO.XO..OX", "XO.XXOO.X", "XO.XXOXO.", "XO.XXO.OX", "XO.XXOX.O", "XO.X.OX..", "XO.X.OXXO", "XO.X.OXOX", "XO.XXXOO.", "XO.XX.OOX", "XO.XXXO.O", "XO.XXX.OO", "XO.XX.XOO", "XO.X.XXOO", "XO.X..XO.", "XO.X..X.O", "XOOOXXXOX", "XOOOXXXXO", "XOOOXXOXX", "XOOOXX..X", "XOO.XXO.X", "XOOXXXXOO", "XOO.XX.OX", "XOOOXOXXX", "XOOOX.X.X", "XOO.XOXXO", "XOO.XOX.X", "XOO.X.XOX", "XOOOX..XX", "XOO.XO.XX", "XOO.X.OXX", "XOO.X...X", "XO.OXXO.X", "XO.OXX.OX", "XO.OXOX.X", "XO.OX.XOX", "XO.OXO.XX", "XO.OX.OXX", "XO.OX...X", "XO..XOXOX", "XO..XOOXX", "XO..XO..X", "XO..XXOOX", "XO..X.O.X", "XO..X..OX", "XOOOOXXXX", "XOO.OXXOX", "XOO.OXOXX", "XO.OOXXOX", "XO..OXXO.", "XO..OX.OX", "XOOO..XXX", "XOO.O.XXX", "XOO..OXXX", "XO.OO.XXX", "XO.O.OXXX", "XO..OOXXX", "XO..O.XOX", "XXOOXOXOX", "XXOOXOX.O", "XXOOXO.X.", "XXOOXO..X", "XXOOXXOOX", "XXOOXXOXO", "XXOOX.OX.", "XXOOX.O.X", "XXOOXXXOO", "XXOOX..OX", "XXOOX..XO", "XXOOOXXOX", "XXOOOXXXO", "XXOOOXOX.", "XXOOOXO.X", "XXOOOOXX.", "XXOOOOX.X", "XXOO.OXXO", "XXOOOO.XX", "XXOOO.OXX", "XXOOXOOXX", "XXOXOOX..", "XXOXOOOX.", "XXOXOO.XO", "XXOXOOO.X", "XXOXOOXOX", "XXOXO.O..", "XXOXOXOO.", "XXOXOXXOO", "XXOXO.XO.", "XXOXO.OOX", "XXOXOXO.O", "XXOXO.X.O", "XXOXO.OXO", "XXO.OXO..", "XXO.OXOOX", "XXO.OXOXO", "XXO.OOXXO", "XXO.OOOXX", "XXO.O.OX.", "XXO.O.O.X", "XXOXXOOOX", "XXOXXOO.O", "XXOX.OOXO", "XXOXXO.OO", "XXOX.OXO.", "XXOX.O..O", "XXO.XOOX.", "XXO.XOO.X", "XXO.XOXOO", "XXO.XO.OX", "XXO.XO..O", "XXO..OX.O", "XXO..O.XO", "XXOXX.OOO", "XXOX.XOOO", "XXO.XXOOO", "XXO.X.OOX", "XXO.X.OXO", "XXOX..XOO", "X.OXOXO..", "X.OXOXXO.", "X.OXOXOOX", "X.OXOXX.O", "X.OXOXOXO", "X.OXO.X..", "X.OXOOXX.", "X.OXOOOXX", "X.OXO.OX.", "X.OXO.XXO", "X.OXOOX.X", "X.OXO.O.X", "X.OXO.XOX", "X.OXXOOXO", "X.OXXOO.X", "X.OXXOXO.", "X.OXXO.OX", "X.OXXO..O", "X.OX.OX..", "X.OX.O.XO", "X.OX.OXOX", "X.OXXXOO.", "X.OXX.OOX", "X.OXXXO.O", "X.OXXX.OO", "X.OXX.XOO", "X.OX.XXOO", "X.OX..XO.", "X.OX..X.O", "X.OOXXO.X", "X.OOXX.OX", "X.OOXOXXO", "X.OOXOX.X", "X.OOX.XOX", "X.OOXO.XX", "X.OOX.OXX", "X.OOX...X", "X.O.XOXOX", "X.O.XOX.O", "X.O.XOOXX", "X.O.XO.XO", "X.O.XO..X", "X.O.XXOOX", "X.O.X.O.X", "X.O.X..OX", "X.OOOXOXX", "X.O.OXOX.", "X.O.OXO.X", "X.OOO.XXX", "X.OO.OXXX", "X.O.OOXXX", "X.O..OXXO", "X.O.O.OXX", "XXXOO....", "XXXOOXO..", "XXXOOXOXO", "XXXOOXOOX", "XXXOOX.O.", "XXXOOXXOO", "XXXOOX..O", "XX.OOOX..", "XXXOO.XO.", "XX.OOOXOX", "XXXOO.X.O", "XX.OOOXXO", "XX.OOO.X.", "XXXOO.OX.", "XX.OOOOXX", "XXXOO..XO", "XX.OOO..X", "XXXOO.O.X", "XXXOO..OX", "XXXO.O...", "XXXOXOO..", "XX.OXOOX.", "XX.OXOO.X", "XXXOXO.O.", "XXXOXOXOO", "XX.OXO.OX", "XXXOXO..O", "XX.OXO.XO", "XXXO.OXO.", "XXXO.OX.O", "XXXO.OOX.", "XXXO.O.XO", "XXXO.OO.X", "XXXO.O.OX", "XXXO..O..", "XXXOX.OO.", "XX.OXXOOO", "XX.OX.OOX", "XXXOX.O.O", "XX.OX.OXO", "XXXO.XOO.", "XXXO.XO.O", "XXXO..OXO", "XXXO..OOX", "XXXO...O.", "XXXOX..OO", "XXXO.X.OO", "XXXO..XOO", "XXXO....O", "X.XOOXO.X", "X.XOOX.OX", "X.XOOOX..", "X.XOOOXOX", "X.XOOOXXO", "X.XOOO.X.", "X.XOOOOXX", "X.XOOO..X", "XXXOXOOXO", "X.XOXOO.X", "X.XOXOXO.", "X.XOXO.OX", "X.XOXOX.O", "X.XOXXOOO", "X.XOX.OOX", "X.XO.XOOX", "X.XOX.XOO", "X..OXOXOX", "X..OXOOXX", "X..OXO..X", "X..OXXOOX", "X..OX.O.X", "X..OX..OX", "X..OOOXX.", "X..OOOX.X", "X..OOO.XX", "XXX.OO...", "XXXXOOO..", "XXXXOOOXO", "XXXXOOOOX", "XXXXOO.O.", "XX.XOOXO.", "XXXXOO..O", "XX.XOOX.O", "XXX.OOXO.", "XXX.OOX.O", "XXX.OOOX.", "XXX.OO.XO", "XXX.OOO.X", "XXX.OO.OX", "XXX.O.O..", "XXXXO.OO.", "XX.XOXOOO", "XXXXO.O.O", "XXX.OXOO.", "XXX.OXO.O", "XXX.O.OXO", "XXX.O.OOX", "XXX.O..O.", "XXXXO..OO", "XX.XO.XOO", "XXX.OX.OO", "XXX.O.XOO", "XXX.O...O", "X.XXOOXO.", "X.XXOOX.O", "X.XXOXOOO", "X.X.OXOOX", "X.XXO.XOO", "X..XOOX..", "X..XOOXXO", "X..XOOXOX", "X..XOXXOO", "X..XO.XO.", "X..XO.X.O", "XXX..OO..", "XXXX.OOO.", "XX.XXOOOO", "XXXX.OO.O", "XXX.XOOO.", "XX..XOOOX", "XXX.XOO.O", "XX..XOOXO", "XXX..OOXO", "XXX..OOOX", "XXX..O.O.", "XXXX.O.OO", "XX.X.OXOO", "XXX.XO.OO", "XXX..OXOO", "XXX..O..O", "X.XXXOOOO", "X.X.XOOOX", "X.XX.OXOO", "X.X.XOXOO", "X..XXOOOX", "X..XXOXOO", "X..X.OXO.", "X..X.OX.O", "X...XOO.X", "X...XO.OX", "XXX...OO.", "XX.X..OOO", "XX..X.OOO", "XX...XOOO", "XXX...O.O", "X.XX..OOO", "X.X.X.OOO", "X.X..XOOO", "X..XX.OOO", "X..X.XOOO", "X...XXOOO", "X...X.OOX", "XXX....OO", "X..X..XOO", "OXXOXOX..", "OXXOXO.X.", "OXXOXOO.X", "OXXOXOXOX", "OXXOX.O..", "OXXOXXOO.", "OXXOXXXOO", "OXXOX.XO.", "OXXOX.OOX", "OXXOXXO.O", "OXXOX.X.O", "OXXOX..XO", "OXXOOXXOX", "OXXOOXX.O", "OXXOOXOX.", "OXXOOX.XO", "OXXOOX..X", "OXXO.XO..", "OXXO.X.OX", "OXXO.XOXO", "OXXOOOXX.", "OXXOO.XXO", "OXXOOOX.X", "OXXOXOXXO", "OXXOOO.XX", "OXXOO.OXX", "OXXO.OOXX", "OXXO..OX.", "OXXO..O.X", "OXXXOOXOX", "OXXXOOX.O", "OXXXOOOXX", "OXXXOO.XO", "OXXXOXOOX", "OXXXOXO.O", "OXXXO.OXO", "OXXXOX.OO", "OXXXO.XOO", "OXXXO...O", "OXX.OXOXO", "OXX.OXO.X", "OXX.OXXOO", "OXX.OX.OX", "OXX.OX..O", "OXX.OOXXO", "OXX.O.X.O", "OXX.O..XO", "OXXXXOOOX", "OXXXXOOXO", "OXXXXOXOO", "OXX.XOOX.", "OXX.XOXO.", "OXX.XOX.O", "OXX.XO.XO", "OXXXX.OOO", "OXXX.XOOO", "OXX.XXOOO", "OXX.X.OXO", "OXX..XOOX", "OXX.X.XOO", "OXOXXOXOX", "OXOXXOX.O", "OXOXXO.X.", "OXOXXOOXX", "OXOXXXO..", "OXOXX.OX.", "OXOXXXOOX", "OXOXXX.O.", "OXOXXXXOO", "OXOXXX..O", "OXOXX..XO", "OXOXOXXOX", "OXOXOXX.O", "OXOXOXOX.", "OXOXOX.XO", "OXOXOXO.X", "OXOXXXOXO", "OXOXOOXXX", "OXOXO.XXO", "OXOX.OXXO", "OXOXO.OXX", "OX.XOXOXO", "OX.XOXXOO", "OX.XOX..O", "OX.XOOXXO", "OX.XO.X.O", "OX.XO..XO", "OX.XXOOX.", "OX.XXO.XO", "OX.XXXOO.", "OX.XXXO.O", "OX.XX.OXO", "OX.XXX.OO", "OXOOXXXOX", "OXOOXXXXO", "OXOOXX.X.", "OXOOXXO.X", "OXO.XXOX.", "OXO.XX.XO", "OXOOX.XX.", "OXOOXOXXX", "OXO.XOXX.", "OXO.X.XXO", "OXO.X..X.", "OXOOX..XX", "OXO.XO.XX", "OXO.X.OXX", "OX.OXXO..", "OX.OXXOOX", "OX.OXX.XO", "OX.OXOXX.", "OX.OX.XXO", "OX.OX..X.", "OX.OXO.XX", "OX.OX.O.X", "OX..XOXXO", "OX..XO.X.", "OX..XOOXX", "OX..XXOXO", "OX..X.OX.", "OX..X..XO", "OXOOOXXXX", "OXO.OXXXO", "OXOO.XOXX", "OXO.OXOXX", "OX.OOXXXO", "OX.OOXOXX", "OX.O.XOX.", "OX.O.XO.X", "OX..OXX.O", "OX..OX.XO", "OXOO..XXX", "OXO.O.XXX", "OXO..OXXX", "OX.OO.XXX", "OX.O.OXXX", "OX..OOXXX", "OX..O.XXO", "OX.O..OXX", ".XOXOXO..", ".XOXOXOOX", ".XOXOXOXO", ".XOXOOXXO", ".XOXOOOXX", ".XOXO.OX.", ".XOXO.O.X", ".XOXXOOX.", ".XOXXOXOO", ".XOXXO..O", ".XOX.OX.O", ".XOX.O.XO", ".XOXXXOO.", ".XOXXXO.O", ".XOXX.OXO", ".XOXXX.OO", ".XOOXXOX.", ".XOOXX.XO", ".XOOXOXX.", ".XOOX.XXO", ".XOOX..X.", ".XOOXO.XX", ".XOOX.OXX", ".XO.XOX.O", ".XO.XO.X.", ".XO.XOOXX", ".XO.XXOXO", ".XO.X.OX.", ".XO.X..XO", ".XOOOXOXX", ".XO.OXOX.", ".XO.OXO.X", ".XOOO.XXX", ".XOO.OXXX", ".XO.OOXXX", ".XO..OXXO", ".XO.O.OXX", ".XXOOXO.X", ".XXOOX.OX", ".XXOOOX..", ".XXOOOXOX", ".XXOOOXXO", ".XXOOO.X.", ".XXOOOOXX", ".XXOOO..X", ".XXOXOOX.", "XXXOXOOOX", ".XXOXOXO.", ".XXOXOX.O", ".XXOXO.XO", ".XXOXXOOO", ".XXOX.OXO", ".XXO.XOOX", ".XXOX.XOO", ".X.OXOXXO", ".X.OXO.X.", ".X.OXOOXX", ".X.OXXOXO", ".X.OX.OX.", ".X.OX..XO", ".X.OOOXX.", ".X.OOOX.X", ".X.OOO.XX", "XXXXOOXOO", ".XXXOXOOO", ".XX.OXOOX", ".XXXXOOOO", ".XX.XOOXO", ".XX.XOXOO", ".X.XXOOXO", ".X..XOOX.", ".X..XO.XO", ".XXX..OOO", ".XX.X.OOO", ".XX..XOOO", ".X.XX.OOO", ".X.X.XOOO", ".X..XXOOO", ".X..X.OXO", "OOXXXOX..", "OOXXXOOXX", "OOXXXOXXO", "OOXXXOXOX", "OOXXXXO..", "OOXXXXOXO", "OOXXXXOOX", "OOXXXX.O.", "OOXXX.XO.", "OOXXXX..O", "OOXXX.X.O", "OOXXOXXO.", "OOXXOXX.O", "OOXXOXOXX", "OOXXOX.XO", "OOXXOX..X", "OOXX.XO.X", "OOXXXXXOO", "OOXX.X.OX", "OOXXOOXXX", "OOXXO.XXO", "OOXXO.XOX", "O.XXOXOXO", "O.XXOXO.X", "O.XXOXXOO", "O.XXOX.OX", "O.XXOX..O", "O.XXOOXXO", "O.XXO.X.O", "O.XXO..XO", "O.XXXOXO.", "O.XXXOX.O", "O.XXXXOO.", "O.XXXXO.O", "O.XX.XOOX", "O.XXXX.OO", "O.XXX.XOO", "OOXOXXX..", "OOXOXXOX.", "OOXOXXXXO", "OOXOXX..X", "OOX.XXO.X", "OOX.XXXO.", "OOX.XX.OX", "OOX.XXX.O", "OOX.X.X..", "OOXOX.XX.", "OOXOXOXXX", "OOXOX.OXX", "OOX.XOXX.", "OOX.X.XXO", "OOXOX.X.X", "OOX.XOX.X", "OOX.X.XOX", "O.XOXXO..", "O.XOXXXO.", "O.XOXX.OX", "O.XOXXX.O", "O.XOXXOXO", "O.XOX.X..", "O.XOXOXX.", "O.XOXOOXX", "O.XOX.OX.", "O.XOX.XXO", "O.XOXOX.X", "O.XOX.O.X", "O.XOX.XOX", "O.X.XOX..", "O.X.XOXXO", "O.X.XOXOX", "O.X.XXOOX", "O.X.XXXOO", "O.X.X.XO.", "O.X.X.X.O", "OOXOOXXXX", "OOXO.XX.X", "OOX.OXXXO", "OOX.OXX.X", "OOX..XXOX", "OOXO.X.XX", "OOX.OX.XX", "OOX..XOXX", "OOX..X..X", "O.XOOXXXO", "O.XOOXX.X", "O.XO.XXOX", "O.XOOX.XX", "O.XO.XOX.", "O.XO.X..X", "O.X.OXXOX", "O.X.OXX.O", "O.X.OXOXX", "O.X.OX.XO", "O.X.OX..X", "O.X..XO.X", "O.X..X.OX", "OOXO..XXX", "OOX.O.XXX", "OOX..OXXX", "O.XOO.XXX", "O.XO.OXXX", "O.X.OOXXX", "O.X.O.XXO", "O.XO..OXX", ".OXXOXO.X", ".OXXOX.O.", ".OXXOXXOO", ".OXXOOXOX", ".OXXO.XO.", ".OXXO..OX", ".OXXXOXO.", ".OXXXOX.O", ".OXXXXOO.", ".OXXXXO.O", ".OXX.XOOX", ".OXXXX.OO", ".OXXX.XOO", ".OXOXXO.X", ".OXOXXXO.", ".OXOXX.OX", ".OXOXXX.O", ".OXOX.X..", ".OXOXOXX.", ".OXOX.XXO", ".OXOXOX.X", ".OXOX.XOX", ".OX.XOX..", ".OX.XOXXO", ".OX.XOXOX", ".OX.XXOOX", ".OX.XXXOO", ".OX.X.XO.", ".OX.X.X.O", ".OXOOXX.X", ".OXO.XXOX", ".OXOOX.XX", ".OXO.XOXX", ".OXO.X..X", ".OX.OXXO.", ".OX.OXOXX", ".OX.OX..X", ".OX..XO.X", ".OX..X.OX", ".OXOO.XXX", ".OXO.OXXX", ".OX.OOXXX", ".OX.O.XOX", "..XOXOX..", "..XOXOXXO", "..XOXOXOX", "..XOXXOOX", "..XOXXXOO", "..XOX.XO.", "..XOX.X.O", "..XOOXXOX", "..XOOXOXX", "..XOOX..X", "..XO.XO.X", "..XO.X.OX", "..XOOOXX.", "..XOOOX.X", "..XOOO.XX", "..XXOXOOX", "..X.OXO.X", "..X.OX.OX", "..XXXOXOO", "..X.XOXO.", "..X.XOX.O", "..XXX.OOO", "..XX.XOOO", "..X.XXOOO", "..X..XOOX", "..X.X.XOO", "OO.XXX...", "OOOXX.X..", "OOOXXOXX.", "OOOXXOX.X", "OO.XXXXO.", "OOOXX.XOX", "OO.XXXX.O", "OOOXX.XXO", "OOOXX..X.", "OOOXXO.XX", "OO.XXXOX.", "OOOXX.OXX", "OO.XXX.XO", "OOOXX...X", "OO.XXXO.X", "OO.XXX.OX", "O.OXXX...", "O.OXXOXXO", "O.OXXXXO.", "O.OXXXX.O", "O.OXXXOX.", "O.OXXX.XO", "O.OXXXO.X", "O.OXXX.OX", "O..XXXO..", "O..XXXOXO", "O..XXXOOX", "O..XXX.O.", "O..XXXXOO", "O..XXX..O", "OOOX.XX..", "OOOXOXXX.", "OO.XOXXXO", "OOOXOXX.X", "OO.XOXXOX", "OOOX.XXOX", "OOOX.XXXO", "OOOX.X.X.", "OOOXOX.XX", "OOOX.XOXX", "OOOX.X..X", "O.OXOXXXO", "O.OXOXOXX", "O..XOXX.O", "O..XOX.XO", "OOOX..XX.", "OO.XO.XXX", "OO.X.OXXX", "OOOX..X.X", "O.OXO.XXX", "O.OX.OXXX", "O..XOOXXX", "O..XO.XXO", "OOOX...XX", ".OOXXX...", ".OOXXOXXO", "XOOXXOXOX", ".OOXXXXO.", ".OOXXXX.O", ".OOXXXOX.", ".OOXXX.XO", ".OOXXXO.X", ".OOXXX.OX", ".O.XXXO..", ".O.XXXOXO", ".O.XXXOOX", ".O.XXX.O.", ".O.XXXXOO", ".O.XXX..O", ".OOXOXXOX", ".OOXOXOXX", ".O.XOXXO.", ".O.XOX.OX", ".OOXO.XXX", ".OOX.OXXX", ".O.XOOXXX", ".O.XO.XOX", "..OXXOX.O", "..OXXO.XO", "..OXXXO..", "..OXXXOXO", "..OXXXOOX", "..OXXX.O.", "..OXXXXOO", "..OXXX..O", "..OXOXOX.", "..OXOXO.X", "..OXOOXXX", "..OX.OXXO", "..OXO.OXX", "...XXXOO.", "...XXXO.O", "...XXX.OO", "OOO.XXX..", "OOOOXXXX.", "OOOOXXX.X", "OOXOXXXOX", "OOO.XXXOX", "OOO.XXXXO", "OOO.XX.X.", "OOOOXX.XX", "OO.OXXOXX", "OOO.XXOXX", "OOO.XX..X", "O.OOXXOXX", "O..OXXOX.", "O..OXXO.X", "OOO.X.XX.", "OO.OX.XXX", "OO..XOXXX", "OOO.X.X.X", "O.OOX.XXX", "O.O.XOXXX", "O..OXOXXX", "OOO.X..XX", "O..OX.OXX", ".OOOX.XXX", ".OO.XOXXX", ".O.OXOXXX", "..OOXOXXX", "..O.XOXXO", "OOO..XXX.", "OO.O.XXXX", "OO..OXXXX", "OOO..XX.X", "O.OO.XXXX", "O.O.OXXXX", "O..OOXXXX", "O...OXXXO", "OOO..X.XX", "O..O.XOXX", ".OOO.XXXX", ".OO.OXXXX", ".O.OOXXXX", ".O..OXXOX", "..OOOXXXX", "..O.OXOXX", "OO....XXX", "O.O...XXX", "O..O..XXX", "O...O.XXX", "O....OXXX", ".OO...XXX", ".O.O..XXX", ".O..O.XXX", ".O...OXXX", "..OO..XXX", "..O.O.XXX", "..O..OXXX", "...OO.XXX", "...O.OXXX", "....OOXXX"]);

const out = [];
for (const line of lines) {
  if (line === "end") break;

  if (vaildBoards.has(line)) out.push("valid");
  else out.push("invalid");
}

// output
return out.join("\n");
}
