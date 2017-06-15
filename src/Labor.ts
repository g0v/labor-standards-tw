import {Article, Education, Result, ChildLaborType, Gender} from './'
import * as moment from 'moment'

export default class Labor {
  private _gender: Gender
  private _age: number
  private _graduations: Object = {}
  private _authorityAgreed: boolean
  private _monthlySalary: number
  private _onboard: Date
  private _hourlyWage: number

  graduate (edu: Education, graduated: boolean): Labor {
    this._graduations[edu] = graduated
    return this
  }

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

  authorityAgree (agreed: boolean): Labor {
    this._authorityAgreed = agreed
    return this
  }

  setAge (age: number): Labor {
    this._age = age
    return this
  }

  getAge (): number {
    return this._age
  }

  setGender (gender: Gender): Labor {
    this._gender = gender
    return this
  }

  getGender (): Gender {
    return this._gender
  }

  onBoard (onboard: Date): Labor {
    this._onboard = onboard
    return this
  }

  monthSalary (salary: number): Labor {
    this._monthlySalary = salary
    this.setHourlyWage(salary / 30 / 8)
    return this
  }

  calculateHourlyWage (): Result {
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

    result.value.wage = this.getHourlyWage()
    result.according.push()

    return result
  }

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

  setHourlyWage (hourly: number): Labor {
    this._hourlyWage = hourly
    return this
  }

  getHourlyWage (): number {
    return this._hourlyWage
  }

  takeMaternityLeave (start: Date, miscarriage: boolean = false, pregnantMonth: number = 0 ) {
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
      leave: week,
      unit: 'week',
      wages: this._monthlySalary / 30 * 7 * week * ratio
    }

    return result
  }
}
