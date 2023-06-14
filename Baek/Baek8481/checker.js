const fs = require("fs");
const toCheck = 8;

const outFile = fs.readFileSync("./out.txt", "utf8");
const ansFile = fs.readFileSync(`./Baek/Baek8481/genzaw/gen${toCheck}.out`, "utf8");
console.log(outFile === ansFile);
