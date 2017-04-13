const expect = require('chai').expect;
const std = require('../../src/index');

//WIP
describe('休假', () => {
    describe('特休', () => {
        it('月薪 36,000, 平均時薪為 150 元', () => {
            expect(std.hourlySalary(36000)).eq(150);
        });
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
