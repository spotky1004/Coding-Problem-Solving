/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {(number | null)[]} */
  const net = Array.from({ length: n }, (_, i) => i);
  net[0] = null;
  net[1] = null;
  for (let i = 4; i < net.length; i += 2) {
    net[i] = null;
  }
  for (let i = 3; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i * 3; j < net.length; j += i * 2) {
      net[j] = null;
    }
  }
  return net.filter(v => v !== null);
}
const p = genPrimes(400002);
const out = Array.from({ length: 5000 }, _ => Array(80).fill("1"));
for (const t of p) {
  out[Math.floor((t - 2) / 80)][(t - 2)%80] = "0";
}
out[3333]="11111011909909990999909999911011111011101011101011111111111011111111101111111011".split("");
require("fs").writeFileSync("./out.txt", out.map(v=>v.join("")).join("\n") + "\n");
