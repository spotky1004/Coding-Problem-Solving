const isDev = process.platform !== "linux";
const [, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
++++++++[>+++++++++ % hello-world.
<-]>.<+++++[>++++++<-]>-.+++++++..
+++.<++++++++[>>++++<<-]>>.<<++++[>
------<-]>.<++++[>++++++<-]>.+++.
------.--------.>+.
end
+++[>+++++++[.
end
%% Print alphabet, A-Z.
+ + + + + +++++++++++++++++++++>
++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++
+< [ >.+<- ]
end`
)
  .trim()
  .split("\n");

function runBF(input) {
  /** @type {Map<number, number>} */
  const pairs = new Map();
  let bracketOpens = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "[") {
      bracketOpens.push(i);
    } else if (char === "]") {
      const p = bracketOpens.pop();
      if (typeof p === "undefined") return "COMPILE ERROR";
      pairs.set(p, i);
      pairs.set(i, p);
    }
  }
  if (bracketOpens.length > 0) {
    return "COMPILE ERROR";
  }

  let out = "";
  const v = Array(32767).fill(0);
  let p = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const isZero = v[p] === 0;
    if (char === ">") {
      p++;
    } else if (char === "<") {
      p--;
    } else if (char === "+") {
      v[p]++;
    } else if (char === "-") {
      v[p]--;
    } else if (char === ".") {
      out += String.fromCharCode(v[p]);
    } else if (char === "[" && isZero) {
      i = pairs.get(i);
    } else if (char === "]" && !isZero) {
      i = pairs.get(i);
    }
    p = (p + 32768) % 32768;
    v[p] = (v[p] + 256) % 256;
  }
  return out;
}

const bfChar = "><+-.[]";
let bfCode = "";
const outs = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line === "end") {
    outs.push(`PROGRAM #${outs.length + 1}:\n` + runBF(bfCode));
    bfCode = "";
  }
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === "%") break;
    if (bfChar.includes(char)) {
      bfCode += char;
    }
  }
}

console.log(outs.join("\n"));
