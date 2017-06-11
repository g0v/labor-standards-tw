import Penalty from './Penalty'
const lsa = require('../data/lsa.json')

export default class Article {
  lawTitle: string
  lawTitleAbbr: string
  id: string
  paragraph: number
  entity: Object

  constructor (lawTitle?: string, id?: string, paragraph?: number) {
    this.lawTitle = lawTitle
    this.id = id
    this.lawTitleAbbr = lsa['LAWS']['法規']['法規簡稱'] || ''
    this.paragraph = paragraph

    const articles = lsa['LAWS']['法規']['法規內容']['條文']
    this.entity = articles.find(article => article['條號'] === id)
  }

  penalize (): Penalty {
    let article: Article
    if (this.entity['罰則參考'].length === 1) {
      const penaltyId = this.entity['罰則參考'][0].penalty.id
      article = new Article(this.lawTitle, penaltyId)
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
