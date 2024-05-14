import random

def pickGoodPivot(a: list, s: int, e: int):
  items = []
  for _ in range(5):
    idx = random.randint(s, e)
    items.append((a[idx], idx))
  items.sort(key=lambda x: x[0])
  return items[2][1]

def kth(a: list, k : int):
  k -= 1

  s = 0
  e = len(a) - 1

  while s != e:
    pivotIdx = pickGoodPivot(a, s, e)
    pivot = a[pivotIdx]
    a[s], a[pivotIdx] = a[pivotIdx], a[s]
    l = s + 1
    r = e
    while l <= r:
      if a[l] <= pivot: l += 1
      if a[r] >= pivot: r -= 1
      if l > r: break
      if a[l] > pivot and a[r] < pivot: a[l], a[r] = a[r], a[l]
    center = r
    a[s], a[center] = a[center], a[s]
    if center == k: return a[center]
    if center < k: s = center + 1
    else: e = center - 1

  return a[s]
