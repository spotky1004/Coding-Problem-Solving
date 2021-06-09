v="aeiou"
r=""
s=list("bnvjhgavnfmnvfabbacfgrr")
for i in range(len(s)):
 
 if s[i] in v:
  s[i]=" "
print(max("".join(s).split(),key=len))