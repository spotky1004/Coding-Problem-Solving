const isDev = process?.platform !== "linux";
const [[n, a, b]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`15 12 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

if (gcd(a, b) === 1) {
  const pairs = [];

  if (b % 2 === 1) {
    for (let i = 0; i < Math.floor(n / 2) * 2; i += 2) {
      pairs.push([
        a + b*(2*i+0),
        a + b*(2*i+1)
      ]);
      pairs.push([
        a + b*(2*i+2),
        a + b*(2*i+3)
      ]);
    }
  } else {
    for (let i = 0; i < Math.floor(n / 2) * 2; i += 2) {
      pairs.push([
        a + b*(2*i+0),
        a + b*(2*i+2)
      ]);
      pairs.push([
        a + b*(2*i+1),
        a + b*(2*i+3)
      ]);
    }
  }

  if (n % 2 === 1) {
    pairs.push([
      a + b*(2*n-2),
      a + b*(2*n-1)
    ]);
  }

  console.log("YES\n" + pairs.map(v => v[0] + " " + v[1]).join("\n"));
} else {
  console.log("NO");
}

