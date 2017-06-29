import Article from './Article'
import { ChildLaborType } from '.'

/**
 * 結果類別的資料欄位
 *
 * @interface Value
 */
interface Value {
  /**
   * 本結果是否合法
   *
   * @type {boolean}
   * @memberof Value
   */
  legal: boolean,

  /**
   * 童工的類型
   *
   * @type {ChildLaborType}
   * @memberof Value
   */
  type?: ChildLaborType,

  /**
   * 工資
   * @type {number}
   * @memberof Value
   */
  wages?: number,

  /**
   * 休假的天數
   * @type {number}
   * @memberof Value
   */
  leaves?: number,

  /**
   * 單位
   * @type {string}
   * @memberof Value
   */
  unit?: string,

  /**
   * 加班費
   * @type {number}
   * @memberof Value
   */
  overtimePay?: number,

  /**
   * 是否有額外補修
   * @type {boolean}
   * @memberof Value
   */
  extraLeave?: boolean,

  /**
   * 是否可退休
   * @type {boolean}
   * @memberof Value
   */
  retirement?: boolean,

  /**
   * 需要幾天前預告
   * @type {number}
   * @memberof Value
   */
  noticeDays?: number,

  /**
   * 資遣費
   * @type {number}
   * @memberof Value
   */
  severancePay?: number,

  /**
   * 正常工時的小時數
   * @type {number}
   * @memberof Value
   */
  regularHours?: number,

  /**
   * 加班的小時數
   * @type {number}
   * @memberof Value
   */
  overtimeHours?: number
}

/**
 * 結果類別，當回傳結果除了結果外，還需要包含參照的法條或違反的法條時所使用的類別
 *
 * @export
 * @class Result
 */
export default class Result {
  /**
   * 結果的資料，除了 legal 為必要欄位外，還會因不同的查詢結果有不同的欄位
   * @type {Value}
   * @memberof Result
   */
  value: Value = { legal: true }

  /**
   * 本結果所依據的法條
   * @type {Article[]}
   * @memberof Result
   */
  according: Article[] = []

  /**
   * 本結果所違反的法條
   * @type {Article[]}
   * @memberof Result
   */
  violations: Article[] = []
}
