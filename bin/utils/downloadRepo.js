const download = require('download-git-repo');

module.exports = function downloadRepo(url, name) {
  return new Promise((resolve, reject) => {
    download(`direct:${url}`, name, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
