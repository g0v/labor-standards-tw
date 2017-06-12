import {Article, Education, Result, ChildLaborType} from './'

export default class Labor {
  private age: number
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
    this.age = age
    return this
  }

  getAge (): number {
    return this.age
  }

  onBoard (onboard: Date): Labor {
    this._onboard = onboard
    return this
  }

  monthSalary (salary: number): Labor {
    this._monthlySalary = salary
    return this
  }
}
