let input = `16
0 197 15 250 71 11 41 42 95 50 13 33 30 92 61 68
5 0 9 197 46 36 63 25 12 14 80 35 47 55 37 86
6 13 0 12 29 57 42 75 70 2 15 2 67 50 25 51
8 8 9 0 66 61 68 11 10 29 67 82 33 8 17 67
4 32 82 0 51 49 5 54 94 7 84 74 36 0 69 34
9 37 29 49 0 19 40 90 49 50 92 35 24 84 16 63
90 82 82 79 3 0 90 55 22 49 89 49 98 88 11 46
80 62 39 82 87 57 0 50 66 6 28 64 92 31 17 44
89 33 59 27 55 47 37 0 43 35 34 5 36 5 73 29
20 68 18 3 3 60 75 48 27 0 17 11 65 46 98 4
45 62 47 73 71 99 51 20 33 0 69 57 27 56 3 56
34 1 73 38 7 98 18 14 1 47 30 0 89 43 85 57
83 92 52 58 75 83 59 13 5 30 48 0 20 9 63 65
3 43 33 36 48 85 4 78 50 81 51 39 0 10 51 2
19 42 72 71 45 5 53 85 72 0 33 33 73 1 0 62
1 88 45 50 18 37 44 60 45 81 59 72 55 77 53 0`.trim().split("\n").map(e => e.split(" ").map(Number));
const node = input.shift()[0];
let sortedInput = input.map(e => e.map((e, i) => [e, i]).sort((a, b) => a[0]-b[0]));

let minimumCost = Infinity;
function search(at=0, visited=[], cost=0) {
    const costs = input[at];

    if (visited.every((e, i) => e || !i)) {
        if (costs[0] === 0) return;
        cost += costs[0]
        if (cost < minimumCost) minimumCost = cost;
        return;
    }
    
    const sortedCosts = sortedInput[at];
    for (let i = 0; i < node; i++) {
        const [tempCost, tempIdx] = sortedCosts[i];
        if (
            !visited[tempIdx] &&
            tempCost[tempCost] !== 0 &&
            tempIdx !== at && 
            cost+tempCost < minimumCost
        ) {
            let tmpVisited = visited.slice(0);
            tmpVisited[tempIdx] = 1;
            search(i, tmpVisited, cost+tempCost);
        }
    }
}

search(0, new Array(node).fill(0));
console.log(minimumCost);

/* `16
0 197 15 250 71 11 41 42 95 50 13 33 30 92 61 68
5 0 9 197 46 36 63 25 12 14 80 35 47 55 37 86
6 13 0 12 29 57 42 75 70 2 15 2 67 50 25 51
8 8 9 0 66 61 68 11 10 29 67 82 33 8 17 67
4 32 82 0 51 49 5 54 94 7 84 74 36 0 69 34
9 37 29 49 0 19 40 90 49 50 92 35 24 84 16 63
90 82 82 79 3 0 90 55 22 49 89 49 98 88 11 46
80 62 39 82 87 57 0 50 66 6 28 64 92 31 17 44
89 33 59 27 55 47 37 0 43 35 34 5 36 5 73 29
20 68 18 3 3 60 75 48 27 0 17 11 65 46 98 4
45 62 47 73 71 99 51 20 33 0 69 57 27 56 3 56
34 1 73 38 7 98 18 14 1 47 30 0 89 43 85 57
83 92 52 58 75 83 59 13 5 30 48 0 20 9 63 65
3 43 33 36 48 85 4 78 50 81 51 39 0 10 51 2
19 42 72 71 45 5 53 85 72 0 33 33 73 1 0 62
1 88 45 50 18 37 44 60 45 81 59 72 55 77 53 0` 
*/