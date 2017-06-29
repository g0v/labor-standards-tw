import Article from './Article'

/**
 * 可能的罰則，其中包含罰款 (fine) 與徒刑 (imprisonment)
 *
 * @interface Possibility
 */
interface Possibility {
  fine: {
    min: number,
    max: number
  }
  imprisonment: {
    max: number,
    min: number,
    unit: string
  }
}

/**
 * 罰則類別，其中包含了違反的哪一條法條 (article) 以及可能的罰則 (possibility)
 *
 * @export
 * @class Penalty
 */
export default class Penalty {
  /**
   * 可能的罰則
   * @type {Possibility[]}
   * @memberof Penalty
   */
  possibilities: Possibility[]

  /**
   * 違反的法條
   * @type {Article}
   * @memberof Penalty
   */
  article: Article

  /**
   * 建構一個 Penalty 物件，必須提供違反了哪一個法條
   * @param {Article} article 違反的法條
   * @memberof Penalty
   */
  constructor (article: Article) {
    this.article = article
    const penalties = this.article.entity['罰則']

    if (penalties.length === 1) {
      this.possibilities = penalties[0].possibilities
    } else if (this.article.paragraph === undefined) {
      throw new Error('本條文有多於一項，但是罰則是第幾項沒寫清楚')
    } else {
      this.possibilities =
        penalties.find(p => p.paragraph === this.article.paragraph).possibilities

      if (!this.possibilities) {
        throw new Error(`沒有在該條文中找到第 ${this.article.paragraph + 1} 款`)
      }
    }
  }
}
