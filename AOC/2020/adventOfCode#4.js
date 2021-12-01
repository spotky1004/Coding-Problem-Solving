const md5 = require("md5");
const input = "ckczppom";
for (let i = 0; i < 1e7; i++) {
    if (md5(input+i).startsWith("000000")) {
        console.log(i);
        break;
    }
}