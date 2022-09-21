let input = `4 6
a t c i s w`.split("\n").map(e => e.split(" "));

const [L, C] = input.shift().map(Number);
const letters = input.shift().sort();
const length = letters.length;
const vowels = ["a", "e", "i", "o", "u"];

let allComb = [];

function findComb(lv, txt="", idx=0) {
    for (let i = idx, l = length-L+lv+1; i < l; i++) {
        const tmpTxt = txt+letters[i];
        if (lv+1 === L) allComb.push(tmpTxt);
        else findComb(lv+1, tmpTxt, i+1);
    }
}
findComb(0);

console.log(allComb.filter(e => {
    let vowel = 0;
    for (let i = 0, l = e.length; i < l; i++) if (vowels.includes(e[i])) vowel++;
    if (vowel >= 1 && e.length-vowel >= 2) return true;
    else return false;
}).join("\n"));