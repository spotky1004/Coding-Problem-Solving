const fs = require('fs');

function calcValue(expr) {
  let value = Infinity;

  for (let i = 0; i < digits.length; i++) {
    expr = expr.replace(new RegExp(i, "g"), digits[i]);
  }
  expr = expr.replace(/^\+/g, "").replace(/\[\+/g, "[");
  expr = expr.replace(/\[!\[\]\+!\[\]\]/g, "[+![]]");
  try {
    value = eval(expr);
    if (typeof value !== "number" && typeof value !== "string") {
      value = Infinity;
      expr = expr.length < 5 ? `+${expr}` : `+[${expr}]`;
      value = eval(expr);
    }
  } catch {}

  return [value, expr];
}

const patterns = ["n"];
let prevPatterns = ["n"];
for (let i = 0; i < 7; i++) {
  const newPatterns = [];
  for (const prevPattern of prevPatterns) {
    newPatterns.push(prevPattern + "@n");
    newPatterns.push(prevPattern + "@[n]");
    newPatterns.push("[" + prevPattern + "]@n");
    newPatterns.push("[" + prevPattern + "]@[n]");
    if (prevPattern.endsWith("]")) {
      newPatterns.push(prevPattern.slice(0, -1) + "@n]");
    }
  }

  prevPatterns = [...new Set(newPatterns)];
  patterns.push(...prevPatterns);
}

const digits = `![]
!![]
!![]+!![]
!![]+!![]+!![]
!![]+!![]+!![]+!![]
!![]+!![]+!![]+!![]+!![]
[!![]+!![]]*[!![]+!![]+!![]]
!![]+[!![]+!![]]*[!![]+!![]+!![]]
[!![]+!![]]**[!![]+!![]+!![]]
[+!![]+[+![]]]-!![]`.split("\n");
const operations = ["+", "-", "*", "**"];

const shortestExprs = [];
for (const pattern of patterns) {
  const patternChars = Array.from(pattern);
  const numberCount = patternChars.filter(c => c === "n").length;
  const operationCount = patternChars.filter(c => c === "@").length;

  const loopCount = 4**operationCount * 10**numberCount;
  console.log("loop", loopCount, pattern);

  for (let i = 0; i < 4**operationCount; i++) {
    const operationIdxes = i.toString(4).padStart(operationCount, "0");

    let operSeen = -1;
    const operPattern = patternChars.slice(0).map(c => {
      const isOper = c === "@";
      if (isOper) operSeen++;
      return isOper ? operations[operationIdxes[operSeen]] : c;
    });

    for (let j = 0; j < 10**numberCount/50; j++) {
      if (j%17 === 0) {
        const doneCount = i*10**numberCount + j;
        process.stdout.write(`${doneCount}/${loopCount} (${(doneCount/loopCount*100).toFixed(2)}%)\r`);
      }

      const numberIdxes = j.toString().padStart(numberCount, "0");

      let numSeen = -1;
      const expr = operPattern.slice(0).map(c => {
        const isNum = c === "n";
        if (isNum) numSeen++;
        return isNum ? digits[numberIdxes[numSeen]] : c;
      }).join("");

      if (expr.length > 75) continue;

      let [value, newExpr] = calcValue(expr);
      if (typeof value === "number" && Number.isInteger(value) && 0 <= value && value <= 1000 && newExpr.length <= 75) {
        const prevLen = shortestExprs[value] ? shortestExprs[value].length : Infinity;
        if (prevLen > newExpr.length) {
          if (typeof shortestExprs[value] === "undefined") {
            console.log();
            console.log(value, "Got!", `${shortestExprs.filter(v => v).length}/1001`);
          }
          shortestExprs[value] = newExpr;
        }
      }
    }
  }
  process.stdout.clearLine();
  
  fs.writeFileSync("./Baek18765outt.txt", Array.from({ length: 1001 }, (_, i) => shortestExprs[i] ?? i + " " + "x".repeat(200)).join("\n"));
}

// const digits = `![]
// !![]
// !![]+!![]
// !![]+!![]+!![]
// !![]+!![]+!![]+!![]
// !![]+!![]+!![]+!![]+!![]
// [!![]+!![]]*[!![]+!![]+!![]]
// !![]+[!![]+!![]]*[!![]+!![]+!![]]
// [!![]+!![]]**[!![]+!![]+!![]]
// [!![]+!![]+!![]]**[!![]+!![]]`.split("\n");
// let exprQueue = Array.from({ length: digits.length - 1 }, (_, i) => [calcValue(digits[i+1]), digits[i+1]]);
// let nextExprQueue = [];
// const shortest = [];

// function calcValue(expr) {
//   let value = Infinity;

//   for (let i = 0; i < digits.length; i++) {
//     expr = expr.replace(new RegExp(i, "g"), digits[i]);
//   }
//   expr = expr.replace(/^\+/g, "").replace(/\[\+/g, "[");
//   try {
//     value = eval(expr);
//     if (typeof value !== "number" && typeof value !== "string") {
//       value = Infinity;
//       expr = "+" + expr;
//       value = eval(expr);
//     }
//   } catch {}

//   return [value, expr];
// }

// const operations = ["+", "-", "*", "**"];
// while (exprQueue.length > 0) {
//   console.log("loop", exprQueue.length)
  
//   for (let q = 0; q < exprQueue.length; q++) {
//     const [value, expr] = exprQueue[q];
//     if (q%17 === 0) {
//       process.stdout.write(`${q}/${exprQueue.length} (${(q/exprQueue.length*100).toFixed(2)}%)\r`);
//     }

//     const prevLen = shortest[value] ? shortest[value].length : Infinity;
//     if (value < 0 || prevLen + 3 > expr.length) {
//       const exprToReplace = typeof value === "number" ? expr : `+[${expr}]`;
//       if (prevLen > exprToReplace.length) {
//         shortest[value] = exprToReplace;
//       }
      
//       if (nextExprQueue.length > 9_000_000) continue;
//       const toAdd = [];
//       for (const op of operations) {
//         for (let i = 0; i < digits.length; i++) {
//           if (op !== "**") {
//             toAdd.push(expr + op + i);
//             toAdd.push(expr + op + "[" + i + "]");
//           }
//           toAdd.push("[" + expr + "]" + op + i);
//           toAdd.push("[" + expr + "]" + op + "[" + i + "]");
//           if (expr.endsWith("]")) {
//             toAdd.push(expr.slice(0, -1) + op + i + "]");
//           }
//         }
//       }
//       nextExprQueue.push(...toAdd.map(v => calcValue(v)).filter(v => v[0] < 5000 && v[1].length <= 75));
//     }
//   }
//   process.stdout.clearLine();
  
//   exprQueue = nextExprQueue.slice(0, 2_000_000);
//   // exprQueue = nextExprQueue.map((v, i) => {
//   //   if (i%1237 === 0) {
//   //     process.stdout.write(`${i}/${nextExprQueue.length} (${(i/nextExprQueue.length*100).toFixed(2)}%)\r`);
//   //   }
//   //   return calcValue(v)
//   // }).filter(v => v[0] < 5000 && v[1].length <= 75).slice(0, 600_000);
//   // process.stdout.clearLine();
//   nextExprQueue = [];

//   fs.writeFileSync("./Baek18765out.txt", Array.from({ length: 1001 }, (_, i) => shortest[i] ?? i + " " + "x".repeat(200)).join("\n"));
// }
