const expect = require('chai').expect;
const std = require('../../src/index');

//WIP
describe('工作時間、休息、休假', () => {

  describe('工作時間', () => {
    it('正常工時情況下，一勞工於一天內工作十個小時，其中八個小時是正常工時，兩個小時為加班', () => {
      let result = std.validateWorkingHours(std.DAILY_WORKING_HOURS, std.REGULAR_WORKING_HOURS, 10);
      expect(result.status).eq(std.LEGAL);
      expect(result.value.regular).eq(8);
      expect(result.value.overtime).eq(2);
    });

    it('正常工時情況下，一勞工於一天內工作十二個小時，其中八個小時是正常工時，四個小時為加班', () => {
      let result = std.validateWorkingHours(std.DAILY_WORKING_HOURS, std.REGULAR_WORKING_HOURS, 12);
      expect(result.status).eq(std.LEGAL);
      expect(result.value.regular).eq(8);
      expect(result.value.overtime).eq(4);
    });

    it('正常工時情況下，一勞工於一天內工作十五個小時，其中八個小時是正常工時，七個小時為加班並且違反勞基法 32 條', () => {
      let result = std.validateWorkingHours(std.DAILY_WORKING_HOURS, std.REGULAR_WORKING_HOURS, 15);
      expect(result.status).eq(std.ILLEGAL);
      expect(result.value.regular).eq(8);
      expect(result.value.overtime).eq(7);
      expect(result.fines[0].according).eq('LSA-79');
      expect(result.fines[0].min).eq(20000);
      expect(result.fines[0].max).eq(1000000);
    });

    it('正常工時情況下，勞工於一個月內的連續三週（十五天）每天工作十二個小時，此違反勞基法 32 條一個月不能超過 46 小時', () => {
      let hours = Array.apply(null, Array(15)).map(Number.prototype.valueOf, 12);
      // this array will be [12, 12, 12, 12, ...] with 15 items;
      let total = hours
                    .map(h => std.validateWorkingHours(std.DAILY_WORKING_HOURS, std.REGULAR_WORKING_HOURS, h))
                    .reduce((a, b) => a + b);
      let result = std.validateWorkingHours(std.MONTHLY_WORKING_HOURS, std.REGULAR_WORKING_HOURS, total);
      expect(result.status).eq(std.ILLEGAL);
      expect(result.value.regular).eq(120);
      expect(result.value.overtime).eq(60);
      expect(result.fines[0].according).eq('LSA-79');
      expect(result.fines[0].min).eq(20000);
      expect(result.fines[0].max).eq(1000000);
    });
  });

  describe('休假', () => {
    describe('特休', () => {
    });

    describe('事假', () => {
    });

    describe('產假', () => {

    });

    describe('陪產假', () => {

    });

    describe('病假', () => {

    });
  });
});
