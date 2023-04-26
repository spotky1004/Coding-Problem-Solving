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