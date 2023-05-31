const fs = require("fs");
const toCheck = 6;

const outFile = fs.readFileSync("./out.txt", "utf8");
const ansFile = fs.readFileSync(`./Baek/Baek8481/genzaw/gen${toCheck}.out`, "utf8");
console.log(outFile === ansFile);
