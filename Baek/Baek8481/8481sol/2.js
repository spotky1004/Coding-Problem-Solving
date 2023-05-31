const p = 9099099909999099999n;
const out = [1n, 1n];
let [a, b] = [1n, 1n];
for (let i = 0; i < 9998; i++) {
  [a, b] = [b, (a + b) % p];
  out.push(b);
}
out.push("0.");
require("fs").writeFileSync("./out.txt", out.join(", ") + "\n");
