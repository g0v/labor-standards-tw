import Penalty from './Penalty'
// 勞動基準法
const lsa = require('../data/lsa.json')
// 	勞工退休金條例
const lpa = require('../data/labor-pension-act.json')

/**
 * 法條
 *
 * @export
 * @class Article
 */
export default class Article {
  /**
   * 法條所屬於的法律，比如說「勞動基準法」
   *
   * @type {string}
   * @memberof Article
   */
  lawTitle: string

  /**
   * 法條所屬於的法律簡寫，比如說「勞基法」或「勞退條例」
   *
   * @type {string}
   * @memberof Article
   */
  lawTitleAbbr: string

  /**
   * 條號，如勞動基準法第 42 條，條號為字串的 "42"
   *
   * @type {string}
   * @memberof Article
   */
  id: string

  /**
   * 第幾項，比如說勞動基準法第 9 條第 1 項，其 paragraph 則為 0
   *
   * @type {number}
   * @memberof Article
   */
  paragraph: number

  /**
   * 法條內文，陣列裡面的每個字串代表法條中的一「項」
   *
   * @type {string[]}
   * @memberof Article
   */
  body: string[]

  /**
   * 法條的原始資料，內部使用
   *
   * @type {Object}
   * @memberof Article
   */
  entity: Object

  /**
   * 法條的網址
   *
   * @type {string}
   * @memberof Article
   */
  url: string

  /**
   * 建立一個法條
   * @param {string} [lawTitle] 法律的名稱，如「勞動基準法」，也可以是「函釋」
   * @param {string} [id] 法條的條號
   * @param {number} [paragraph] 具體要引用法條的「項」，選填
   * @memberof Article
   */
  constructor (lawTitle: string = '', id: string = '', paragraph: number = -1) {
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

  /**
   * 設定法條的網址
   *
   * @param {string} url 網址
   * @returns {Article} 回傳同一個法條用於 method chaining
   * @memberof Article
   */
  setUrl (url: string): Article {
    this.url = url
    return this
  }

  /**
   * 設定法條的內容
   *
   * @param {string[]} body 法條的內容，陣列裡的每一個字串應為「項」或者是函釋內的一個段落
   * @returns {Article} 回傳同一個法條用於 method chaining
   * @memberof Article
   */
  setBody (body: string[]): Article {
    this.body = body
    return this
  }

  /**
   * 取得條文內容
   *
   * @returns {string[]} 條文內容
   * @memberof Article
   */
  getBody (): string[] {
    if (this.entity) {
      return this.entity['條文內容'].zh
    } else {
      return this.body
    }
  }

  /**
   * 取得違反本法條的罰則
   *
   * @returns {Penalty} 罰則
   * @memberof Article
   */
  penalize (): Penalty {
    let article: Article = new Article()
    if (this.entity['罰則參考'].length === 1) {
      const { id, paragraph } = this.entity['罰則參考'][0].penalty
      article = new Article(this.lawTitle, id, paragraph)
    } else if (this.paragraph !== -1) {
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
