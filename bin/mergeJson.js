/* global fetch */

const shell = require('shelljs')
const parser = require('xml2json')
require('isomorphic-fetch')

const ronnyUrl = 'https://raw.githubusercontent.com/ronnywang/tw-law-corpus/json/%E5%8B%9E%E5%8B%95%E4%BA%BA%E5%8A%9B/%E5%8B%9E%E5%8B%95%E5%9F%BA%E6%BA%96/%E5%8B%9E%E5%8B%95%E5%9F%BA%E6%BA%96%E6%B3%95.json'

const zh = JSON.parse(parser.toJson(shell.cat('./data/lsa-zh.xml').toString()))
const en = JSON.parse(parser.toJson(shell.cat('./data/lsa-en.xml').toString()))

const articlesZh = zh['LAWS']['法規']['法規內容']['條文']
const articlesEn = en['LAWS']['法規']['法規內容']['條文']

const zhnumMap = {
  '一': '1',
  '二': '2',
  '三': '3',
  '四': '4',
  '五': '5',
  '六': '6',
  '七': '7',
  '八': '8',
  '九': '9',
  '十': '0'
}

function zh2num (zh) {
  let zhnum = zh.match(/第(.+)條/)[1]
  let num = 0
  const last = zhnum.substr(-1)

  if (zhnumMap[last] !== 0) {
    zhnum = zhnum.replace(/十/g, '')
  }

  num = zhnum.split('').map(c => zhnumMap[c]).join('')
  return num
}

function normalize (articles) {
  if (!articles) return []
  return articles.map(article => {
    article.numbers = article.numbers.map(num => zh2num(num))
    return article
  })
}

fetch(ronnyUrl)
.then(res => res.json())
.then(json => {
  const articlesRonny = json['law_data'].filter(article => article.rule_no)

  if (articlesRonny.length !== articlesZh.length || articlesRonny.length !== articlesEn.length) {
    throw new Error('中英文勞基法版本與 Ronny wang 爬出來的條文數量不同')
  }

  const merged = articlesZh.map((articleZh, i) => {
    const articleRonny = articlesRonny[i]
    const articleEn = articlesEn[i]

    return {
      '條號': articleZh['條號'].match(/第 ([0-9-]+) 條/)[1],
      '條文內容': {
        zh: articleZh['條文內容'],
        en: articleEn['條文內容']
      },
      '相關條文': {
        '引用條文': normalize(articleRonny.relates['引用條文']),
        '被引用條文': normalize(articleRonny.relates['被引用條文'])
      }
    }
  })

  zh['LAWS']['法規']['法規內容']['條文'] = merged
  zh['LAWS']['法規']['法規簡稱'] = '勞基法'
  shell.ShellString(JSON.stringify(zh, null, 2)).to('data/lsa.json')
})
