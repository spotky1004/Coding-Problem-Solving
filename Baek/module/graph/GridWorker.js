/**
 * @template {2 | 3} Dim 
 */
class GridWorker {
  /**
   * @template {any} T
   * @typedef {T[][]} Arr2D 
   * @typedef {T[][][]} Arr3D 
   */
  /**
   * @typedef {[i: number, j: number]} Point2D 
   * @typedef {[i: number, j: number, k: number]} Point3D 
   */
  /**
   * @typedef {typeof GridWorker["CELL_PROPS"][keyof typeof GridWorker["CELL_PROPS"]]} GridWorkerCellTypes 
   */
  /**
   * @template {2 | 3} Dim 
   * @typedef GridWorkerOptions 
   * @prop {Dim} dim  
   * @prop {Dim extends 2 ? Arr2D<any> : Arr3D<any>} grid 
   * @prop {Dim extends 2 ? [di: number, dj: number][] : [di: number, dj: number, dk: number][]} moves 
   * @prop {Map<any, GridWorkerCellTypes>} cellProps 
   */

  /**
   * @template {Array} T 
   * @param {T} grid 
   * @returns {T} 
   */
  static cloneGrid(grid) {
    if (grid[0] instanceof Array) {
      const clone = [];
      for (let i = 0; i < grid.length; i++) {
        clone.push(GridWorker.cloneGrid(grid[i]));
      }
      return clone;
    } else {
      return grid.slice(0);
    }
  }

