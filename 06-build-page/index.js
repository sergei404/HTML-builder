const { createReadStream, createWriteStream } = require('node:fs');
const {
  readdir,
  unlink,
  appendFile,
  readFile,
  mkdir,
  stat,
  writeFile,
} = require('node:fs/promises');
const path = require('node:path');

const crearDirectori = async (dirPath) => {
  return await mkdir(dirPath, { recursive: true });
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

  // Object.keys(filesContents.slice()).forEach(el => contents = contents
  //   .replace(/\{\{`${el}`\}\}/, filesContents[el]))

  contents = contents
    .replace(/\{\{header\}\}/, await filesContents['header'])
    .replace(/\{\{articles\}\}/, await filesContents['articles'])
    .replace(/\{\{footer\}\}/, await filesContents['footer']);

  await writeFile(
    path.resolve(__dirname, pathTemplate, 'template.html'),
    contents,
  );
};

async function bundleFile(folder, newFolder, newFile) {
  await unlink(path.resolve(__dirname, newFolder, newFile));
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
  const files = await readdir(path.resolve(__dirname, 'assets'));

  files.forEach(async (el) => {
    const assetsPath = path.resolve(__dirname, 'project-dist', 'assets', el);

    await crearDirectori(assetsPath);

    if ((await stat(assetsPath)).isDirectory()) {
      const assetsFiles = await readdir(path.resolve(__dirname, 'assets', el));

      assetsFiles.forEach((it) => {
        createReadStream(path.resolve(__dirname, 'assets', el))
          .setEncoding('utf-8')
          .pipe(createWriteStream(path.resolve(assetsPath, it)));
      });
    }
  });
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
