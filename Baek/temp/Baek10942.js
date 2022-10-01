const isDev = process.platform !== "linux";
const [[N], nums, [Q], ...questions] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 11 111
1
1 3`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const dp1 = Array(N).fill(0);
const dp2 = Array(N - 1).fill(0);
const searching1 = [];
const searching2 = [];
for (let i = 0; i < N; i++) {
  const num = nums[i];
  searching1.push(i);
  if (num === nums[i - 1]) {
    searching2.push(i - 1/2)
  }

  for (let j = 0; j < searching1.length; j++) {
    const centerIdx = searching1[j];
    const diff = i - centerIdx;
    const leftIdx = centerIdx - diff;
    console.log(centerIdx, diff, nums[leftIdx], num)
    if (nums[leftIdx] === num) {
      dp1[centerIdx]++;
    } else {
      searching1.splice(j, 1);
    }
  }
  for (let j = 0; j < searching2.length; j++) {
    const leftCenterIdx = Math.floor(searching2[j]);
    const diff = i - leftCenterIdx;
    const leftIdx = leftCenterIdx - diff + 1;
    if (nums[leftIdx] === num) {
      dp2[leftCenterIdx]++;
    } else {
      searching2.splice(j, 1);
    }
  }
}

let out = "";
for (const question of questions) {
  const [S, E] = question.map(v => v - 1);
  const len = E - S + 1;
  const halfLen = Math.floor(len / 2);
  const centerIdx = S + halfLen;
  if (len%2 === 0) {
    if (dp2[centerIdx] >= len/2 - 1) {
      out += "1\n";
    } else {
      out += "0\n";
    }
  } else {
    if (dp1[centerIdx] >= len/2 - 1) {
      out += "1\n";
    } else {
      out += "0\n";
    }
  }
}

console.log(dp1, dp2, out.trim());
