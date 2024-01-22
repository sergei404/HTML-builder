const fs = require('node:fs');
const path = require('node:path');

function copyFile(oldFolder, newFolder) {
  fs.readdir(oldFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    for (const file of files.filter(
      (el) => el[Object.getOwnPropertySymbols(el)[0]] === 1,
    )) {
      fs.copyFile(
        path.join(oldFolder, file.name),
        path.join(newFolder, file.name),
        (err) => {
          if (err) throw err;
          console.log('Файл успешно перемещён');
        },
      );
    }
  });
}

const copy = (oldFolder, newFolder) => {
  const oldPath = path.join(process.cwd(), oldFolder);
  const newPath = path.join(process.cwd(), newFolder);
  fs.stat(newPath, (err) => {
    if (!err) {
      fs.readdir(newPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(newPath, file), (err) => {
            if (err) throw Error('FS operation failed');
            console.log('Файл успешно удален');
          });
        }
        copyFile(oldPath, newPath);
      });
    } else {
      fs.mkdir(newPath, { recursive: true }, () => {
        copyFile(oldPath, newPath);
      });
    }
  });
};

copy('04-copy-directory/files', '04-copy-directory/files-copy');
