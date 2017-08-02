import { Duration, Labor, Result, ChildLaborType, Article, Day, Org, Gender } from './'

/**
 * 工作時間資訊，包含日期，幾個小時以及工作天是哪種類型（是正常工作日、例假日或其他）
 *
 * @interface Time
 */
interface Time {
  date: Date
  hours: number
  dayType?: Day
}

/**
 * 工作時間類別，用來檢測工作時間是否違法以及加班費的計算
 * @export
 * @class WorkTime
 */
export default class WorkTime {
  private _duration: Duration
  private _labor: Labor
  private _times: Time[]
  private _approvedByOrg: boolean
  private _signed841: boolean
  private _providedProperFacilities: boolean

  /**
   * 建立一個工作時間的物件
   * @param {Duration} duration 檢測工作時間的長度，可能是單天，單周或單月
   * @param {Labor} labor 勞工，勞工不同的狀態，計算上會有不同
   * @memberof WorkTime
   */
  constructor (duration: Duration, labor: Labor) {
    this._duration = duration
    this._labor = labor
    this._times = []
  }

  /**
   * 驗證工作時間是否合法
   * @returns {Result} 結果
   * @memberof WorkTime
   */
  validate (): Result {
    const result = new Result()
    const type = this._labor.validateChildLabor().value.type
    result.value.legal = true

    const isChildLabor = type === ChildLaborType.CHILD_LABOR ||
                         type === ChildLaborType.FOLLOW_CHILD_LABOR_ARTICLES

    if (isChildLabor && this._times.some(t => t.dayType === Day.REGULAR_LEAVE)) {
      result.value.legal = false
      result.violations.push(new Article('勞動基準法', '47'))
    }

    const lateThen20 = this._times.some(t => {
      const date = new Date(t.date.getTime())
      const start = date.getHours()
      const d = date.setHours(start + t.hours)
      const end = date.getHours()

      return end > 20
    })

    const between22and6 = this._times.some(t => {
      const date = new Date(t.date.getTime())
      const start = date.getHours()
      const d = date.setHours(start + t.hours)
      const end = date.getHours()

      return start <= 6 || end <= 6 || start >= 22 || end >= 22
    })

    if (this._labor.getGender() === Gender.FEMALE) {
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

    if (this._duration === Duration.DAY) {
      if (this._times.length !== 1) {
        throw new Error(`單日工時驗證僅支援加入一個時間區段，` +
                        `目前有 ${this._times.length} 個區段`)
      }

      const time = this._times[0]

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
    } else if (this._duration === Duration.WEEK) {
      if (this._times.length > 7) {
        throw new Error(`單周工時驗證僅支援小於 7 個時間區段，` +
                        `目前有 ${this._times.length} 個區段`)
      }

      if (isChildLabor) {
        const total = this._times.map(t => t.hours).reduce((a, b) => a + b)
        if (total > 40) {
          result.value.legal = false
          result.violations.push(new Article('勞動基準法', '47'))
        }
      }
    } else if (this._duration === Duration.MONTH) {
      result.according.push(new Article('勞動基準法', '32', 1))

      let monthlyOvertimeHours = 0
      let monthlyRegularHours = 0
      this._times.forEach(time => {
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

  /**
   * 加一段工作時間進入要驗證的區段。在單周或單月的驗證中可以支援多段時間。
   * @param {Date} date 日期
   * @param {number} hours 工作時數
   * @param {Day} [dayType=Day.REGULAR_DAY] 工作天類型，可能是一般工作天或例假日等
   * @memberof WorkTime
   */
  add (date: Date, hours: number, dayType: Day = Day.REGULAR_DAY) {
    this._times.push({date, hours, dayType})
  }

  /**
   * 計算加班費
   * @param {boolean} [accident=false] 是否有天災、事變或突發事件
   * @param {boolean} [agreed=true] 勞工是否同意加班
   * @returns {Result} 結果
   * @memberof WorkTime
   */
  overtimePay (accident: boolean = false, agreed: boolean = true): Result {
    const result = new Result()
    const wages = this._labor.getHourlyWages()

    const explanation102498 = new Article('函釋', '台八十三勞動一字第 102498 號函')
    explanation102498.setUrl('https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=102498&cnt=1&now=1&lnabndn=1&recordno=1')
    explanation102498.setBody(['勞動基準法第三十九條及第四十條規定，勞工於假日' +
      '工作時，工資應加倍發給。所稱「加倍發給」，係指當日工資照給外，' +
      '再加發一日工資。此乃因勞工於假日工作，即使未滿八小時，' +
      '亦已無法充分運用假日之故，與同法第三十二條延長每日工資應依第二十四條' +
      '按平日每小時工資額加或加倍發給工資之規定不同。'])

    result.value.legal = true
    result.according.push(new Article('勞動基準法', '24', 0))

    if (!agreed) {
      const article = new Article('勞動基準法', '42')
      result.value.legal = false
      result.according.push(article)
      result.violations.push(article)
      return result
    }

    if (this._duration === Duration.DAY) {
      if (this._times.length !== 1) {
        throw new Error(`單日計算加班費僅支援加入一個時間區段，` +
          `目前有 ${this._times.length} 個區段`)
      }

      const time = this._times[0]
      const overtimeHours = Math.max(0, time.hours - 8)

      if (time.dayType === Day.REGULAR_DAY) {
        if (overtimeHours === 0) {
          result.value.overtimePay = 0
        } else if (overtimeHours <= 2) {
          result.value.overtimePay = overtimeHours * wages * 4 / 3
        } else if (overtimeHours > 2 && overtimeHours <= 4) {
          result.value.overtimePay = 2 * wages * 4 / 3 +
                                    (overtimeHours - 2) * wages * 5 / 3
        } else {
          result.value.legal = false
          result.value.overtimePay = 2 * wages * 4 / 3 +
                              (overtimeHours - 2) * wages * 5 / 3
          result.violations.push(new Article('勞動基準法', '32', 1))
        }
      } else if (time.dayType === Day.HOLIDAY) {
        result.according.push(new Article('勞動基準法', '39'))
        result.according.push(explanation102498)
        if (time.hours <= 8) {
          result.value.overtimePay = wages * 8
        } else {
          result.value.overtimePay = wages * 8 + (time.hours - 8) * wages * 2
        }
      } else if (time.dayType === Day.REGULAR_LEAVE) {
        result.according.push(new Article('勞動基準法', '40'))
        result.according.push(explanation102498)

        if (accident) {
          result.value.extraLeave = true
          if (time.hours <= 8) {
            result.value.overtimePay = wages * 8
          } else {
            result.value.overtimePay = wages * 8 +
                                      (time.hours - 8) * wages * 4 / 3
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
            result.value.overtimePay = wages * 8
          } else {
            result.value.overtimePay = wages * 8 + (time.hours - 8) * wages * 2
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

          result.value.overtimePay = 2 * wages * 4 / 3 +
                                     (hours - 2) * wages * 5 / 3

          if (hours > 12) {
            result.value.legal = false
            result.violations.push(new Article('勞動基準法', '32'))
          }
        }
      }
    }

    return result
  }

  /**
   * 這樣的工作時間是否有經過工會或勞資會議的同意
   * @param {Org} org 工會或勞資會議
   * @param {boolean} approved 是否同意
   * @returns {WorkTime} 回傳原本的物件用於 method chaining
   * @memberof WorkTime
   */
  approvedBy (org: Org, approved: boolean): WorkTime {
    this._approvedByOrg = approved
    return this
  }

  /**
   * 這樣的工作時間是否簽署了勞基法 84-1 條所提及的合約
   *
   * @param {boolean} signed 是否簽屬
   * @returns {WorkTime} 回傳原本的物件用於 method chaining
   * @memberof WorkTime
   */
  signed841 (signed: boolean): WorkTime {
    this._signed841 = signed
    return this
  }

  /**
   * 雇主是否提供提供必要之安全衛生設施與無大眾運輸工具可資運用時，
   * 是否提供交通工具或安排女工宿舍。
   *
   * @param {boolean} provided 是否提供
   * @returns {WorkTime} 回傳原本的物件用於 method chaining
   * @memberof WorkTime
   */
  providedProperFacilities (provided: boolean): WorkTime {
    this._providedProperFacilities = provided
    return this
  }
}
