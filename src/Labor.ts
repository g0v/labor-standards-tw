import {Article, Education, Result, ChildLaborType, Gender} from './'
import * as moment from 'moment'

export default class Labor {
  private _gender: Gender
  private _age: number
  private _graduations: Object = {}
  private _authorityAgreed: boolean
  private _monthlySalary: number
  private _onboard: Date

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
    return this
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
