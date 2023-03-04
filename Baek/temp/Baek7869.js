const isDev = process.platform !== "linux";
const [[x1, y1, r1, x2, y2, r2]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`20.0 30.0 15.0 40.0 30.0 30.0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {[x: number, y: number][]} points 
*/
function calcArea(points) {
  let s = 0;
  points.push(points[0]);
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    s += x1 * y2 - y1 * x2;
  }
  points.pop();
  return Math.abs(s/2);
}

const a = 2*x1 - 2*x2;
const b = 2*y1 - 2*y2;
const c = (x1**2 + y1**2 - r1**2) - (x2**2 + y2**2 - r2**2);
const t = 2*x1;
const u = 2*y1;
const v = x1**2 + y1**2 - r1**2;

const xSqrt = Math.sqrt(((2*b*c)/(a**2) - (t*b)/a + u)**2 - 4*(b**2/a**2 + 1)*(c**2/a**2 - (t*c)/a + v));
const xi1 = ((-2*b*c)/(a**2) + (t*b)/a - u + xSqrt) / (2*(b**2/a**2) + 1);
const xi2 = ((-2*b*c)/(a**2) + (t*b)/a - u - xSqrt) / (2*(b**2/a**2) + 1);
let ySqrt = Math.sqrt(((2*a*c)/(b**2) - (u*a)/b + t)**2 - 4*(a**2/b**2 + 1)*(c**2/b**2 - (u*c)/b + v));
const yi1 = ((-2*a*c)/(b**2) + (u*a)/b - t + ySqrt) / (2*(a**2/b**2) + 1);
const yi2 = ((-2*a*c)/(b**2) + (u*a)/b - t + ySqrt) / (2*(a**2/b**2) + 1);
console.log(`(${xi1}, ${yi1}), (${xi2}, ${yi2})`);
