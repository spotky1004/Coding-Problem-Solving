toInput = "5\nABC\nAAC\nZZZZZZZ\nSPOTKY\nSPOTPY".split("\n")
input = lambda: toInput.pop(0)

for i in range(int(input())):
    chars = [0]*26
    word = list(input())
    for j in range(len(word)):
        chars[ord(word[j])-65] += 1
    chance = 1
    for j in range(len(word)):
        charOrd = ord(word[j])-65
        chance *= chars[charOrd]/(len(word)-j)
        chars[charOrd] -= 1
    print(chance)