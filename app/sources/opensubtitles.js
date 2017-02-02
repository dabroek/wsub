import request from 'request-promise';
import fs from 'fs';
import OS from 'opensubtitles-api';
import config from '../config';

const OpenSubtitles = new OS(config.sources.opensubtitles.useragent);

function search(file, lang) {
  return new Promise((resolve, reject) => {
    OpenSubtitles.search({
      filename: file.name,
      filesize: file.size,
    })
    .then((subtitles) => {
      if (!subtitles.length) reject('Empty result');
      return subtitles;
    })
    .then(subtitles => ({
      subtitles,
      source: 'opensubtitles',
    }))
    .then(resolve)
    .catch(reject);
  });
}

function download(subUrl, filePath) {
  return new Promise((resolve, reject) => {
    request({
      uri: subUrl,
      encoding: null,
      followRedirect: false,
    }).then((buffer) => {
      const fileName = `${filePath.slice(0, filePath.lastIndexOf('.'))}.srt`;
      fs.writeFile(fileName, buffer, 'utf8', () => resolve('File written successfully.'));
    }).catch(reject);
  });
}

export default { search, download };
