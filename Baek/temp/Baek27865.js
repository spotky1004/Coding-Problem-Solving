async function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map((v) => parseInt(v)));

// code
let got;
let excepted;
while (got !== "Y") {
  excepted = Math.floor(Math.random() * N) + 1;
  got = await interactive(`? ${excepted}`);
}
console.log(`! ${excepted}`);

// end
process.exit(0);
}

// Interactive
let promiseResolve;
let input = "";
let inputTimeout = null;
let waitingInteractive = false;
process.stdin.resume();
process.stdin.on("data", async data => {
  // Make buffer string
  data = data.toString();

  if (waitingInteractive) {
    // Interactive input
    waitingInteractive = false;
    promiseResolve(data.trim());
  } else {
    // Read first input
    clearInterval(inputTimeout);
    waitingInput = false;
    input += data;
  }
});

async function interactive(output) {
  /** @type {Promise<string>} */
  const question = new Promise((resolve) => {
    promiseResolve = resolve;
    waitingInteractive = true;
  });
  process.stdout.write(output, () => { /** flush */ });
  return await question;
}
