import math

to3 = [3, 12, 21, 33]
digit2 = [[11, 23, 32], [13, 22, 31], [12, 21, 33]]
n = int(input())-1

level = 0
while n >= 0:
    n -= 3**level
    level += 1
n += 3**(level-1)
level -= 2
startLv = level

answer = ""
prev = None
if level < 2:
    answer = str(to3[n])
else:
    while True:
        if level == 0:
            answer += str(digit2[(prev+3*100-startLv-1)%3][n%3])
            break
        else:
            toAdd = math.floor( n/3**level )
            prev = toAdd
            answer += str(toAdd+1)
            n -= toAdd*3**level
        level -= 1

print(answer)