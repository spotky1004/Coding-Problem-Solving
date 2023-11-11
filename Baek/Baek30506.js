/** @param {string} input */
function interactiveInput(input) {
  const [[winCount]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number))

  return winCount;
}

/** @param {string} input */
async function solve(input) {
  // input
  const [[K]] = input
    .trim()
    .split("\n")
    .map(line => line.split(" ").map(Number));

  // code
  const GAME_COUNT = 100;

  const inverse = {
    0: 5,
    2: 0,
    5: 2
  };

  const machine = Array(GAME_COUNT).fill(5);
  let winCount = K;
  for (let i = 0; i < GAME_COUNT; i++) {
    machine[i] = 0;
    let newWinCount = await interactive(`? ${machine.map(v => inverse[v]).join("")}`);

    if (newWinCount < winCount) {
      machine[i] = 5;
      newWinCount++;
    } else if (newWinCount === winCount) {
      machine[i] = 2;
      newWinCount++;
    } else {
      machine[i] = 0;
    }

    winCount = newWinCount;
  }

  console.log(`! ${machine.join("")}`);

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
