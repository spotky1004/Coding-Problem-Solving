const rawInput = `4 4
1111
1111
1111
1111`;
const input = rawInput.trim().split("\n").map(v => v.trim());

const [sizeY, sizeX] = input[0].split(" ").map(v => +v);
const maze = [...input.slice(1)].map(v => v.split("").map(v => +v));

/**
 * @typedef Vector2
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef SearchingData
 * @property {Vector2} at
 * @property {number} movedLength
 * @property {number[][]} map
 * @property {boolean} isDone
 */
/** @type {SearchingData[]} */
let searchingDatas = [
  {
    at: {x: 0, y: 0},
    movedLength: 1,
    map: [...maze.map(v => [...v])],
    isDone: false
  }
];

const vectorsEnum = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
}
/** @type {Record<keyof typeof vectorsEnum, Vector2>} */
const vectors = {
  down: {x: 0, y: 1},
  up: {x: 0, y: -1},
  right: {x: 1, y: 0},
  left: {x: -1, y: 0},
}

/** @type {SearchingData[]} */
let nextSearchingDatas = [];
while (
  searchingDatas.length !== 1 ||
  searchingDatas[0].isDone === false
) {
  for (let i = 0; i < searchingDatas.length; i++) {
    const sd = searchingDatas[i];
    if (sd.isDone) {
      let prevDoneIdx = nextSearchingDatas.findIndex(data => data.isDone);
      if (
        prevDoneIdx === -1 ||
        nextSearchingDatas[prevDoneIdx].movedLength > sd.movedLength
      ) {
        nextSearchingDatas.splice(prevDoneIdx, 1);
        nextSearchingDatas.push(sd);
      }
      continue;
    }

    const {x, y} = sd.at;
    sd.map[y][x] = 0;
    
    const [
      atBottomEdge,
      atTopEdge,
      atRightEdge,
      atLeftEdge,
    ] = [
      y === sizeY-1,
      y === 0,
      x === sizeX-1,
      x === 0
    ];
    const [
      canGoDown,
      canGoUp,
      canGoRight,
      canGoLeft,
    ] = [
      !atBottomEdge && sd.map[y+vectors.down.y][x+vectors.down.x] === 1,
      !atTopEdge && sd.map[y+vectors.up.y][x+vectors.up.x] === 1,
      !atRightEdge && sd.map[y+vectors.right.y][x+vectors.right.x] === 1,
      !atLeftEdge && sd.map[y+vectors.left.y][x+vectors.left.x] === 1,
    ];

    const directions = ["down", "up", "right", "left"];
    let canMoves = [canGoDown, canGoUp, canGoRight, canGoLeft];
    if (canMoves.every(v => v === false)) continue;
    for (let j = 0; j < directions.length; j++) {
      if (!canMoves[j]) continue;

      const direction = directions[j];
      /** @type {Vector2} */
      const moveVector = vectors[direction];
      /** @type {SearchingData} */
      const nextData = {
        at: {
          x: x+moveVector.x,
          y: y+moveVector.y
        },
        map: [...sd.map.map(v => [...v])],
        movedLength: sd.movedLength+1,
        isDone: x+moveVector.x === sizeX-1 && y+moveVector.y === sizeY-1
      };

      const samePositionIndex = nextSearchingDatas.findIndex(data => data.at.x === nextData.at.x && data.at.y === nextData.at.y);
      if (samePositionIndex !== -1) {
        const canReplace = nextData.movedLength < nextSearchingDatas[samePositionIndex].movedLength;
        if (canReplace) {
          nextSearchingDatas[samePositionIndex] = nextData;
        }
      } else {
        nextSearchingDatas.push(nextData);
      }
    }
  }
  searchingDatas = [...nextSearchingDatas];
  nextSearchingDatas = [];
}

console.log(searchingDatas[0].movedLength);
