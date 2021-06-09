function parseInput(str) {
    const sInput = str.split("\n");
    const info = {};
    info.mLength = Number(sInput[0]);
    info.pCount = Number(sInput[info.mLength+1]);

    parsed = {};

    parsed.mark = [];
    for (let i = 0; i < info.mLength; i++) {
        parsed.mark.push(sInput[1+i].split(" "));
    }

    parsed.push = [];
    for (let i = 0; i < info.pCount; i++) {
        const temp = sInput[info.mLength+i+2].split(" ");
        parsed.push.push({
            x: Number(temp[1]),
            y: Number(temp[0])
        });
    }

    return parsed;
}

const _dir = {
    L: {x: -1, y: 0},
    R: {x: 1, y: 0},
    U: {x: 0, y: -1},
    D: {x: 0, y: 1}
};
class gameSimulator {
    constructor(mk=[], push=[]) {
        this.mk = mk;

        this.board = [];
        for (let i = 0, l = this.mk.length; i < l; i++) {
            this.board.push([]);
            for (let j = 0, l2 = this.mk[i].length; j < l2; j++) {
                this.board[i].push(0);
            }
        }

        this.push = push;
    }

    simulate() {
        for (let i = 0, l = this.push.length; i < l; i++) this.clickAt(...Object.values(this.push[i]));

        return this;
    }

    clickAt(x, y) {
        if (this.mk[y][x] == ".") return;

        this.board[y][x] ^= 1;
        for (const i in _dir) {
            if (this.mk[y][x].includes(i)) {
                let pt = {x: x, y: y};
                const md = _dir[i];

                pt.x += md.x;
                pt.y += md.y;

                while (
                    0 <= pt.x && pt.x < this.mk[y].length &&
                    0 <= pt.y && pt.y < this.mk.length
                ) {
                    this.board[pt.y][pt.x] ^= 1;

                    pt.x += md.x;
                    pt.y += md.y;
                }
            }
        }
    }
}

const answer = new gameSimulator(...Object.values(parseInput(input))).simulate();

console.log(answer);