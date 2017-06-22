import {Duration, Labor, Result, ChildLaborType, Article, Day, Org, Gender} from './'

interface Time {
  date: Date
  hours: number
  dayType?: Day
}

export default class WorkTime {
  duration: Duration
  labor: Labor
  times: Time[]
  _approvedByOrg: boolean
  _signed841: boolean
  _providedProperFacilities: boolean

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

    const between22and6 = this.times.some(t => {
      const date = new Date(t.date.getTime())
      const start = date.getHours()
      const d = date.setHours(start + t.hours)
      const end = date.getHours()

      return start <= 6 || end <= 6 || start >= 22 || end >= 22
    })

    if (this.labor.getGender() === Gender.FEMALE) {
      if (between22and6) {
        if (this._approvedByOrg && this._providedProperFacilities) {
          result.value.legal = true
          result.according.push(new Article('勞動基準法', '49'))
        } else if (this._signed841) {
          result.value.legal = true
          result.according.push(new Article('勞動基準法', '84-1'))
        } else {
          result.value.legal = false
          result.violations.push(new Article('勞動基準法', '49', 0))
        }
      }
    }

    if (isChildLabor && lateThen20) {
      result.value.legal = false
      result.violations.push(new Article('勞動基準法', '48'))
    }

    if (this.duration === Duration.DAY) {
      if (this.times.length !== 1) {
        throw new Error(`單日工時驗證僅支援加入一個時間區段，` +
                        `目前有 ${this.times.length} 個區段`)
      }

      const time = this.times[0]

      result.value.regularHours = Math.min(time.hours, 8)
      result.value.overtimeHours = time.hours - result.value.regularHours
      result.according.push(new Article('勞動基準法', '30', 0))
      result.according.push(new Article('勞動基準法', '32', 1))

      if (time.hours > 12) {
        result.value.legal = false
        result.violations.push(new Article('勞動基準法', '32', 1))
      }

      if (isChildLabor) {
        if (time.hours > 8) {
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
    } else if (this.duration === Duration.MONTH) {
      result.according.push(new Article('勞動基準法', '32', 1))

      let monthlyOvertimeHours = 0
      let monthlyRegularHours = 0
      this.times.forEach(time => {
        let regularHours = Math.min(time.hours, 8)
        monthlyOvertimeHours += (time.hours - regularHours)
        monthlyRegularHours += regularHours
      })

      result.value.overtimeHours = monthlyOvertimeHours
      result.value.regularHours = monthlyRegularHours

      if (monthlyOvertimeHours > 46) {
        result.value.legal = false
        result.violations.push(new Article('勞動基準法', '32', 1))
      }
    }

    return result
  }
  add (date: Date, hours: number, dayType: Day = Day.REGULAR_DAY) {
    this.times.push({date, hours, dayType})
  }

  overtimePay (accident: boolean = false, agreed: boolean = true): Result {
    const result = new Result()
    const wage = this.labor.getHourlyWage()

    const explanation102498 = new Article('函釋', '台八十三勞動一字第 102498 號函')
    explanation102498.setUrl('https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=102498&cnt=1&now=1&lnabndn=1&recordno=1')
    explanation102498.setBody(['勞動基準法第三十九條及第四十條規定，勞工於假日' +
      '工作時，工資應加倍發給。所稱「加倍發給」，係指當日工資照給外，' +
      '再加發一日工資。此乃因勞工於假日工作，即使未滿八小時，' +
      '亦已無法充分運用假日之故，與同法第三十二條延長每日工資應依第二十四條' +
      '按平日每小時工資額加或加倍發給工資之規定不同。'])

    result.value.legal = true
    result.according.push(new Article('勞動基準法', '24', 0))

    if (this.duration === Duration.DAY) {
      if (this.times.length !== 1) {
        throw new Error(`單日計算加班費僅支援加入一個時間區段，` +
          `目前有 ${this.times.length} 個區段`)
      }

      const time = this.times[0]
      const overtimeHours = Math.max(0, time.hours - 8)

      if (time.dayType === Day.REGULAR_DAY) {
        if (overtimeHours === 0) {
          result.value.overtimePay = 0
        } else if (overtimeHours <= 2) {
          result.value.overtimePay = overtimeHours * wage * 4 / 3
        } else if (overtimeHours > 2 && overtimeHours <= 4) {
          result.value.overtimePay = 2 * wage * 4 / 3 +
                                    (overtimeHours - 2) * wage * 5 / 3
        } else {
          result.value.legal = false
          result.value.overtimePay = 2 * wage * 4 / 3 +
                              (overtimeHours - 2) * wage * 5 / 3
          result.violations.push(new Article('勞動基準法', '32', 1))
        }
      } else if (time.dayType === Day.HOLIDAY) {
        result.according.push(new Article('勞動基準法', '39'))
        result.according.push(explanation102498)
        if (time.hours <= 8) {
          result.value.overtimePay = wage * 8
        } else {
          result.value.overtimePay = wage * 8 + (time.hours - 8) * wage * 2
        }
      } else if (time.dayType === Day.REGULAR_LEAVE) {
        result.according.push(new Article('勞動基準法', '40'))
        result.according.push(explanation102498)

        if (accident) {
          result.value.extraLeave = true
          if (time.hours <= 8) {
            result.value.overtimePay = wage * 8
          } else {
            result.value.overtimePay = wage * 8 +
                                      (time.hours - 8) * wage * 4 / 3
          }
        } else if (agreed && !accident) {
          const explanation = new Article('函釋', '（76）台勞動字第 1742 號函')
          explanation.setUrl('https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=1742&cnt=1&now=1&lnabndn=1&recordno=1')
          explanation.setBody([
            '一  勞動基準法第三十六條規定：「勞工每七日中至少應有一日之休息，' +
            '作為例假」，此項例假依該法規定，事業單位如非因同法第四十條所' +
            '列天災、事變或突發事件等法定原因，縱使勞工同意，亦不得使勞工',
            '在該假日工作。',
            '二  事業單位違反上開法令規定，除應依法處理並督責改進外，如勞工已' +
            '有於例假日出勤之事實，其當日出勤之工資，仍應加倍發給。'
          ])
          result.according.push(explanation)
          result.value.extraLeave = false
          result.value.legal = false
          result.violations.push(new Article('勞動基準法', '40'))

          if (time.hours <= 8) {
            result.value.overtimePay = wage * 8
          } else {
            result.value.overtimePay = wage * 8 + (time.hours - 8) * wage * 2
          }
        }
      } else if (time.dayType === Day.REST_DAY) {
        result.according.push(new Article('勞動基準法', '24'))
        if (agreed) {
          let hours = time.hours
          if (time.hours <= 4) {
            hours = 4
          } else if (time.hours <= 8) {
            hours = 8
          } else if (time.hours <= 12) {
            hours = 12
          }

          result.value.overtimePay = 2 * wage * 4 / 3 +
                                     (hours - 2) * wage * 5 / 3

          if (hours > 12) {
            result.value.legal = false
            result.violations.push(new Article('勞動基準法', '32'))
          }
        }
      }
    }

    return result
  }

  approvedBy (org: Org, approved: boolean) {
    this._approvedByOrg = approved
    return this
  }

  signed841 (signed: boolean) {
    this._signed841 = signed
    return this
  }

  providedProperFacilities (provided: boolean) {
    this._providedProperFacilities = provided
    return this
  }
}
