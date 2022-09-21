let input = `5
7
3 8
8 1 0
2 7 4 4
4 5 2 6 5`.trim().split("\n").map(e => e.split(" ").map(Number));
for(i=input.shift()[0]-2;i>=0;i--)for(j=0;j<i+1;j++)input[i][j]+=Math.max(input[i+1][j],input[i+1][j+1]);
console.log(input[0][0]);