let input = `26
add 1
add 2
check 1
check 2
check 3
remove 2
check 1
check 2
toggle 3
check 1
check 2
check 3
check 4
all
check 10
check 20
toggle 10
remove 20
check 10
check 20
empty
check 1
toggle 1
check 1
toggle 1
check 1`.split("\n").map(e => e.split(" "));
input.shift();

let set = new Array(20).fill(0);
const func = {
    add   : (n) => set[n] = 1,
    remove: (n) => set[n] = 0,
    check : (n) => ans += set[n]+"\n",
    toggle: (n) => set[n]^= 1,
    all   : ( ) => set.fill(1),
    empty : ( ) => set.fill(0)
};
let ans = "";

for (let i = 0, l = input.length; i < l; i++) func[input[i][0]](input[i][1]-1);
console.log(ans.trim());