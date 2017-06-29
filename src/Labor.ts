import {Article, Education, Result, ChildLaborType, Gender} from './'
import * as moment from 'moment'

/**
 * 勞工類別，用於儲存勞工的各種狀態。
 *
 * @export
 * @class Labor
 */
export default class Labor {
  private _gender: Gender
  private _age: number
  private _graduations: Object = {}
  private _authorityAgreed: boolean
  private _monthlySalary: number
  private _onboard: Date
  private _hourlyWages: number

  /**
   * 是否畢業於特定學歷，比如說是否有高中畢業、是否有國中畢業。
   *
   * @param {Education} edu 學歷
   * @param {boolean} graduated 是否有畢業
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  graduate (edu: Education, graduated: boolean): Labor {
    this._graduations[edu] = graduated
    return this
  }

  /**
   * 設定是否有主管機關同意，用於童工的規定，勞動基準法 45 條第一項規定：
   * 「雇主不得僱用未滿十五歲之人從事工作。但國民中學畢業或經主管機關認定其工作性質
   * 及環境無礙其身心健康而許可者，不在此限。」
   *
   * @param {boolean} agreed 主管機關是否同意
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  authorityAgree (agreed: boolean): Labor {
    this._authorityAgreed = agreed
    return this
  }

  /**
   * 設定年齡
   *
   * @param {number} age 年齡
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  setAge (age: number): Labor {
    this._age = age
    return this
  }

  /**
   * 取得年齡
   *
   * @returns {number} 年齡
   * @memberof Labor
   */
  getAge (): number {
    return this._age
  }

  /**
   * 設定性別，預設性別為「不指定」
   *
   * @param {Gender} gender 性別
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  setGender (gender: Gender): Labor {
    this._gender = gender
    return this
  }

  /**
   * 取得性別
   *
   * @returns {Gender} 性別
   * @memberof Labor
   */
  getGender (): Gender {
    return this._gender
  }

  /**
   * 設定到職日期
   *
   * @param {Date} onboard 到職日期
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  onBoard (onboard: Date): Labor {
    this._onboard = onboard
    return this
  }

  /**
   * 取得到職日期
   *
   * @returns {Date} 到職日期
   * @memberof Labor
   */
  getOnBoardDate (): Date {
    return this._onboard
  }

  /**
   * 設定計算加班費用的平均時薪
   *
   * @param {number} hourly 平均時薪
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  setHourlyWages (hourly: number): Labor {
    this._hourlyWages = hourly
    return this
  }

  /**
   * 取得計算加班費用的平均時薪
   *
   * @returns {number} 平均時薪
   * @memberof Labor
   */
  getHourlyWages (): number {
    return this._hourlyWages
  }

  /**
   * 設定月薪，設定月薪時同時會計算加班費用的平均時薪。
   *
   * @param {number} salary 月薪
   * @returns {Labor} 回傳勞工物件用於 method chaining
   * @memberof Labor
   */
  setMonthlySalary (salary: number): Labor {
    this._monthlySalary = salary
    this.setHourlyWages(salary / 30 / 8)
    return this
  }

  /**
   * 取得月薪
   *
   * @returns {number} 月薪
   * @memberof Labor
   */
  getMonthlySalary (): number {
    return this._monthlySalary
  }

  /**
   * 驗證此員工是否為童工
   *
   * @returns {Result} 驗證結果
   * @memberof Labor
   */
  validateChildLabor (): Result {
    const result = new Result()
    const age = this.getAge()
    const agreed = this._authorityAgreed
    const graduated = this._graduations[Education.JUNIOR_HIGH_SCHOOL]

    if (age >= 15 && age < 16) {
      result.value.type = ChildLaborType.CHILD_LABOR
      result.according.push(new Article('勞動基準法', '44'))
    } else if (age < 15 && (agreed || graduated)) {
      result.value.type = ChildLaborType.FOLLOW_CHILD_LABOR_ARTICLES
      result.according.push(new Article('勞動基準法', '44'))
      result.according.push(new Article('勞動基準法', '45'))
    } else if (age < 15 && (!agreed && !graduated)) {
      const article = new Article('勞動基準法', '44')
      const violation = new Article('勞動基準法', '45')
      result.value.type = ChildLaborType.ILLEGAL
      result.according.push(article)
      result.violations.push(violation)
      result.value.legal = false
    } else if (age >= 16 && age < 18) {
      result.value.type = ChildLaborType.PRE_ADULT
      result.according.push(new Article('勞動基準法', '44'))
      result.according.push(new Article('勞動基準法', '46'))
    } else {
      result.value.type = ChildLaborType.ADULT
      result.according.push(new Article('勞動基準法', '44'))
    }

    return result
  }

