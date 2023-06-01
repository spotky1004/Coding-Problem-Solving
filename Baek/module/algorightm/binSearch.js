function binSearch(arr, v) {
  let left = 0, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === v) return mid;
    else if (arr[mid] < v) left = mid;
    else right = mid;
  }
  return left;
}

function lowerBound(arr, v) {
  let left = -1, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < v) left = mid;
    else right = mid;
  }
  return right;
}

function upperBound(arr, v) {
  let left = -1, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= v) left = mid;
    else right = mid;
  }
  return right;
}
