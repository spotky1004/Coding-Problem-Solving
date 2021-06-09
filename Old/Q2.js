const input = `5
. . D . .
. . R . .
. R . . .
. . . L .
. . . . .
3
0 2
1 2
3 3`;

function parseInput(str) {
    const sInput = str.split("\n");
    const info = {};
    info.markLength = Number(sInput[0]);
    info.clickCount = Number(sInput[info.markLength+1]);

    parsed = {};

    parsed.mark = [];
    for (let i = 0; i < info.markLength; i++) {
        parsed.mark.push(sInput[1+i].split(" "));
    }

    parsed.toClick = [];
    for (let i = 0; i < info.clickCount; i++) {
        const temp = sInput[info.markLength+i+2].split(" ");
        parsed.toClick.push({
            x: Number(temp[1]),
            y: Number(temp[0])
        });
    }

    return parsed;
}

const _directions = {
    L: {x: -1, y: 0},
    R: {x: 1, y: 0},
    U: {x: 0, y: -1},
    D: {x: 0, y: 1}
};
class gameSimulator {
    constructor(mark=[], toClick=[]) {
        this.mark = mark;

        this.board = [];
        for (let i = 0, l = this.mark.length; i < l; i++) {
            this.board.push([]);
            for (let j = 0, l2 = this.mark[i].length; j < l2; j++) {
                this.board[i].push(0);
            }
        }

        this.toClick = toClick;
    }

    simulate() {
        for (let i = 0, l = this.toClick.length; i < l; i++) this.clickAt(...Object.values(this.toClick[i]));

        return this;
    }

    clickAt(x, y) {
        if (this.mark[y][x] == ".") return;

        this.board[y][x] ^= 1;
        for (const i in _directions) {
            if (this.mark[y][x].includes(i)) {
                let changePoint = {x: x, y: y};
                const moveDirection = _directions[i];

                changePoint.x += moveDirection.x;
                changePoint.y += moveDirection.y;

                while (
                    0 <= changePoint.x && changePoint.x < this.mark[y].length &&
                    0 <= changePoint.y && changePoint.y < this.mark.length
                ) {
                    this.board[changePoint.y][changePoint.x] ^= 1;

                    changePoint.x += moveDirection.x;
                    changePoint.y += moveDirection.y;
                }
            }
        }
    }
}

const answer = new gameSimulator(...Object.values(parseInput(input))).simulate();

console.log(answer);