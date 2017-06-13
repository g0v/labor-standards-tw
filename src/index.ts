import Labor from './Labor'
import Result from './Result'
import WorkTime from './WorkTime'
import Article from './Article'

export enum Education {
  JUNIOR_HIGH_SCHOOL
}

export enum Day {
  REGULAR_DAY,
  REST_DAY,
  REGULAR_LEAVE,
  HOLIDAY
}

export enum Duration {
  DAY,
  WEEK,
  MONTH
}

export enum ChildLaborType {
  ILLEGAL,
  FOLLOW_CHILD_LABOR_ARTICLES,
  CHILD_LABOR,
  PRE_ADULT,
  ADULT
}

export enum Gender {
  MALE,
  FEMALE,
  UNSPECIFIED
}

export enum Org {
  UNION_OR_LABOR_MANAGEMENT_MEETING
}

export { Labor, WorkTime, Result, Article }
