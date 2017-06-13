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

const penalties = {
  '75': {
    for: ['5'],
    source: '75',
    penalties: [
      {
        fine: { max: 750000 }
      },
      {
        imprisonment: {
          max: 5,
          unit: 'year'
        }
      },
      {
        fine: { max: 750000 },
        imprisonment: {
          max: 5,
          unit: 'year'
        }
      }
    ]
  },
  '76': {
    for: ['6'],
    source: '76',
    penalties: [
      {
        fine: { max: 450000 }
      },
      {
        imprisonment: {
          max: 3,
          unit: 'year'
        }
      },
      {
        fine: { max: 450000 },
        imprisonment: {
          max: 3,
          unit: 'year'
        }
      }
    ]
  },
  '77': {
    for: ['42', '44#2', '45#1', '47', '48', '49#3', '64#1'],
    source: '77',
    penalties: [
      {
        fine: { max: 300000 }
      },
      {
        imprisonment: {
          max: 6,
          unit: 'month'
        }
      },
      {
        fine: { max: 300000 },
        imprisonment: {
          max: 6,
          unit: 'month'
        }
      }
    ]
  },
  '78#1': {
    for: ['17', '55'],
    source: '78',
    penalties: [{
      fine: {
        min: 300000,
        max: 15000000
      }
    }]
  },
  '78#2': {
    for: ['13', '26', '50', '51', '56#2'],
    source: '78',
    penalties: [{
      fine: {
        min: 90000,
        max: 450000
      }
    }]
  },
  '79#1': {
    for: ['21#1', '22', '23', '24', '25', '30#1', '30#2', '30#3', '30#6',
          '30#7', '32', '34', '35', '36', '37', '38', '39', '40', '41', '49#1',
          '59'],
    source: '79',
    penalties: [{
      fine: {
        min: 20000,
        max: 1500000
      }
    }]
  },
  '79#2': {
    for: ['30#5', '49#5'],
    source: '79',
    penalties: [{
      fine: {
        min: 90000,
        max: 675000
      }
    }]
  },
  '79#3': {
    for: ['7', '9#1', '16', '19', '28#2', '46', '56#1', '65#1', '66', '67',
          '68', '70', '74#2'],
    source: '79',
    penalties: [{
      fine: {
        min: 20000,
        max: 450000
      }
    }]
  }
}

function parseKey(key) {
  let [id, paragraph] = key.split('#')
  if (paragraph) {
    paragraph = parseInt(paragraph) - 1
  }

  return [id, paragraph]
}

function normalizeContent (content, lang) {
  const RE_END_OF_LINE = lang === 'zh' ? /[。：]/ : /[.:]/
  const RE_NUMBER_BULLET = lang === 'zh' ? /^[一二三四五六七八九十]{1,2}、/ : /^[0-9]{1,2}\./
  const COLON = lang === 'zh' ? '：' : ':'

  let parts = []
  let result = []
  let part = ''

  content.split('\n').forEach(str => {
    const last = str.substr(-1)

    part += str.trim()

    if (last.match(RE_END_OF_LINE)) {
      parts.push(part)
      part = ''
    }
  })

  let listMode = false
  let newPart = ''
  parts.forEach(part => {
    const last = part.substr(-1)
    if (last === COLON) {
      listMode = true
      newPart = part
    } else if (listMode && part.match(RE_NUMBER_BULLET)) {
      newPart += `\n${part}`
    } else if (newPart !== '') {
      result.push(newPart)
      newPart = ''
      result.push(part)
      listMode = false
    } else {
      result.push(part)
    }
  })

  if (listMode) {
    result.push(newPart)
  }

  return result
}

fetch(ronnyUrl)
.then(res => res.json())
.then(json => {
  const articlesRonny = json['law_data'].filter(article => article.rule_no)

  if (articlesRonny.length !== articlesZh.length || articlesRonny.length !== articlesEn.length) {
    throw new Error('中英文勞基法版本與 Ronny wang 爬出來的條文數量不同')
  }

  const merged = articlesZh.map((articleZh, i) => {
    const articleEn = articlesEn[i]
    const id = articleZh['條號'].match(/第 ([0-9-]+) 條/)[1]

    return {
      '條號': id,
      '條文內容': {
        zh: normalizeContent(articleZh['條文內容'], 'zh'),
        en: normalizeContent(articleEn['條文內容'], 'en')
      }
    }
  })

  zh['LAWS']['法規']['法規內容']['條文'] = merged
  zh['LAWS']['法規']['法規簡稱'] = '勞基法'
  return zh
})
.then(json => {
  const articlesMap = {}
  json['LAWS']['法規']['法規內容']['條文'].forEach(article => {
    articlesMap[article['條號']] = article
  })

  Object.keys(penalties).forEach(key => {
    const penalty = penalties[key]
    let [id, paragraph] = parseKey(key)

    const forArticles = penalty.for.map(forKey => {
      let [forId, forParagraph] = parseKey(forKey)
      const article = articlesMap[forId]

      article['罰則參考'] = article['罰則參考'] || []

      article['罰則參考'].push({
        paragraph: forParagraph,
        penalty: {id, paragraph}
      })

      return {id: forId, paragraph: forParagraph}
    })

    const penaltyArticle = articlesMap[id]
    penaltyArticle['罰則'] = penaltyArticle['罰則'] || []
    penaltyArticle['罰則'].push({
      for: forArticles,
      paragraph,
      possibilities: penalty.penalties
    })

  })

  return json
})
.then(json => {
  json['LAWS']['法規']['法規內容']['條文'].forEach(article => {
    if (article['罰則參考']) {
      article['罰則參考'].sort((a, b) => a.paragraph - b.paragraph)
    }
  })
  return json
})
.then(json => {
  shell.ShellString(JSON.stringify(zh, null, 2)).to('data/lsa.json')
})
.catch(err => console.error(err))
