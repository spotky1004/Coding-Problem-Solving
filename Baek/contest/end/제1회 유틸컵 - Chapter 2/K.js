const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`7
Artichoke in Korea Army uses Aheui.
Aheui, the best language of Korea.
Korea is our country.
of Korea? Korea Korea Aheui of Korea.
Language of, Korea Korea.
Aheui has shown the greatness of Korea of Korea.
korea Korea! koRea Of Korea of Korea oF kORea.`,
`Artichoke in K-Army uses Aheui.
Aheui, the best K-Language.
K-Is our country.
of Korea? K-K-K-Aheui.
Language of, K-Korea.
Aheui has shown the K-K-Greatness.
korea Korea! koRea Of K-Korea oF kORea.`);
check(`4
Korea Korea a of Korea of Korea a of Korea.
Korea Korea of Korea.
s, of Korea.
Language of, Korea Korea, Aheui.`,
`K-K-K-K-A K-A.
K-K-Korea.
s, of Korea.
Language of, K-Korea, Aheui.`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...sens] = input
  .trim()
  .split("\n");

// code
const upperFirst = (s) => s[0].toUpperCase() + s.slice(1);

const out = [];
const ends = "!?,.";
for (const sen of sens) {
  const chunks = [];
  for (let word of sen.split(" ")) {
    if (ends.includes(word[0])) {
      chunks.push(word[0]);
      word = word.slice(1);
    }
    if (ends.includes(word[word.length - 1])) {
      chunks.push(word.slice(0, -1));
      chunks.push(word[word.length - 1]);
    } else {
      chunks.push(word);
    }
  }
  
  for (let i = 0; i < chunks.length; i++) {
    if (
      chunks[i] === "of" &&
      chunks[i + 1] === "Korea" &&
      i !== 0 &&
      !ends.includes(chunks[i - 1])
    ) {
      chunks[i - 1] = "K-" + upperFirst(chunks[i - 1]);
      chunks.splice(i, 2);
      i--;
      continue;
    }
  }
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (
      chunks[i] === "Korea" &&
      !ends.includes(chunks[i + 1])
    ) {
      chunks[i] = "K-" + upperFirst(chunks[i + 1]);
      chunks.splice(i + 1, 1);
      continue;
    }
  }

  const newSen = chunks.join(" ")
    .replace(/ \./g, ".")
    .replace(/ \!/g, "!")
    .replace(/ \?/g, "?")
    .replace(/ \,/g, ",");
  out.push(newSen);
}

// output
return out.join("\n");
}
