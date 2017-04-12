const expect = require('chai').expect;
const std = require('../src/index');

describe('hourlySalary()', () => {
  it('以月薪 36,000 元計算，平均時薪為 150 元', () => {
    expect(std.hourlySalary(36000)).eq(150);
  });
});

describe('overtimePay()', () => {
  describe('休息日 (regular leave)', () => {
    it('月薪制勞工, 平均時薪 150 工作 1 小時，實領加班費為 900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 1, std.REGULAR_LEAVE)).eq(900)
    });

    it('月薪制勞工, 平均時薪 150 工作 2 小時，實領加班費為 900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 2, std.REGULAR_LEAVE)).eq(900)
    });

    it('月薪制勞工, 平均時薪 150 工作 4 小時，實領加班費為 900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 4, std.REGULAR_LEAVE)).eq(900)
    });

    it('月薪制勞工, 平均時薪 150 工作 5 小時，實領加班費為 1900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 5, std.REGULAR_LEAVE)).eq(1900)
    });

    it('月薪制勞工, 平均時薪 150 工作 5.5 個小時，實領加班費為 1900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 5.5, std.REGULAR_LEAVE)).eq(1900)
    });

    it('月薪制勞工, 平均時薪 150 工作 8 個小時，實領加班費為 1900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 8, std.REGULAR_LEAVE)).eq(1900)
    });

    it('月薪制勞工, 平均時薪 150 工作 8.5 個小時，實領加班費為 2900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 8.5, std.REGULAR_LEAVE)).eq(2900)
    });

    it('月薪制勞工, 平均時薪 150 工作 10 個小時，實領加班費為 2900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 10, std.REGULAR_LEAVE)).eq(2900)
    });

    it('月薪制勞工, 平均時薪 150 工作 12 個小時，實領加班費為 2900 元（勞基法 24 條）', () => {
      expect(std.overtimePay(150, 12, std.REGULAR_LEAVE)).eq(2900)
    });

    it('平均時薪 150 工作 13 個小時，丟出 RangeError（勞基法 32 條）', () => {
      try {
        std.overtimePay(150, 13, std.REGULAR_LEAVE);
      }
      catch (err) {
        expect(err instanceof RangeError).is.true;
      }
    });
  });
});
