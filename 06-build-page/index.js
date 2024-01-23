const { createReadStream, createWriteStream } = require('node:fs');
const {
  readdir,
  readFile,
  unlink,
  appendFile,
  mkdir,
  stat,
  writeFile,
} = require('node:fs/promises');
const path = require('node:path');

const crearDirectori = async (dirPath) => {
  return mkdir(dirPath, { recursive: true });
};

const getTempateHTML = async (pathTemplate) => {
  const files = await readdir(path.resolve(__dirname, 'components'), {
    withFileTypes: true,
  });

  const filesContents = files
    .filter(
      (el) =>
        el[Object.getOwnPropertySymbols(el)[0]] === 1 &&
        path.extname(el.name) === '.html',
    )
    .reduce((acc, it) => {
      acc[it.name.slice(0, it.name.lastIndexOf('.'))] = readFile(
        path.resolve(__dirname, 'components', it.name),
        {
          encoding: 'utf8',
        },
      );
      return acc;
    }, {});

  let contents = await readFile(path.resolve(__dirname, 'template.html'), {
    encoding: 'utf8',
  });

  contents = contents
    .replace(/\{\{header\}\}/, await filesContents['header'])
    .replace(/\{\{articles\}\}/, await filesContents['articles'])
    .replace(/\{\{footer\}\}/, await filesContents['footer']);

  await writeFile(
    path.resolve(__dirname, pathTemplate, 'template.html'),
    contents,
  );
};

const deleteFile = async (path) => {
  try {
    await unlink(path);
    console.log('file deleted');
  } catch (error) {
    console.log('🍕');
  }
};

async function bundleFile(folder, newFolder, newFile) {
  await deleteFile(path.resolve(__dirname, newFolder, newFile));

  try {
    const files = await readdir(path.resolve(__dirname, folder), {
      withFileTypes: true,
    });

    const filesFiltered = files.filter(
      (el) =>
        el[Object.getOwnPropertySymbols(el)[0]] === 1 &&
        path.extname(el.name) === '.css',
    );

    for await (const file of filesFiltered) {
      const contents = await readFile(
        path.resolve(__dirname, folder, file.name),
        {
          encoding: 'utf8',
        },
      );
      await appendFile(path.resolve(__dirname, newFolder, newFile), contents);
    }
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets() {
  try {
    const files = await readdir(path.resolve(__dirname, 'assets'));

    files.forEach(async (el) => {
      const assetsPath = path.resolve(__dirname, 'project-dist', 'assets', el);

      await crearDirectori(assetsPath);

      if ((await stat(assetsPath)).isDirectory()) {
        const assetsFiles = await readdir(
          path.resolve(__dirname, 'assets', el),
        );

        assetsFiles.forEach((it) => {
          createReadStream(path.resolve(__dirname, 'assets', el))
            .setEncoding('utf-8')
            .pipe(createWriteStream(path.resolve(assetsPath, it)));
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function init() {
  let pathFolder = path.resolve(__dirname, 'project-dist');
  crearDirectori(pathFolder);

  try {
    const stats = await stat(pathFolder);
    if (stats.isDirectory()) {
      await getTempateHTML(pathFolder);
      await bundleFile('./styles', pathFolder, 'style.css');
      await copyAssets();
    }
  } catch (err) {
    console.log(err);
  }
}

init();
