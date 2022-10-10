def P6(n):
    v1 = 0
    v2 = -1
    count = 0

    m = 1 + n
    while v1 > v2:
        v1f = (1 - n)/m * v1 + (2*n)/m * v2
        v2f = 2/m * v1 + (n - 1)/m*v2
        count += 1
        if v1f < 0:
            count += 1
        v1 = -v1f
        v2 = v2f
    
    return count
