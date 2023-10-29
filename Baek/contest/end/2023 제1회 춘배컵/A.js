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
check(`p o o y r y p o y r p r r o p
y w w y w r w y w p w w w r y
r w y r w r w w w y r p w w o
r p w w w w w y w w o w o r w
y w w w r o p w o r r w p p w
y y w w w o w p o w r p p o o
p w p w p y o p w w w w p y w
y w y o w o w o o o w o w w p
y o w w y w w w r w o p w w p
p w p y w w o w o r w w p r y
p p w w w w y r w w w y y o w
p w p w w w w o o p o w p w p
y p o y w p w w w w w w r w p
p y r w w w w w o w w p o y w
o r w w y y y w w o o y y r w`,
`chunbae`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [...image] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const imageLine = image.flat();
let out;
if (imageLine.includes("w")) out = "chunbae";
else if (imageLine.includes("b")) out = "nabi";
else if (imageLine.includes("g")) out = "yeongcheol"

// output
return out;
}