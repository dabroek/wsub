import request from 'request-promise'
import path from 'path'
import fs from 'fs'
import $ from 'cheerio'
import AdmZip from 'adm-zip'

const DOMAIN = "https://subscene.com"
const SEARCH_URL = DOMAIN + "/subtitles/release?q="

function search(file, lang) {
  return new Promise((resolve, reject) => {
    request({
      uri: SEARCH_URL + encodeURIComponent(file.name),
    }).then(html => {
      let subtitles = []
      $(html).find('tr').each((i, e) => {
        var a = $(e).children('td:nth-child(1)').children('a'),
            o = $(e).children('td:nth-child(4)').children('a')

        if (a.attr('href')) {
          subtitles.push({
            url: DOMAIN + a.attr('href'),
            title: a.children('span:nth-child(2)').text().trim(),
            language: a.children('span:nth-child(1)').text().trim(),
          })
        }
      })

      let subtitle = subtitles.find(sub => sub.language === 'English')
      if (!subtitle) {
        throw new Error('No English subtitle found.')
      }

      return request({
        uri: subtitle.url
      }).then(html => {
        return { 
          subtitles: { url: DOMAIN + $(html).find('#downloadButton').attr('href') },
          source: 'subscene',
        }
      }).catch(reject)
    })
    .then(resolve)
    .catch(reject)
  })
}

function download(subUrl, filePath) {
  return new Promise((resolve, reject) => {
    request({
      uri: subUrl,
      encoding: null,
      transform2xxOnly: true,
      transform: body => new AdmZip(body),
    }).then(zip => {
      zip.getEntries().forEach(entry => {
        if (path.extname(entry.entryName) === '.srt') {
          const fileName = filePath.slice(0, filePath.lastIndexOf('.')) + '.srt'
          fs.writeFile(fileName, zip.readFile(entry), 'utf8', () => resolve('File written successfully.'))  
        }
      })
    }).catch(reject)
  })
}

export default { search, download }