  /**
   * 驗證該員工是否可以退休
   *
   * @param {Date} date 預定要退休的日期
   * @returns {Result} 驗證結果
   * @memberof Labor
   */
  retire (date: Date): Result {
    const result = new Result()

    const years = moment(date).diff(this._onboard, 'years')
    const retirement = (years >= 15 && this.getAge() >= 55) ||
                       (years >= 25) ||
                       (years >= 10 && this.getAge() >= 60)

    result.value.retirement = retirement
    result.according.push(new Article('勞動基準法', '53'))

    return result
  }

  /**
   * 計算加班費所需要用的平均時薪
   *
   * @returns {Result} 計算結果
   * @memberof Labor
   */
  calculateHourlyWages (): Result {
    const result = new Result()
    const explanation = new Article('函釋', '勞動 2字第 0960130677 號函')
    explanation.setUrl('https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=0960130677&cnt=1&now=1&lnabndn=1&recordno=1')
    explanation.setBody([
      '按月計酬之勞工於逾法定正常工時之時段延長工時，應依勞動基準法第 ' +
      '24 條規定計給延時工資；其據以核計延時工資之「平日每小時工資額」' +
      '究應如何計算，應視勞動契約之內容而定。原約定月薪給付總額相當於' +
      ' 240 小時者（即「平日每小時工資額」係以月薪總額除以 30 再除以 8 ' +
      '核計者），除勞資雙方重行約定者外，其「平日每小時工資額」仍可依據' +
      '原公式推算（如月薪為 17280  元者即為 72 元），不因按時發布之基本' +
      '工資調升至 95 元而當然變動。'
    ])

    result.value.wages = this.getHourlyWages()
    result.according.push(explanation)

    return result
  }

  /**
   * 取得員工被資遣時的相關資訊
   *
   * @param {Date} date 被資遣的日期
   * @returns {Result} 取得相關資訊的結果
   * @memberof Labor
   */
  beDismissed (date: Date): Result {
    const result = new Result()

    const years = moment(date).diff(this._onboard, 'years', true)
    const days = moment(date)
                  .subtract(Math.floor(years), 'years')
                  .diff(this._onboard, 'days') + 1

    if (years < 0.25) {
      result.value.noticeDays = 0
    } else if (years < 1) {
      result.value.noticeDays = 10
    } else if (years < 3) {
      result.value.noticeDays = 20
    } else {
      result.value.noticeDays = 30
    }

    let severancePay = this._monthlySalary * Math.floor(years) / 2
    severancePay += this._monthlySalary / 12 / 30 / 2 * days

    result.value.severancePay = Math.min(severancePay, this._monthlySalary * 6)

    result.according.push(new Article('勞工退休金條例', '12', 0))

    return result
  }

  /**
   * 取得該勞工應該有多少特休
   *
   * @param {Date} date 用預計算年資的日期，通常會用今天。但如果有需要知道未來的
   *                    某一天的特休有幾天也可以用那天的日期來計算特休假的數量
   * @returns {Result} 計算的結果
   * @memberof Labor
   */
  paidLeaves (date: Date): Result {
    const result = new Result()

    const diff = moment(date).diff(moment(this._onboard), 'months') / 12

    if (diff < 0.5) {
      result.value.leaves = 0
    } else if (diff < 1) {
      result.value.leaves = 3
    } else if (diff < 2) {
      result.value.leaves = 7
    } else if (diff < 3) {
      result.value.leaves = 10
    } else if (diff < 5) {
      result.value.leaves = 14
    } else if (diff < 10) {
      result.value.leaves = 15
    } else {
      // 十年以上者，每一年加給一日，加至三十日為止。
      result.value.leaves = Math.min(15 + Math.floor(diff - 10), 30)
    }

    result.according.push(new Article('勞動基準法', '38'))
    result.value.unit = 'day'
    return result
  }

  /**
   * 取得請產假 / 小產產假的資訊
   *
   * @param {Date} start 產假預計開始的日期
   * @param {boolean} [miscarriage=false] 狀況是否為小產，預設為否
   * @param {number} [pregnantMonth=0] 懷孕幾個月
   * @returns {Result} 產假資訊的結果
   * @memberof Labor
   */
  takeMaternityLeave (start: Date, miscarriage: boolean = false, pregnantMonth: number = 0 ): Result {
    if (this.getGender() !== Gender.FEMALE) {
      throw new Error('此勞工不為女性，不能請產假')
    }

    const onboard = moment(this._onboard)
    const leaveDate = moment(start)
    const ratio = leaveDate.diff(onboard, 'months') >= 6 ? 1 : 0.5
    let week = 8

    if (miscarriage) {
      week = pregnantMonth >= 3 ? 4 : 0
    }

    const result: Result = new Result()
    result.according.push(new Article('勞動基準法', '50'))
    result.value = {
      legal: true,
      leaves: week,
      unit: 'week',
      wages: this._monthlySalary / 30 * 7 * week * ratio
    }

    return result
  }
}
