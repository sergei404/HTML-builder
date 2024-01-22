const fs = require('node:fs');
const path = require('path');

const read = (filePath) => {
  const myPath = path.join(process.cwd(), filePath);
  fs.createReadStream(myPath).pipe(process.stdout);
};

read('01-read-file/text.txt');
