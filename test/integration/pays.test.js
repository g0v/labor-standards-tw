const expect = require('chai').expect;
const std = require('../../src/index');

//TODO: WIP
describe('薪資給付', () => {
  describe('月薪', () => {
    it('以月薪 36,000 元計算，平均時薪為 150 元', () => {
      let result = std.hourlySalary(36000);
      expect(result.value).eq(150);
      expect(result.reference[0].id).eq('勞動 2字第 0960130677 號函');
      // https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&lc1=%5bc%5d%E5%8B%9E%E5%8B%95%E5%9F%BA%E6%BA%96%E6%B3%95%2c24&cnt=37&recordno=10
    });

    describe('加班費', () => {
      describe('紀念日、節日、勞動節 (holiday)', () => {

      });

      describe('例假日 (regular leave)', () => {
        it('因天災、事變或突發事件，雇主認有繼續工作之必要時，徵得勞工同意後，' +
          '工資加倍發給。月薪制勞工，平均時薪 150 元並工作 2 小時，' +
          '加給工資 1200 元（勞基法 39, 40 條），額外休假一天', () => {
          const accident = true;
          const consent = true;
          let result = std.overtimePay(150, 2, std.REGULAR_LEAVE, accident, consent);
          expect(result.value).eq(1200);
          expect(result.extraLeave.value).eq(1);
          expect(result.extraLeave.unit).eq('day');
          expect(result.reference[0].id).eq('LSA-39');
          expect(result.reference[1].id).eq('LSA-40');
          //https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&lc1=%5bc%5d%E5%8B%9E%E5%8B%95%E5%9F%BA%E6%BA%96%E6%B3%95%2c40&cnt=19&recordno=10
          expect(result.reference[2].id).eq('台八十三勞動一字第 102498 號函');
        });

        it('若「無」天災、事變或突發事件，但雇主要求於例假日工作並且徵得勞工同意時，此為違法加班' +
          '工資加倍發給。月薪制勞工，平均時薪 150 元並工作 2 小時，' +
          '加給工資 1200 元（勞基法 39, 40 條）', () => {
          const accident = false;
          const consent = true;
          let result = std.overtimePay(150, 2, std.REGULAR_LEAVE, accident, consent);
          /*
          expect result looks like this:
          {
            status: std.ILLEGAL,
            value: 1200,
            extraLeave: {
              value: 1,
              unit: 'day'
            },
            reference: [
              {
                id: 'LSA-39',
                description: '第三十六條所定之例假、休息日、第....',
                url: 'http://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?lsid=FL014930&flno=39'
              },
              { id: 'LSA-40' },
              { id: 'LSA-79' },
              { id: '台八十三勞動一字第 102498 號函' }
            ],
            fines: [
              { min: 20000, max: 1000000, according: 'LSA-79' }
            ]
          };
          */
          expect(result.value).eq(1200);
          expect(result.extraLeave.value).eq(0);
          expect(result.extraLeave.unit).eq('day');
          expect(result.reference[0].id).eq('LSA-39');
          expect(result.reference[1].id).eq('LSA-40');
          expect(result.reference[2].id).eq('LSA-79');

          // https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&lc1=%5bc%5d%E5%8B%9E%E5%8B%95%E5%9F%BA%E6%BA%96%E6%B3%95%2c40&cnt=19&recordno=10
          expect(result.reference[3].id).eq('台八十三勞動一字第 102498 號函');
          expect(result.status).eq(std.ILLEGAL);

          // 79 條，罰則介於二萬到一百萬
          expect(result.fines[0].according).eq('LSA-79');
          expect(result.fines[0].min).eq(20000);
          expect(result.fines[0].max).eq(1000000);
        });
      });

      describe('休息日 (rest day)', () => {
        it('月薪制勞工, 平均時薪 150 工作 1 小時，實領加班費為 900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 1, std.REST_DAY);
          expect(result.value).eq(900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 2 小時，實領加班費為 900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 2, std.REST_DAY);
          expect(result.value).eq(900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 4 小時，實領加班費為 900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 4, std.REST_DAY);
          expect(result.value).eq(900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 5 小時，實領加班費為 1900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 5, std.REST_DAY);
          expect(result.value).eq(1900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 5.5 個小時，實領加班費為 1900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 5.5, std.REST_DAY);
          expect(result.value).eq(1900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 8 個小時，實領加班費為 1900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 8, std.REST_DAY);
          expect(result.value).eq(1900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 8.5 個小時，實領加班費為 2900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 8.5, std.REST_DAY);
          expect(result.value).eq(2900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 10 個小時，實領加班費為 2900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 10, std.REST_DAY);
          expect(result.value).eq(2900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 12 個小時，實領加班費為 2900 元（勞基法 24 條）', () => {
          let result = std.overtimePay(150, 12, std.REST_DAY);
          expect(result.value).eq(2900);
          expect(result.reference[0].id).eq('LSA-24');
        });

        it('月薪制勞工, 平均時薪 150 工作 13 個小時，結果回傳不合法（勞基法 32 條）', () => {
          let result = std.overtimePay(150, 13, std.REST_DAY);
          expect(result.status).eq(std.ILLEGAL);
          expect(result.reference[0].id).eq('LSA-32');
        });
      });
    });
  });

  describe('時薪制', () => {
    it('基本時薪 120 元，工作 8 小時因為 960 元', () => {
      pass();
    });
  });
});
