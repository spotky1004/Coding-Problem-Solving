/**
 * @param {number[]} parents 
*/
function genSparseTable(parents) {
  const sparseTable = [[...parents]];
  
  const tableSize = Math.ceil(Math.log2(parents.length));
  for (let i = 1; i < tableSize; i++) {
    const prevRow = sparseTable[i - 1];
    const row = Array(parents.length);
    row[0] = -1;

    for (let j = 1; j < parents.length; j++) {
      row[j] = prevRow[prevRow[j]];
    }
    sparseTable.push(row);
  }

  return sparseTable;
}

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number[]} depths 
 * @param {number[][]} sparseTable 
*/
function calcLCA(a, b, depths, sparseTable) {
  if (depths[a] < depths[b]) [a, b] = [b, a];

  a = moveNodeOnSparseTable(a, depths[a] - depths[b], sparseTable);
  let depth = depths[b];

  if (a === b) return a;

  let left = 0;
  let right = depth;
  let mid;
  while (true) {
    mid = Math.floor((left + right) / 2);
    
    const newA = moveNodeOnSparseTable(a, depth - mid, sparseTable);
    const newB = moveNodeOnSparseTable(b, depth - mid, sparseTable);
    if (newA === newB) {
      left = mid;
    } else {
      right = mid;
    }

    if (right - left <= 1) return moveNodeOnSparseTable(a, depth - left, sparseTable);
  }
}

/**
 * @param {number} node 
 * @param {number} count 
 * @param {number[][]} sparseTable 
*/
function moveNodeOnSparseTable(node, count, sparseTable) {
  for (let i = 0; i < sparseTable.length; i++) {
    if ((count & (1 << i)) === 0) continue;
    node = sparseTable[i][node];
  }
  return node;
}
