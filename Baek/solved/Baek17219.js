const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`16 4
noj.am IU
acmicpc.net UAENA
startlink.io THEKINGOD
google.com ZEZE
nate.com VOICEMAIL
naver.com REDQUEEN
daum.net MODERNTIMES
utube.com BLACKOUT
zum.com LASTFANTASY
dreamwiz.com RAINDROP
hanyang.ac.kr SOMEDAY
dhlottery.co.kr BOO
duksoo.hs.kr HAVANA
hanyang-u.ms.kr OBLIVIATE
yd.es.kr LOVEATTACK
mcc.hanyang.ac.kr ADREAMER
startlink.io
acmicpc.net
noj.am
mcc.hanyang.ac.kr`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

const [N, M] = input.shift().map(Number);
const pass = input.splice(0, N).sort((a, b) => a[0].localeCompare(b[0]));
const sites = input.splice(0, M).map((v, i) => [v[0], i]).sort((a, b) => a[0].localeCompare(b[0]));

const out = Array(M);
let i = 0;
for (const [site, qIdx] of sites) {
  while (pass[i][0] !== site) i++;
  out[qIdx] = pass[i][1];
}
console.log(out.join("\n"));
