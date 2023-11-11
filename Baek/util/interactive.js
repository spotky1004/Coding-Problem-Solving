/** @param {string} input */
function interactiveInput(input) {
  const [[x]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number))

  return x;
}

/** @param {string} input */
async function solve(input) {
  // input
  const [[N]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number));

  // code
  await interactive(`? question`);

  // end
  process.exit(0);
}

// Interactive
const interactive = (() => {
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
  return async function (output) {
    /** @type {Promise<ReturnType<interactiveInput>>} */
    const question = new Promise((resolve) => {
      waitingInteractive = true;
      promiseResolve = resolve;
    });
    process.stdout.write("\n" + output + "\n", () => { /** flush */ });
    return await question;
  }
})();
