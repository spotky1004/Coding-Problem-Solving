const [a, b, c, d] = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]];
function ccw([x1, y1], [x2, y2], [x3, y3]) {
  return x1*y2 + x2*y3 + x3*y1 - (x2*y1 + x3*y2 + x1*y3);
}

function lineSegmentIntersetion(a, b, c, d) {
  const ccw1 = ccw(c, d, a) * ccw(c, d, b);
  const ccw2 = ccw(a, b, c) * ccw(a, b, d);
  const cond1 = ccw1 <= 0 && ccw2 <= 0;
  const cond2 = ccw1 === 0 && ccw2 === 0;
  if (cond2) {
    const offset = a;
    const [[t, u], [v, w]] = [
      [
        (a[0] - offset) || (a[1] - offset),
        (b[0] - offset) || (b[1] - offset)
      ].sort((a, b) => a - b),
      [
        (c[0] - offset) || (c[1] - offset),
        (d[0] - offset) || (d[1] - offset)
      ].sort((a, b) => a - b)
    ];
    return t < w && v < u;
  }
  return cond1;
}