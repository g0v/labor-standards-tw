import Article from './Article'

interface Value {
  legal: boolean,
  type?: number,
  wages?: number,
  leaves?: number,
  unit?: string,
  overtimePay?: number,
  extraLeave?: boolean,
  retirement?: boolean,
  noticeDays?: number,
  severancePay?: number,
  regularHours?: number,
  overtimeHours?: number
}

export default class Result {
  value: Value = { legal: true }
  according: Article[] = []
  violations: Article[] = []
}
