let edge = `5 6
1
5 1 1
1 2 2
1 3 3
2 3 4
2 4 5
3 4 6`.split("\n").map(e => e.split(" ").map(Number));

let [V, eCount] = [input[0][0], input[1][0]];
let E = new Array(V+1);
let noneInfiniteEdge = new Array(V+1);

for (let i = 0; i < eCount; i++) {
    const tempEdge = edge[i];
    if (typeof E[tempEdge[0]] === "undefined") E[tempEdge[0]] = [];
    E[tempEdge[0]][tempEdge[1]] = tempEdge[2];
    if (typeof noneInfiniteEdge[tempEdge[0]] === "undefined") noneInfiniteEdge[tempEdge[0]] = [];
    noneInfiniteEdge[tempEdge[0]].push(tempEdge[1]);
}
edge = [];

function dijkstra(startVertex) {
    
}

dijkstra(input[1][0]-1);