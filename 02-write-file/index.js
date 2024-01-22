const readline = require('node:readline');
const fs = require('node:fs');
const path = require('path');

const rl = readline.createInterface(process.stdin, process.stdout);

console.log('Welcome!');

function question(filePath) {
  const mypath = path.join(process.cwd(), filePath);
  rl.question('Enter text: ', (text) => {
    if (text === 'exit') {
      console.log('Exit goodbye!');
      process.exit();
    }
    fs.appendFile(mypath, text, 'utf-8', (err) => {
      if (err) {
        console.log(err.message);
      }
    });
    question(mypath);
  });
}

question('02-write-file/text.txt');

process.stdin.on('keypress', (_, key) => {
  if (key && key.name === 'c' && key.ctrl) {
    console.log('\nKeypress, goodbye!');
    process.exit();
  }
});
