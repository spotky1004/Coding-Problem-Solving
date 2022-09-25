// (require("fs").readFileSync("/dev/stdin")+"")
i=`&at;
&bmp;
&l&lt;t;
&aaa;
&xax;
</>
<></>
<><<br/>/>
<b><<br/>/b>
<br<br/>/>
<>
`.trim().split("\n")
s="(&lt;|&gt;|&amp;|[\\x20-\\x25\\x27-\\x3B\\x3D\\x3F-\\xFF])*"
r=["(?<!<([a-z0-9]+))<([a-z0-9]+)\\/>(?!\\/[a-z0-9]>)",`<([a-z0-9]+)>${s}<\\/\\1>`,s].map(v=>RegExp(v))
i.map(v=>{p="";while(p!==v){p=v;v=v.replace(/&x([0-9a-fA-F]+)/g,(_,m)=>m.length%2?"&x"+m:"")}p="";while(p!==v){p=v;v=v.replace(r[0],"")}p="";while(p!==v){p=v;v=v.replace(r[1],"")}p="";while(p!==v){p=v;v=v.replace(r[2],"")}console.log(v===""?"valid":"invalid")})