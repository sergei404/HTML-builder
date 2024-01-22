const fs = require('node:fs/promises');
const path = require('node:path');

async function list() {
  const pathDirectory = path.join(
    process.cwd(),
    '03-files-in-folder/secret-folder',
  );
  try {
    const items = await fs.readdir(pathDirectory, { withFileTypes: true });

    for (const item of items) {
      if (item[Object.getOwnPropertySymbols(item)[0]] === 1) {
        const stats = await fs.stat(path.resolve(pathDirectory, item.name));
        console.log(
          `${item.name.slice(0, item.name.lastIndexOf('.'))} - ${path
            .extname(item.name)
            .slice(1)} - ${stats.size / 1024}kb`,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

list();
