const fs = require('fs');
const content = fs.readFileSync('server/server_output.log', 'utf-16le');
console.log(content);
