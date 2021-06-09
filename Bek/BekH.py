toInput = "8\nabd aed aes aex hes aex hex abb\nabc hzx".split("\n")
input = lambda: toInput.pop(0)


import math

words = int(input())
wordList = map(list, input().split())
start,end = map(list, input().split())

wordLength = min(len(start), len(end))
wordList = [*filter(lambda x: len(x) == wordLength, wordList)]
wordList.insert(0, start)
wordList.append(end)
words = len(wordList)

tree = [[] for _ in range(words)]

for i in range(words):
    for j in range(words):
        sameChar = 0
        for k in range(wordLength):
            if wordList[i][k] == wordList[j][k]:
                sameChar += 1
        if sameChar == wordLength-1:
            tree[i].append(j)


nodeToGo = len(tree)-1
minimum = math.inf
def search(node, searched):
    if node == nodeToGo:
        global minimum
        if len(searched) < minimum:
            # print([*map(lambda x: "".join(wordList[x]),searched)])
            minimum = len(searched)
        return
    for i in range(len(tree[node])):
        if not(tree[node][i] in searched):
            tmpSearched = searched[:]
            tmpSearched.append(tree[node][i])
            search(tree[node][i], tmpSearched)

search(0, [])

if len(start) == len(end) and not(minimum == math.inf):
    print(minimum)
else:
    print(-1)