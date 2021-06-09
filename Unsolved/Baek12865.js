let input = `4 7
6 13
4 8
3 6
5 12`.trim().split("\n").map(e => e.split(" ").map(Number));

const [count, maxW] = input.shift();

let dynamic = new Array(count);

for (let i = 0; i < count; i++) {
    for (let j = 0; j < maxW; j++) {
        if (!i || !j) {
            dynamic[i][j] = 0;
        } else if (j < 1) {

        }
    }
}
