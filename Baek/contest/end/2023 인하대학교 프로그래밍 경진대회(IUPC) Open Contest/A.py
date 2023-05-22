i = str(input())

possible = False

if 'M' in i:
  if 'O' in i:
    if 'B' in i:
      if 'I' in i:
        if 'S' in i:
          possible = True

if possible:
  print('YES')
else:
  print('NO')
