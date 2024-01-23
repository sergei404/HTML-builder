// // const { readdir, unlink, appendFile, readFile } = require('node:fs/promises');
// // const path = require('node:path');

// // async function bundleFile(folder, newFolder, file) {
// //   const oldFolder = path.join(process.cwd(), folder);
// //   const folderNew = path.join(process.cwd(), newFolder);
// //   const file = path.join(newFolder, file);
// //   await unlink(file);

// //   try {
// //     const files = await readdir(oldFolder, {
// //       withFileTypes: true,
// //     });

// //     const filesFiltered = files.filter(
// //       (el) =>
// //         el[Object.getOwnPropertySymbols(el)[0]] === 1 &&
// //         path.extname(el.name) === '.css',
// //     );

// //     for await (const file of filesFiltered) {
// //       const contents = readFile(path.join(oldFolder, file.name), {
// //         encoding: 'utf8',
// //       });
// //       appendFile(path.join(newFolder, fileile), contents);
// //     }
// //   } catch (err) {
// //     console.error(err);
// //   }
// // }

// // bundleFile(
// //   '/05-merge-styles/styles',
// //   '/05-merge-styles/project-dist',
// //   '/05-merge-styles/bundle.css',
// // );

// const {
//   readdir,
//   unlink,
//   appendFile,
//   readFile,
//   stat,
// } = require('node:fs/promises');
// const path = require('node:path');

// async function bundleFile(folder, newFolder, newFile) {
//   // const file = await unlink(path.join(process.cwd(), newFolder, newFile));
//   // if (!file) {
//   //   console.log(123);
//   // }
//   try {
//     const stats = await stat(path.join(process.cwd(), newFolder, newFile));
//     console.log(stats);
//     if (stats) {
//       await unlink(path.join(process.cwd(), newFolder, newFile));
//     }
//     const files = await readdir(path.join(process.cwd(), folder), {
//       withFileTypes: true,
//     });

//     for await (const file of files) {
//       if (
//         file[Object.getOwnPropertySymbols(file)[0]] === 1 &&
//         path.extname(file.name) === '.css'
//       ) {
//         const contents = readFile(path.join(process.cwd(), folder, file.name), {
//           encoding: 'utf8',
//         });
//         await unlink(path.join(process.cwd(), newFolder, newFile));
//         appendFile(path.join(process.cwd(), newFolder, newFile), contents);
//       }
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// bundleFile('/styles', '/project-dist', 'bundle.css');
const { readdir, unlink, appendFile, readFile } = require('node:fs/promises');
const path = require('node:path');

const deleteFile = async (path) => {
  try {
    await unlink(path);
    console.log('file deleted');
  } catch (error) {
    console.log('file not found');
  }
};

const myAppendFile = async (path, data) => {
  try {
    await appendFile(path, data);
  } catch (error) {
    console.error(error);
  }
};

async function bundleFile(folder, newFolder, newFile) {
  const file = path.join(process.cwd(), newFolder, newFile);
  const oldFolder = path.join(process.cwd(), folder);

  deleteFile(file);

  try {
    const items = await readdir(oldFolder, {
      withFileTypes: true,
    });

    const filesFiltered = items.filter(
      (el) =>
        el[Object.getOwnPropertySymbols(el)[0]] === 1 &&
        path.extname(el.name) === '.css',
    );

    for await (const item of filesFiltered) {
      const contents = await readFile(path.join(oldFolder, item.name), {
        encoding: 'utf8',
      });
      myAppendFile(file, contents);
    }
  } catch (err) {
    console.error(err);
  }
}

bundleFile(
  '05-merge-styles/styles',
  '05-merge-styles/project-dist',
  'bundle.css',
);
