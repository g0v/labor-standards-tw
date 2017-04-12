const expect = require('chai').expect;
const std = require('../src/index');

describe('hourlySalary()', () => {
  it('以月薪 36,000 元計算，平均時薪為 150 元', () => {
    expect(std.hourlySalary(36000)).eq(150);
  });
});

describe('overtimePay()', () => {
  describe('紀念日、節日、勞動節 (holiday)', () => {

  });

  describe('例假日 (regular leave)', () => {

  });

  describe('休息日 (rest day)', () => {
    it('平均時薪 150 工作一小時，薪資為 400 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 1, std.REGULAR_LEAVE);
      expect(result.value).eq(400);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作兩小時，薪資為 400 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 2, std.REGULAR_LEAVE);
      expect(result.value).eq(400);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作五小時，薪資為 1900 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 5, std.REGULAR_LEAVE);
      expect(result.value).eq(1900);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作 5.5 個小時，薪資為 1900 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 5.5, std.REGULAR_LEAVE);
      expect(result.value).eq(1900);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作 8 個小時，薪資為 1900 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 8, std.REGULAR_LEAVE);
      expect(result.value).eq(1900);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作 8.5 個小時，薪資為 2900 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 8.5, std.REGULAR_LEAVE);
      expect(result.value).eq(2900);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作 10 個小時，薪資為 2900 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 10, std.REGULAR_LEAVE);
      expect(result.value).eq(2900);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作 12 個小時，薪資為 2900 元（勞基法 24 條）', () => {
      let result = std.overtimePay(150, 12, std.REGULAR_LEAVE);
      expect(result.value).eq(2900);
      expect(result.reference[0].id).eq('LSA-24');
    });

    it('平均時薪 150 工作 13 個小時，結果回傳不合法（勞基法 32 條）', () => {
      let result = std.overtimePay(150, 13, std.REGULAR_LEAVE);
      expect(result.status).eq(std.ILLEGAL);
      expect(result.reference[0].id).eq('LSA-32');
    });
  });
});
