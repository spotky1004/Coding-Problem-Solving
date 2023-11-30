function dlx(sets) {
  class Node {
    /** @type {number} */
    setIdx = -1;
  
    /** @type {number} */
    size = 0;
    /** @type {Node} */
    top;
    
    /** @type {Node} */
    l;
    /** @type {Node} */
    r;
    /** @type {Node} */
    u;
    /** @type {Node} */
    d;

    constructor() {}
  }

  const setLen = sets[0].length;
  const setCount = sets.length;
  /** @type {(Node | null)[][]} */
  const setsTable = Array.from({ length: setCount + 1 }, _ => Array(setLen + 1).fill(null));
  for (let i = 0; i <= setLen; i++) {
    const node = new Node();
    node.setIdx = -1;
    node.size = 0;
    node.top = node;

    setsTable[0][i] = node;
  }
  for (let i = 0; i < setCount; i++) {
    const set = sets[i];
    for (let j = 0; j < setLen; j++) {
      if (set[j] === 0) continue;
      const node = new Node();
      node.setIdx = i;
      node.top = setsTable[0][j + 1];
      node.top.size++;

      setsTable[i + 1][j + 1] = node;
    }
  }

  for (let i = 0; i <= setLen; i++) {
    /** @type {Node | null} */
    let firstNode = null;
    /** @type {Node | null} */
    let prevNode = null;
    for (let j = 0; j <= setCount; j++) {
      const curNode = setsTable[j][i];
      if (curNode === null) continue;
      if (prevNode !== null) {
        prevNode.d = curNode;
        curNode.u = prevNode;
      }
      prevNode = curNode;
      if (firstNode === null) firstNode = curNode;
    }
    if (firstNode !== null && prevNode !== null) {
      firstNode.u = prevNode;
      prevNode.d = firstNode;
    }
  }
  for (let i = 0; i <= setCount; i++) {
    /** @type {Node | null} */
    let firstNode = null;
    /** @type {Node | null} */
    let prevNode = null;
    for (let j = 0; j <= setLen; j++) {
      const curNode = setsTable[i][j];
      if (curNode === null) continue;
      if (prevNode !== null) {
        prevNode.r = curNode;
        curNode.l = prevNode;
      }
      prevNode = curNode;
      if (firstNode === null) firstNode = curNode;
    }
    if (firstNode !== null && prevNode !== null) {
      firstNode.l = prevNode;
      prevNode.r = firstNode;
    }
  }

  /** @type {Node} */
  const root = setsTable[0][0];
  function findMinHead() {
    /** @type {Node | -1} */
    let minHead = -1;
    let minHeadSize = Infinity;

    for (let head = root.r; head !== root; head = head.r) {
      if (head.size === 0) return -1;
      if (head.size >= minHeadSize) continue;
      minHead = head;
      minHeadSize = head.size;
    }

    return minHead;
  }

  /**
   * @param {Node} head 
   */
  function cover(head) {
    head.l.r = head.r;
    head.r.l = head.l;

    for (let a = head.d; a !== head; a = a.d) {
      for (let b = a.r; b !== a; b = b.r) {
        b.top.size--;
        b.u.d = b.d;
        b.d.u = b.u;
      }
    }
  }

  /**
   * @param {Node} head 
   */
  function uncover(head) {
    head.l.r = head;
    head.r.l = head;

    for (let a = head.d; a !== head; a = a.d) {
      for (let b = a.r; b !== a; b = b.r) {
        b.top.size++;
        b.u.d = b;
        b.d.u = b;
      }
    }
  }

  let depth = -1;
  const minHeads = [];
  const selectedNodes = [];
  const covered = [];
  while (true) {
    depth++;
    if (root.r === root) {
      return selectedNodes.map(node => node.setIdx).sort((a, b) => a - b);
    }

    const minHead = findMinHead();
    if (minHead === -1) {
      depth--;
      if (depth === -1) return -1;
      while (true) {
        if (depth === -1) {
          return -1;
        }
        while (true) {
          const toUncover = covered.pop();
          if (toUncover === -1) break;
          uncover(toUncover);
        }

        selectedNodes[depth] = selectedNodes[depth].d;
        const moved = selectedNodes[depth];
        if (moved === moved.top) {
          depth--;
          minHeads.pop();
          selectedNodes.pop();
          continue;
        }

        const minHead = minHeads[depth];
        covered.push(-1);
        covered.push(minHead);
        cover(minHead);
        for (let node = moved.r; node !== moved; node = node.r) {
          covered.push(node.top);
          cover(node.top);
        }
        break;
      }
      continue;
    }

    minHeads.push(minHead);
    const selected = minHead.d;
    selectedNodes.push(selected);
    covered.push(-1);
    covered.push(minHead);
    cover(minHead);
    for (let node = selected.r; node !== selected; node = node.r) {
      covered.push(node.top);
      cover(node.top);
    }
  }

  return -1;
}
