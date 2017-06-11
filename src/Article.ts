import Penalty from './Penalty'
const lsa = require('../data/lsa.json')

export default class Article {
  lawTitle: string
  lawTitleAbbr: string
  id: string
  entity: Object

  constructor (lawTitle?: string, id?: string) {
    this.lawTitle = lawTitle
    this.id = id
    this.lawTitleAbbr = lsa['LAWS']['法規']['法規簡稱'] || ''

    const articles = lsa['LAWS']['法規']['條文']
    this.entity = articles.find(article => article['條號'] === id)
  }

  penalize (): Penalty {
    return new Penalty()
  }
}
