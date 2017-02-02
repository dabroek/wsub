import request from 'request-promise';
import fs from 'fs';

const URL = 'http://www.addic7ed.com';

function search(file, lang) {
  return new Promise((resolve, reject) => {
    // search addic7ed
    request({
      uri: `${URL}/search.php?search=${encodeURIComponent(file.name)}`,
    }).then((html) => {
      const regexp = new RegExp(/(?:href="(\/(?:original).+)")/g);
      const subtitles = [];
      let match;

      while ((match = regexp.exec(html)) !== null) {
        subtitles.push({ url: `${URL}${match[1]}` });
      }

      if (!subtitles.length) {
        throw new Error('No subtitles found.');
      }

      return {
        subtitles,
        source: 'addic7ed',
      };
    })
    .then(resolve)
    .catch(reject);
  });
}

function download(subUrl, filePath) {
  return new Promise((resolve, reject) => {
    request({
      uri: subUrl,
      headers: { Referer: `${URL}/show/1` },
      encoding: null,
      followRedirect: false,
    }).then((buffer) => {
      const fileName = `${filePath.slice(0, filePath.lastIndexOf('.'))}.srt`;
      fs.writeFile(fileName, buffer, 'utf8', () => resolve('File written successfully.'));
    }).catch(reject);
  });
}

export default { search, download };
