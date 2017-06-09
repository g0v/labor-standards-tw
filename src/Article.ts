const lsa = require('../data/lsa.json')

export default class Article {
  lawTitle: string
  lawTitleAbbr: string
  id: string

  constructor (lawTitle?: string, id?: string) {
    this.lawTitle = lawTitle
    this.id = id
    this.lawTitleAbbr = lsa['LAWS']['法規']['法規簡稱'] || ''
  }
}
