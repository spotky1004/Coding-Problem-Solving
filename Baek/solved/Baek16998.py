# 테스트용
toInput = "3\n2 7 2\n1 4 5\n3 7 10".split("\n")
input = lambda: toInput.pop(0)

import math

output = ""
for i in range(int(input())):
    p,q,n = [*map(int,input().split())]
    loopShift = (p*math.ceil(q/p))%q # mod 한번 돌때마다 얼마만큼 변하는지 계산
    if loopShift+p > q: # 변하는 양이 0보다 작은 경우 예외처리
        loopShift = p-loopShift
    loopPer = q/math.gcd(p, loopShift) # mod가 몇번마다 순환하는지 계산
    loopSum = max(1, loopShift)*(loopPer*(loopPer-1)/2) # mod가 한번 순환할때마다 몇씩 더할지 계산
    loop = math.floor(n/loopPer) # mod 순환 횟수 계산

    lastSum = 0
    for j in range(int(n-loop*loopPer)):  # 위에서 계산하고 남은 부분 더해주기
        lastSum += p*(j+1)%q
    
    output += str(math.floor(loop*loopSum + lastSum)) + "\n"

print(output.rstrip())