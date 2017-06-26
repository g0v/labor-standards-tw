import Penalty from './Penalty'
// 勞動基準法
const lsa = require('../data/lsa.json')
// 	勞工退休金條例
const lpa = require('../data/labor-pension-act.json')

export default class Article {
  lawTitle: string
  lawTitleAbbr: string
  id: string
  paragraph: number
  body: string[]
  entity: Object
  url: string

  constructor (lawTitle?: string, id?: string, paragraph?: number) {
    this.lawTitle = lawTitle
    this.id = id
    this.paragraph = paragraph

    if (lawTitle === '勞動基準法') {
      this.lawTitleAbbr = lsa['LAWS']['法規']['法規簡稱'] || ''
      const articles = lsa['LAWS']['法規']['法規內容']['條文']
      this.entity = articles.find(article => article['條號'] === id)
    } else if (lawTitle === '勞工退休金條例') {
      this.lawTitleAbbr = lpa['LAWS']['法規']['法規簡稱'] || ''
      const articles = lpa['LAWS']['法規']['法規內容']['條文']
      this.entity = articles.find(article => article['條號'] === id)
    }
  }

  setUrl (url: string): Article {
    this.url = url
    return this
  }

  setBody (body: string[]): Article {
    this.body = body
    return this
  }

  getBody (): string[] {
    if (this.entity) {
      return this.entity['條文內容'].zh
    } else {
      return this.body
    }
  }

  penalize (): Penalty {
    let article: Article
    if (this.entity['罰則參考'].length === 1) {
      const { id, paragraph } = this.entity['罰則參考'][0].penalty
      article = new Article(this.lawTitle, id, paragraph)
    } else if (this.paragraph !== undefined) {
      const ref = this.entity['罰則參考']
                      .find(ref => ref.paragraph === this.paragraph)

      if (!ref) {
        throw new Error(`找不到第 ${this.id} 條第 ${this.paragraph} 款`)
      }

      article = new Article(this.lawTitle, ref.penalty.id, ref.paragraph)
    }

    return new Penalty(article)
  }
}
