function ccw(x1, y1, x2, y2, x3, y3) {
  const r1 = (Math.atan2(x1 - x2, y1 - y2) + Math.PI * 2) % (Math.PI * 2);
  const r2 = (Math.atan2(x3 - x2, y3 - y2) + Math.PI * 2) % (Math.PI * 2);
  const diff = (r1 - r2 + Math.PI * 2) % (Math.PI * 2);

  if (Math.abs(diff - Math.PI) <= 0.00001 || Math.abs(diff) <= 0.00001) return 0;
  if (diff < Math.PI) return -1;
  return 1;
}
