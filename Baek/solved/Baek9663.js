const input = +"13";
let time = new Date().getTime();

let board = 0;

function placeQueen(y, queen) {
    if (queen.length == input) {
        board++;
        return;
    }

    loop: for (let i = 0; i < input; i++) {
        for (let q = 0, l = queen.length; q < l; q++) {
            if (
                queen[q].x == i ||
                queen[q].x-i == queen[q].y-y ||
                -(queen[q].x-i) == queen[q].y-y
            ) continue loop;
        }
        let tmp = queen.slice(0);
        tmp.push({x: i, y: y});
        placeQueen(y+1, tmp);
    }
}

placeQueen(0, []);
console.log(board, new Date().getTime() - time);