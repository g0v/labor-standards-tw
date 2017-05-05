# labor-standards-tw

台灣勞動基準法的函式庫，可用於計算加班費、特休假、確認班表是否違法等。

## 開發環境

本專案使用 node.js v6 LTS，如果你有許多專案使用不同版本的 node.js，推薦你使用 [nvm](https://github.com/creationix/nvm)

## 開發狀況與如何貢獻

本專案目前正草創階段。目前可以分成幾個階段：

1. 撰寫測試案例 （目前在這個階段）
2. 撰寫 API 的使用方法
3. 實作 API

其中第一個階段不需要有程式基礎，也歡迎大家在各個階段送 pull request，若有任何疑問，請 [登錄 g0v 的 slack](http://join.g0v.today/) 並且加入 #labor 頻道。

### 如何撰寫測試案例

目前測試案例分門別類地放在 [features 目錄](features) 底下
* [children.feature](features/children.feature): 兒童勞工相關規定
* [female.feature](features/female.feature): 女性勞工相關規定
* [overtime-pay.feature](features/overtime-pay.feature): 加班費計算
* [paid-leaves.feature](features/paid-leaves.feature): 特休
* [pays.feature](features/pays.feature): 工資
* [retirement.feature](features/retirement.feature): 退休
* [transformed-workshit.feature](features/transformed-workshit.feature): 變形工時
* [workhours.feature](features/workhours.feature): 工作時間

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

更多例子請到 features 目錄底下閱讀。如果你沒有使用 github 的經驗，也可以在 [這份文件](https://hackmd.io/c/SJES19Fy-/) 寫下測試案例，團隊成員會不定期把那些測試案例記錄到系統裡面。

### 撰寫 API 的使用方法

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
const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  When('驗證退休資格時', function () {
    this.result = std.retire(this.age)
  })

  Then('他 可 申請退休', function () {
    expect(this.result.value).eq(true)
  })

  Then('他 不可 申請退休', function () {
    expect(this.result.value).eq(false)
  })
})
```

更多範例請至 [step_definitions](features/step_definitions) 閱讀。

### 實作 API

完成前面一、二步驟後，整個函式庫的設計也完成了，接下來只要將所有依照步驟二設計的 API 與測試全部實作即可。

首先用以下指令安裝相依性：

```
npm install
```

接下來使用以下指令執行測試：

```
npm test
```

剛開始大多數的測試案例都會失敗，隨著大家把每個 API 都實作完成後，測試案例的完成度就會愈來愈高，達 100% 後就完成了整個函式庫的實作。

### 如何貢獻

如果你發現程式碼有錯誤，或任何需要改進的地方，請到 [issues](https://github.com/g0v/labor-standards-tw/issues) 頁面開一個新的 issue。如果您想要參與開發，你可以依照本節前面提到的步驟，撰寫只有敘述的測試案例、設計 API 與實作 API。不過目前的階段比較適合先執行 (1), (2) 步驟，大多數的 API 設計好之後再一起開始實作比較不會因為設計變更跟著實作一起修改。

若要提交你的修改，請送 pull request 到本專案，travis-ci 上面會有基本的語法與 coding style 檢查後，接著經由團隊成員審核後就會將您的變更合併入專案當中。

若你想要貢獻測試案例但並不習慣使用 Github，請參照 如何撰寫測試案例 並且將測試案例寫在上述所提及的文件內。

## 相關資訊

* [活動共筆：從砍七天假爭議談勞基法工時規定](https://g0v.hackpad.com/3hMbxYbFCxv)
* [2016工時制度及工作彈性化措施手冊彈性化措施手冊(勞動部)](http://www.mol.gov.tw/topic/3067/14530/14533/)
* [2016勞動法令&實務彙編(台北市勞工局)](http://bola.gov.taipei/lp.asp?ctNode=62983&CtUnit=34049&BaseDSD=7&mp=116003)

## 授權

本專案依照 [MIT 授權](https://github.com/g0v/labor-standards-tw/blob/master/LICENSE) 釋出，若需使用請確保您的使用方式符合 MIT 授權。
