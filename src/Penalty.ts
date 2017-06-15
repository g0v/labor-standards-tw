import Article from './Article'

interface Posibility {
  fine: {
    min: number,
    max: number
  }
  imprisonment: {
    max: number,
    min: number
  }
}

export default class Penalty {
  possibilities: Posibility[]
  article: Article

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
