const fs = require('node:fs/promises');
const path = require('node:path');

async function copyFile(oldPath, newPath) {
  try {
    const files = await fs.readdir(oldPath, { withFileTypes: true });
    for (const file of files) {
      if (file[Object.getOwnPropertySymbols(file)[0]] === 1) {
        await fs.copyFile(
          path.join(oldPath, file.name),
          path.join(newPath, file.name),
        );
        console.log('Файл успешно перемещён');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const copy = async (oldFolder, newFolder) => {
  const oldPath = path.join(process.cwd(), oldFolder);
  const newPath = path.join(process.cwd(), newFolder);

  try {
    await fs.mkdir(newPath, { recursive: true });
    const stats = await fs.stat(newPath);

    if (stats) {
      const files = await fs.readdir(newPath);
      for (const file of files) {
        await fs.unlink(path.join(newPath, file));
        console.log('Файл успешно удален');
      }
      copyFile(oldPath, newPath);
    } else {
      copyFile(oldPath, newPath);
    }
  } catch (error) {
    console.log(error);
  }
};

copy('04-copy-directory/files', '04-copy-directory/files-copy');
