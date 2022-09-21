let [n, x, y] = `12 1 3`.split(" ").map(Number);
let s = new Date().getTime();

let count = 0;

function fillNumber(arr, leftNum, i) {
    if (leftNum.length == 0) {
        count++;
        return;
    }

    if (arr[i] != null) {
        fillNumber(arr, leftNum, i+1);
        return;
    }
        
    for (let j = 0, l2 = leftNum.length; j < l2; j++) {
        const n = leftNum[j];
        let tmpArr = arr.slice(0);
        let tmpLeftNum = leftNum.slice(0);
        
        if (tmpArr.length <= i+n+1 || tmpArr[i+n+1]) continue;
        else {
            tmpArr[i] = n;
            tmpArr[i+n+1] = n;
            tmpLeftNum.splice(j, 1);
            fillNumber(tmpArr, tmpLeftNum, i+1);
        }
    }
}

let arr = new Array(n*2).fill(null);
const firstFill = Math.abs(y-x-1);
arr[y-1] = arr[x-1] = firstFill;
fillNumber(arr, Array.from({length: n}, (_, i) => i+1).filter(e => e != firstFill), 0);
console.log(count);