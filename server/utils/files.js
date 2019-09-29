const fs = require("fs");

const getAllFiles = async givenPath => {
  return new Promise((resolve, reject) => {
    const folders = fs.readdirSync(givenPath);
    const files = {};
    folders.map(folder => {
      const filesInFolder = fs.readdirSync(`${givenPath}/${folder}`);
      files[folder] = filesInFolder;
    });
    return resolve(files);
  });
};

module.exports = {
  getAllFiles
};
