/**
 * @param {number[]} a 
 * @param {number[]} b 
*/
function convolution(a, b) {
  const N = 2 ** Math.ceil(Math.log2(Math.max(a.length, b.length)) + 1);
  const aPadLen = N - a.length;
  const bPadLen = N - b.length;
  const outLen = a.length + b.length - 1;
  const a_r = [...a];
  const b_r = [...b];
  const a_i = Array(N).fill(0);
  const b_i = Array(N).fill(0);
  for (let i = 0; i < aPadLen; i++) a_r.push(0);
  for (let i = 0; i < bPadLen; i++) b_r.push(0);

  const order = Array(N).fill(0);
  for (let i = 1; i < N; i <<= 1) {
    const add = N / i / 2;
    for (let j = i; j < N; j++) {
      if (i & j) order[j] += add;
    }
  }

  const unitRad = 2 * Math.PI / N;
  const wp_rs = Array(N);
  const wp_is = Array(N);
  for (let i = 0; i < N; i++) {
    wp_rs[i] = Math.cos(i * unitRad);
    wp_is[i] = Math.sin(i * unitRad);
  }
  const wip_is = Array(N);
  for (let i = 0; i < N; i++) wip_is[i] = -wp_is[i];

  dft(a_r, a_i, wp_rs, wp_is, order);
  dft(b_r, b_i, wp_rs, wp_is, order);
  for (let i = 0; i < N; i++) {
    [a_r[i], a_i[i]] = [a_r[i] * b_r[i] - a_i[i] * b_i[i], a_r[i] * b_i[i] + a_i[i] * b_r[i]];
  }

  dft(a_r, a_i, wp_rs, wip_is, order);
  for (let i = 0; i < a_r.length; i++) a_r[i] = Math.round(a_r[i] / N);
  while (a_r.length > outLen) a_r.pop();
  
  return a_r;
}

/**
 * @param {number[]} f_r 
 * @param {number[]} f_i 
 * @param {number[]} w_rs 
 * @param {number[]} w_is 
 * @param {number[]} order 
*/
function dft(f_r, f_i, w_rs, w_is, order) {
  const N = f_r.length;

  for (let i = 0; i < N; i++) {
    const x = order[i];
    const y = order[x];
    if (x >= y) continue;
    [f_r[x], f_r[y]] = [f_r[y], f_r[x]];
    [f_i[x], f_i[y]] = [f_i[y], f_i[x]];
  }

  let a_r, a_i, b_r, b_i, w_r, w_i, t_r, t_i, u_r, u_i;
  for (let i = 2; i <= N; i <<= 1) {
    const wPowAcc = N / i;
    const half = i / 2;
    for (let j = 0; j < N; j += i) {
      let wPow = 0;
      for (let k = 0; k < half; k++) {
        a_r = f_r[j + k], a_i = f_i[j + k];
        b_r = f_r[j + k + half], b_i = f_i[j + k + half];
        w_r = w_rs[wPow], w_i = w_is[wPow];
        t_r = w_r * b_r - w_i * b_i, t_i = w_r * b_i + w_i * b_r;
        [
          f_r[j + k], f_i[j + k],
          f_r[j + k + half], f_i[j + k + half]
        ] = [
          a_r + t_r, a_i + t_i,
          a_r - t_r, a_i - t_i
        ];
        wPow += wPowAcc;
      }
    }
  }
}
