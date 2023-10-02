import sys
import fractions

sq1 = [list(map(int, sys.stdin.readline().split())) for _ in range(4)]
sq2 = [list(map(int, sys.stdin.readline().split())) for _ in range(4)]

c1x = sq1[0][0] + sq1[1][0] + sq1[2][0] + sq1[3][0]
c1y = sq1[0][1] + sq1[1][1] + sq1[2][1] + sq1[3][1]
c2x = sq2[0][0] + sq2[1][0] + sq2[2][0] + sq2[3][0]
c2y = sq2[0][1] + sq2[1][1] + sq2[2][1] + sq2[3][1]

md = (c2y - c1y)
mn = (c2x - c1x)

yd = mn * c1y - md * c1x
yn = mn * 4

print(fractions.Fraction(numerator=md, denominator=mn), fractions.Fraction(numerator=yd, denominator=yn))
