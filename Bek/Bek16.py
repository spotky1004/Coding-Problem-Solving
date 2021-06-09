toInput = "6\nAAAAABBBBB\nBBACACCCCA\nCA2313CCC2\n222333444CA\nBBBBBB\n1122".split()
input = lambda: toInput.pop(0)

length = int(input())
loopRange = range(length)

letters = []
for i in loopRange:
    tmp = input()
    letters.append([tmp[0], tmp[-1]])

searchingIdx = [-1]*length
binarySearchConnacted = [None]*length
networkFlow = [None]*length
for i in loopRange:
    networkFlow[i] = []
    for j in loopRange:
        if letters[i][1] == letters[j][0] and i != j:
            networkFlow[i].append(j)

def startSearch(idx):
    searchingIdx[idx] = (searchingIdx[idx]+1)//len(networkFlow[idx])

print(networkFlow)