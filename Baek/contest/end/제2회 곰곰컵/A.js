process.stdin.on('data',i=>console.log((i+"").match(/-\d+/g).filter(v=>v>-91).length))