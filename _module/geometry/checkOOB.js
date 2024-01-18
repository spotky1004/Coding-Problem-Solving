/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= width ||
    0 > y || y >= height
  ) return true;
  return false;
}
