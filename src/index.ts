import Labor from './Labor'
import Result from './Result'
import WorkTime from './WorkTime'
import Article from './Article'

/**
 * 最高學歷用的列舉型態
 *
 * @export
 * @enum {number}
 */
export enum Education {
  JUNIOR_HIGH_SCHOOL
}

/**
 * 日期的型態，目前有正常日、休息日、例假日與國定假日
 *
 * @export
 * @enum {number}
 */
export enum Day {
  /** 正常日 */
  REGULAR_DAY,
  /** 休息日 */
  REST_DAY
  /** 例假日 */,
  REGULAR_LEAVE,
  /** 國定假日 */
  HOLIDAY
}

/**
 * 驗證工作時間是否合法用的長度類型，可以檢測單天、單周或是單個月的工作時間是否合法
 *
 * @export
 * @enum {number}
 */
export enum Duration {
  /** 單天 */
  DAY,
  /** 單周 */
  WEEK,
  /** 單月 */
  MONTH
}

/**
 * 勞工類型，用於驗證童工是否合法，有違法、年紀太小適用童工規則但不是童工、童工、
 * 未滿十八歲的勞工與一般勞工。
 *
 * @export
 * @enum {number}
 */
export enum ChildLaborType {
  /** 違法勞工 */
  ILLEGAL,
  /** 年紀太小但是用童工規則 */
  FOLLOW_CHILD_LABOR_ARTICLES,
  /** 童工 */
  CHILD_LABOR,
  /** 未滿十八歲的勞工 */
  PRE_ADULT,
  /** 一般勞工 */
  ADULT
}

/**
 * 性別，勞基法中有些規定僅適用於女性
 *
 * @export
 * @enum {number}
 */
export enum Gender {
  MALE,
  FEMALE,
  UNSPECIFIED
}

/**
 * 組織或工會，有些法條的合法條件是需要經過勞資會議或者是工會同意。
 *
 * @export
 * @enum {number}
 */
export enum Org {
  UNION_OR_LABOR_MANAGEMENT_MEETING
}

export { Labor, WorkTime, Result, Article }
