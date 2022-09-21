const input = `ACAYKP
CAPCAK`.trim().split("\n");
let [s1, s2] = input.map(e => "0"+e.trim());
let [l1, l2] = [s1.length, s2.length];
let LCS = new Array(l2).fill(0);

for (let i = 1; i < l1; i++) {
    let tmpLCS = new Array(l2).fill(0);
    for (let j = 1; j < l2; j++) {
        if (s1[i] == s2[j]) tmpLCS[j] = LCS[j-1]+1;
        else tmpLCS[j] = Math.max(LCS[j], tmpLCS[j-1]);
    }
    LCS = tmpLCS;
}
console.log(LCS[l2-1]);