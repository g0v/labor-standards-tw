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
  according: Article[]
}
