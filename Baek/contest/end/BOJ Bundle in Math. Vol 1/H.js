/** @param {string} input */
function interactiveInput(input) {
  const [[isCorrect]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number))

  return isCorrect;
}

/** @param {string} input */
async function solve(input) {
  // input
  const [[]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number));

  // code
  let A, B;
  const order = Array.from({ length: 9 }, (_, i) => i + 1);
  for (const n of order) {
    const isCorrect = await interactive(`? A ${n}`);
    if (!isCorrect) continue;
    A = n;
    break;
  }
  for (const n of order) {
    const isCorrect = await interactive(`? B ${n}`);
    if (!isCorrect) continue;
    B = n;
    break;
  }
  console.log(`! ${A + B}`);

  // end
  process.exit(0);
}

// Interactive
const interactive = (() => {
  let promiseResolve;
  let waitingInput = false;
  let waitingInteractive = false;

  const reader = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  reader.on("line", line => {
    if (waitingInteractive) {
      waitingInteractive = false;
      promiseResolve(interactiveInput(line));
    }
  });

  /** @type {(output: string) => Promise<ReturnType<interactiveInput>>} */
  return async function (output) {
    /** @type {Promise<ReturnType<interactiveInput>>} */
    const question = new Promise((resolve) => {
      waitingInteractive = true;
      promiseResolve = resolve;
    });
    process.stdout.write(output);
    process.stdout.write("\n", () => { /** flush */ });
    return await question;
  }
})();

solve("");
