import {Education, Result} from './'

export default class Labor {
  private _age: number
  private _graduations: Object
  private _authorityAgreed: boolean
  private _monthlySalary: number
  private _onboard: Date

  graduate (edu: Education, graduated): Labor {
    this._graduations[edu] = graduated
    return this
  }

  validateChildLabor (): Result {
    return new Result()
  }

  authorityAgree (agreed: boolean): Labor {
    this._authorityAgreed = agreed
    return this
  }

  age (age: number): Labor {
    this._age = age
    return this
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
