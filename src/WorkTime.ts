import {Duration, Labor, Result, ChildLaborType, Article, Day} from './'

interface Time {
  date: Date
  hours: number
  dayType?: Day
}

export default class WorkTime {
  duration: Duration
  labor: Labor
  times: Time[]

  constructor (duration: Duration, labor: Labor) {
    this.duration = duration
    this.labor = labor
    this.times = []
  }
  validate (): Result {
    const result = new Result()
    const type = this.labor.validateChildLabor().value.type
    result.value.legal = true

    const isChildLabor = type === ChildLaborType.CHILD_LABOR ||
                         type === ChildLaborType.FOLLOW_CHILD_LABOR_ARTICLES

    if (isChildLabor && this.times.some(t => t.dayType === Day.REGULAR_LEAVE)) {
      result.value.legal = false
      result.violations.push(new Article('勞動基準法', '47'))
    }

    const lateThen20 = this.times.some(t => {
      const date = new Date(t.date.getTime())
      const start = date.getHours()
      const d = date.setHours(start + t.hours)
      const end = date.getHours()

      return end > 20
    })

    if (isChildLabor && lateThen20) {
      result.value.legal = false
      result.violations.push(new Article('勞動基準法', '48'))
    }

    if (this.duration === Duration.DAY) {
      if (this.times.length !== 1) {
        throw new Error(`單日工時驗證僅支援加入一個時間區段，` +
                        `目前有 ${this.times.length} 個區段`)
      }

      if (isChildLabor) {
        if (this.times[0].hours > 8) {
          result.value.legal = false
          result.violations.push(new Article('勞動基準法', '47'))
        }
      }
    } else if (this.duration === Duration.WEEK) {
      if (this.times.length > 7) {
        throw new Error(`單周工時驗證僅支援小於 7 個時間區段，` +
                        `目前有 ${this.times.length} 個區段`)
      }

      if (isChildLabor) {
        const total = this.times.map(t => t.hours).reduce((a, b) => a + b)
        if (total > 40) {
          result.value.legal = false
          result.violations.push(new Article('勞動基準法', '47'))
        }
      }
    }

    return result
  }
  add (date: Date, hours: number, dayType: Day = Day.REGULAR_DAY) {
    this.times.push({date, hours, dayType})
  }
  overtimePay (accident?: boolean, aggreed?: boolean) {
    // TBD
  }
}
