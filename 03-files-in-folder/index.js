const fs = require('node:fs');
const path = require('node:path');

function list() {
  const pathDirectory = path.join(
    process.cwd(),
    '03-files-in-folder/secret-folder',
  );
  fs.readdir(pathDirectory, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.log(err.message);
    }

    items
      .filter((el) => el[Object.getOwnPropertySymbols(el)[0]] === 1)
      .forEach((el) => {
        fs.stat(path.resolve(pathDirectory, el.name), (_err, stats) =>
          console.log(
            `${el.name.slice(0, el.name.lastIndexOf('.'))} - ${path
              .extname(el.name)
              .slice(1)} - ${stats.size / 1024}kb`,
          ),
        );
      });
  });
}

list();
