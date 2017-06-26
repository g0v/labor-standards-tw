# 如何撰寫測試案例

目前測試案例分門別類地放在 [features 目錄](features) 底下

一個測試案例的範例如下：

```cucumber
場景: 時薪制的薪資計算
  假設 一個時薪制的勞工，基本時薪為 120 元
  當 在平常日
  而且 工作 8 小時
  而且 計算他的當日薪資時
  那麼 薪資為 960 元
```

你可以用 `假設`、`假如`、`假定` 敘述前置條件，用 `當` 敘述執行的動作。`假設` 跟 `當` 的用途很像，如果你區分不出差異也沒什麼關係，會有人協助確認是否適當。

用 `那麼` 敘述依照前面的狀況，應該要有什麼結果。而無論是 `假設`、`當` 或 `那麼`，都可以用 `而且`、`並且`、`同時`、`但是` 串連各種條件。

除了以上提到的 `場景` 外，如果一次要套用很多條件，也可以使用 `場景大綱`：

```cucumber
  場景大綱: 合法狀況下平日的加班費
    假設 一個月薪制的勞工，平均時薪為 150 元
    當 在平常日
    而且 工作 <hours> 小時
    而且 計算加班費時

    那麼 他的加班費為 <overtimePay> 元

    例子:
      | hours | overtimePay |
      | 8     | 0           |
      | 10    | 400         |
      | 11    | 650         |
```

更多例子請到 features 目錄底下閱讀。

# 撰寫 API 的使用方法

當有足夠的測試案例後，接下來則是要設計這個測試案例在此函式庫裡面如何使用。我們採用 [cucumber.js](https://github.com/cucumber/cucumber-js/) 作為撰寫測試案例的工具，讓不寫程式的參與者也可以參與撰寫測試案例。

當執行 `npm test` 時，cucumber 會列出所有尚未實作的步驟，比如說以下輸出：

```shell
$ npm test

Warnings:

1) Scenario: 女性勞工不得於晚上十點後工作 - features/female.feature:5
   Step: 假如一女性勞工 - features/female.feature:6
   Message:
     Undefined. Implement with the following snippet:

       Given('一女性勞工', function () {
         // Write code here that turns the phrase above into concrete actions
         return 'pending';
       });

2) Scenario: 女性勞工不得於晚上十點後工作 - features/female.feature:5
   Step: 當於 23 點時工作 - features/female.feature:7
   Message:
     Undefined. Implement with the following snippet:

       When('於 {int} 點時工作', function (int) {
         // Write code here that turns the phrase above into concrete actions
         return 'pending';
       });
```

表示有兩個步驟沒有實作，這時請依據這個步驟是不是共用步驟決定要放置到那個檔案。
 * 共用步驟：不同類別的測試案例會共同使用到的步驟請放到 common-steps.js
 * 非共用步驟：只有在特定類別的測試案例會使用到，請依照分類放置於不同的 xxx-steps.js 檔案，沒有相關類別就開一個新檔案。

寫法可以參照 [retirement-steps.js](features/step_definitions/retirement-steps.js)

```javascript
import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

defineSupportCode(function ({ Given, When, Then }) {
  When('驗證退休資格時', function () {
    this.labor.onBoard(new Date(2017 - this.workYears, 6, 1))
    this.result = this.labor.retire(new Date(2017, 6, 1))
  })

  Then('他 可 申請退休', function () {
    expect(this.result.value.retirement).eq(true)
  })

  Then('他 不可 申請退休', function () {
    expect(this.result.value.retirement).eq(false)
  })
})
```

更多範例請至 [step_definitions](features/step_definitions) 閱讀。

# 實作 API

完成前面的步驟後，你可以開始到 [src](src) 目錄底下針對你有使用到的源碼修改，修改完成後請執行 `npm test` 確認所有測試案例都可以通過測試。

測試完成後，請發 pull request，團隊成員將會視情況合併你的修改，也謝謝你的貢獻！
