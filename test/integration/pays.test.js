const expect = require('chai').expect;
const std = require('../../src/index');

//TODO: WIP
describe('薪資給付', () => {
    describe('月薪', () => {
        it('月薪 36,000，平均時薪為 150 元', () => {
            expect(std.hourlySalary(36000)).eq(150);
        });
    });

    describe('時薪制', () => {
        it('基本時薪 120 元，工作 8 小時因為 960 元', () => {
            pass();
        });
    });
});
