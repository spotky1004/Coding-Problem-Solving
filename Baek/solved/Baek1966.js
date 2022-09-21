let input = `3
1 0
5
4 2
1 2 3 4
6 0
1 1 9 1 1 1`.trim().split("\n").map(e => e = e.split(" ").map(Number));
input.shift();

for (let i = 0, l = input.length; i < l; i += 2) {
    let [nthToFind, docs] = [input[i][1], input[i+1].map((e, idx) => e = [e, idx])];
    let counter = 0;

    loop: while (1) {
        for (let j = 0, l2 = docs.length; j < l2; j++) {
            if (docs[0][0] < docs[j][0]) {
                docs.push(docs.shift());
                continue loop;
            }
        }
        if (docs[0][1] == nthToFind) {
            console.log(counter+1);
            break;
        } else {
            counter++;
            docs.shift();
        }
    }
}