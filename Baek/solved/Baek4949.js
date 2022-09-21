let input = `So when I die (the [first] I will see in (heaven) is a score list).
[ first in ] ( first out ).
Half Moon tonight (At least it is better than no Moon at all].
A rope may form )( a trail in a maze.
Help( I[m being held prisoner in a fortune cookie factory)].
([ (([( [ ] ) ( ) (( ))] )) ]).
 .
.`.trim().split("\n");
let bCheck = new RegExp("[([{][^()[\\]{}]*[)\\]}]", "g");

l1: for (let i = 0, l = input.length; i < l; i++) {
    let tmp = input[i];
    if (tmp == ".") break;
    let match = tmp.match(bCheck);
    while (match != null) {
        for (const m of match) {
            if (
                m[0] != m[m.length-1]
                .replace(/\)/, "(")
                .replace(/\}/, "{")
                .replace(/\]/, "[")
            ) {
                console.log("no");
                continue l1;
            }
        }
        tmp = tmp.replace(bCheck, "");
        match = tmp.match(bCheck);
    }
    if (tmp.length != tmp.replace(/[()[\]{}]/, "").length) console.log("no");
    else console.log("yes");
}