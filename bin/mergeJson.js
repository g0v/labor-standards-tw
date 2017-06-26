/* global fetch */

const shell = require('shelljs')
const parser = require('xml2json')
require('isomorphic-fetch')

function parseKey(key) {
  let [id, paragraph] = key.split('#')
  if (paragraph) {
    paragraph = parseInt(paragraph) - 1
  }

  return [id, paragraph]
}

function normalizeContent(content, lang) {
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

function merge(articlesZh, articlesEn) {
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
  return merged
}

function handlePenalties(json, penalties) {
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
        penalty: { id, paragraph }
      })

      return { id: forId, paragraph: forParagraph }
    })

    const penaltyArticle = articlesMap[id]
    penaltyArticle['罰則'] = penaltyArticle['罰則'] || []
    penaltyArticle['罰則'].push({
      for: forArticles,
      paragraph,
      possibilities: penalty.penalties
    })
  })

  json['LAWS']['法規']['法規內容']['條文'].forEach(article => {
    if (article['罰則參考']) {
      article['罰則參考'].sort((a, b) => a.paragraph - b.paragraph)
    }
  })

  return json
}

const acts = [
  { filename: 'lsa', abbr: '勞基法' }, 
  { filename: 'labor-pension-act', abbr: '勞退條例'}
]

acts.forEach(act => {
  const zh = JSON.parse(parser.toJson(shell.cat(`./data/${act.filename}-zh.xml`).toString()))
  const en = JSON.parse(parser.toJson(shell.cat(`./data/${act.filename}-en.xml`).toString()))

  const articlesZh = zh['LAWS']['法規']['法規內容']['條文']
  const articlesEn = en['LAWS']['法規']['法規內容']['條文']
  const penalties = JSON.parse(shell.cat(`./data/${act.filename}-penalties.json`))

  const merged = merge(articlesZh, articlesEn)

  zh['LAWS']['法規']['法規內容']['條文'] = merged
  zh['LAWS']['法規']['法規簡稱'] = act.abbr
  let json = handlePenalties(zh, penalties)
  shell.ShellString(JSON.stringify(zh, null, 2)).to(`data//${act.filename}.json`)
})