  /**
   * @template {2 | 3} Dim 
   * @param {Dim} dim 
   * @param {Dim extends 2 ? Arr2D<any> : Arr3D<any>} grid 
   * @param {Dim extends 2 ? (val: any, i: number, j: number) => any : (val: any, i: number, j: number, k: number) => any} callback 
   */
  static looper(dim, grid, callback) {
    if (dim === 2) {
      for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
          const newVal = callback(row[j], i, j);
          if (typeof newVal === "undefined") continue;
          row[j] = newVal;
        }
      }
    } else if (dim === 3) {
      for (let i = 0; i < grid.length; i++) {
        const board = grid[i];
        for (let j = 0; j < board.length; j++) {
          const row = board[j];
          for (let k = 0; k < row.length; k++) {
            const newVal = callback(row[k], i, j, k);
            if (typeof newVal === "undefined") continue;
            row[k] = newVal;
          }
        }
      }
    }
  }

  /**
   * @template {2 | 3} Dim 
   * @param {Dim} dim 
   * @param {Dim extends 2 ? Arr2D<any> : Arr3D<any>} grid 
   * @param {Map<number | string, number>} convert 
   * @returns {Dim extends 2 ? number[][] : number[][][]} 
   */
  static converter(dim, grid, convert) {
    GridWorker.looper(dim, grid, (v) => convert.get(v) ?? v);
    return grid;
  }

  /**
   * @template {2 | 3} Dim 
   * @template {any[]} Finds 
   * @param {Dim} dim 
   * @param {Dim extends 2 ? Arr2D<any> : Arr3D<any>} gird 
   * @param {Finds} toFinds 
   * @returns {Map<Finds[number], Dim extends 2 ? Point2D[] : Point3D[]>} 
   */
  static finder(dim, gird, ...toFinds) {
    /** @type {Finds[number]} */
    const toFindSet = new Set(toFinds);
    const found = new Map();
    for (const toFind of toFinds) found.set(toFind, []);
    if (dim === 2) {
      GridWorker.looper(dim, gird, (v, i, j) => {
        if (toFindSet.has(v)) found.get(v).push([i, j]);
      });
    } else if (dim === 3) {
      GridWorker.looper(dim, gird, (v, i, j, k) => {
        if (toFindSet.has(v)) found.get(v).push([i, j, k]);
      });
    }
    return found;
  }

  /**
   * @template {2 | 3} Dim 
   * @template T 
   * @param {Dim} dim 
   * @param {Dim extends 2 ? [N: number, M: number] : [H: number, N: number, M: number]} shape 
   * @param {T} fillValue 
   * @returns {Dim extends 2 ? Arr2D<T> : Arr3D<T>} 
   */
  static createGrid(dim, shape, fillValue) {
    if (dim === 2) {
      return Array.from({ length: shape[0] }, _ => Array(shape[1]).fill(fillValue));
    } else if (dim === 3) {
      return Array.from({ length: shape[0] }, _ => Array.from({ length: shape[1] }, _ => Array(shape[2]).fill(fillValue)));
    }
  }

  static CELL_PROPS = {
    /** @type {0} */
    "FLOOR": 0,
    /** @type {1} */
    "BLOCK": 1
  };

  /** @type {Dim} */
  dim = 2;
  /** @type {Dim extends 2 ? [N: number, M: number] : [H: number, N: number, M: number]} */
  shape = [0, 0];
  /** @type {Dim extends 2 ? Arr2D<any> : Arr3D<any>} */
  grid = [];
  /** @type {Dim extends 2 ? [di: number, dj: number][] : [di: number, dj: number, dk: number][]} */
  moves = [];
  /** @type {Map<any, GridWorkerCellTypes>} */
  cellProps = new Map();

  /**
   * @param {GridWorkerOptions<Dim>} options 
   */
  constructor(options) {
    const { dim, grid, moves, cellProps } = options;
    this.dim = dim;
    this.shape = dim === 2 ? [grid.length, grid[0].length] : [grid.length, grid[0].length, grid[0][0].length];
    this.grid = grid;
    this.moves = moves;
    this.cellProps = cellProps;
  }

  /**
   * @param {Dim extends 2 ? (Point2D | Point2D[]) : (Point3D | Point3D[])} from 
   * @returns {Dim extends 2 ? Arr2D<number> : Arr3D<number>} 
   */
  calcDistances(from) {
    const { dim, shape, grid, moves, cellProps } = this;
    const { BLOCK } = GridWorker.CELL_PROPS;

    const distances = GridWorker.createGrid(dim, shape, -1);
    /** @type {Dim extends 2} */
    const queue = from[0] instanceof Array ? [...from] : [from];
    const convertedGrid = GridWorker.converter(dim, GridWorker.cloneGrid(grid), cellProps);

    if (dim === 2) {
      const [N, M] = this.shape;
      distances[from[0]][from[1]] = 0;
      for (const [i, j] of queue) {
        for (const [di, dj] of moves) {
          const [ti, tj] = [i + di, j + dj];
          if (
            0 > ti || ti >= N ||
            0 > tj || tj >= M ||
            distances[ti][tj] !== -1 ||
            convertedGrid[ti][tj] === BLOCK
          ) continue;
          distances[ti][tj] = distances[i][j] + 1;
          queue.push([ti, tj]);
        }
      }
    } else {
      const [H, N, M] = this.shape;
      distances[from[0]][from[1]][from[2]] = 0;
      for (const [i, j, k] of queue) {
        for (const [di, dj, dk] of moves) {
          const [ti, tj, tk] = [i + di, j + dj, k + dk];
          if (
            0 > ti || ti >= H ||
            0 > tj || tj >= N ||
            0 > tk || tk >= M ||
            distances[ti][tj][tk] !== -1 ||
            convertedGrid[ti][tj][tk] === BLOCK
          ) continue;
          distances[ti][tj][tk] = distances[i][j][k] + 1;
          queue.push([ti, tj, tk]);
        }
      }
    }
    return distances;
  }

  /**
   * @param {Dim extends 2 ? Point2D : Point3D} from 
   * @param {Dim extends 2 ? Point2D : Point3D} to 
   * @returns {Dim extends 2 ? Point2D[] : Point3D[]} 
   */
  shortestPath(from, to) {
    const { dim, moves } = this;
    const distances = this.calcDistances(from, to);
    const path = [[...to]];
    let curPos = to;
    if (dim === 2) {
      const [N, M] = this.shape;
      let curDist = distances[to[0]][to[1]];
      loop: while (curDist > 0) {
        curDist--;
        const [i, j] = curPos;
        for (const [di, dj] of moves) {
          const [ti, tj] = [i + di, j + dj];
          if (
            0 > ti || ti >= N ||
            0 > tj || tj >= M ||
            distances[ti][tj] !== curDist
          ) continue;
          curPos = [ti, tj];
          path.push(curPos);
          continue loop;
        }
      }
    } else if (dim === 3) {
      const [H, N, M] = this.shape;
      let curDist = distances[to[0]][to[1]][to[2]];
      loop: while (curDist > 0) {
        curDist--;
        const [i, j, k] = curPos;
        for (const [di, dj, dk] of moves) {
          const [ti, tj, tk] = [i + di, j + dj, k + dk];
          if (
            0 > ti || ti >= H ||
            0 > tj || tj >= N ||
            0 > tk || tl >= M ||
            distances[ti][tj][tk] !== curDist
          ) continue;
          curPos = [ti, tj, tk];
          path.push(curPos);
          continue loop;
        }
      }
    }
    return path.reverse();
  }

  /**
   * @param {Dim extends 2 ? (value: any, i: number, j: number) => any : (value: any, i: number, j: number, k: number) => any} replacer 
   */
  flood(replacer) {
    const { dim, shape, grid, moves } = this;
    const clone = GridWorker.cloneGrid(grid);
    const visited = GridWorker.createGrid(dim, shape, false);
    if (dim === 2) {
      const [N, M] = this.shape;
      GridWorker.looper(dim, clone, (v, i, j) => {
        if (visited[i][j]) return;
        const replaceValue = replacer(v, i, j);
        const queue = [[i, j]];
        visited[i][j] = true;
        clone[i][j] = replaceValue;
        for (const [i, j] of queue) {
          for (const [di, dj] of moves) {
            const [ti, tj] = [i + di, j + dj];
            if (
              0 > ti || ti >= N ||
              0 > tj || tj >= M ||
              visited[ti][tj] ||
              grid[ti][tj] !== v
            ) continue;
            visited[ti][tj] = true;
            clone[ti][tj] = replaceValue;
            queue.push([ti, tj]);
          }
        }
      });
    } else if (dim === 3) {
      const [H, N, M] = this.shape;
      GridWorker.looper(dim, clone, (v, i, j, k) => {
        if (visited[i][j][k]) return;
        const replaceValue = replacer(v, i, j, k);
        const queue = [[i, j, k]];
        visited[i][j][k] = true;
        clone[i][j][k] = replaceValue;
        for (const [i, j, k] of queue) {
          for (const [di, dj, dk] of moves) {
            const [ti, tj] = [i + di, j + dj, k + dk];
            if (
              0 > ti || ti >= H ||
              0 > tj || tj >= N ||
              0 > tj || tj >= M ||
              visited[ti][tj][tk] ||
              grid[ti][tj] !== v
            ) continue;
            visited[ti][tj][tk] = true;
            clone[ti][tj][tk] = replaceValue;
            queue.push([ti, tj, tk]);
          }
        }
      });
    }
    return clone;
  }
}
