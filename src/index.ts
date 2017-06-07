import Labor from './Labor'
import Result from './Result'
import WorkTime from './WorkTime'

export enum Education {
  JUNIOR_HIGH_SCHOOL
}

export enum Day {
  REGULAR_DAY,
  REST_DAY,
  REGULAR_LEAVE
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
  LABOR_MANAGEMENT_MEETING,
  UNION
}

export { Labor, WorkTime, Result }
