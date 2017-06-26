# labor-standards-tw

台灣勞動基準法的函式庫，可用於計算加班費、特休假、確認班表是否違法等。

## 開發環境

本專案使用 node.js v6 LTS，如果你有許多專案使用不同版本的 node.js，推薦你使用 [nvm](https://github.com/creationix/nvm)

## 如何使用

首先可以使用 `npm` 安裝本函式庫：

```shell
npm install g0v/labor-standards-tw --save
```

安裝後，在 node.js 環境底下可以用 `require()` 引入函示庫，如在瀏覽器環境，可以用 webpack 後使用 `import` 語法引入：

```javascript
// for Node.js
const {Labor, WorkTime} = require('labor-standards-tw')

// for Webpack
import {Labor, WorkTime} from 'labor-standards-tw'
```

### Labor class

Labor 類別是本函式庫的基礎，所有功能都圍繞著這個類別。它可以用來設定一個勞工的就職日、月薪、年齡等條件。

```javascript
import { Labor, Gender } from 'labor-standards-tw'

// 一個 20 歲的女性勞工於 2017/3/20 就職，月薪為 24000 元
const labor = new Labor()
labor.setGender(Gender.FEMALE)
     .setAge(20)
     .onBoard(new Date(2017, 4, 20))
     .setMonthlySalary(24000)
```

Labor 類別有兩種類型的 methods，第一種是如上述的一些 setter / getter 可以設定基本資訊，另外一種是依據這些基本資訊計算出更進一步的資訊，第二種類型的 methods 都會回傳 [Result 類別](https://github.com/g0v/labor-standards-tw/blob/master/src/Result.ts)。

```javascript
import { Labor, ChildLaborType } from 'labor-standards-tw'

const labor = new Labor().setAge(15)

// 驗證勞工是否為童工身分
let result = labor.validateChildLabor()

// 根據勞動基準法 44 條，此勞工為合法的童工身分
expect(result.value.legal).eq(true)
expect(result.value.type).eq(ChildLaborType.CHILD_LABOR)
let article = result.according[0]
expect(article.lawTitle).eq('勞動基準法')
expect(article.id).eq('44')

// 如果勞工年齡為 14 歲
result = labor.setAge(14).validateChildLabor()

// 非法
expect(result.value.legal).eq(false)

// 身分為非法勞工
expect(result.value.type).eq(ChildLaborType.ILLEGAL)

// 違反勞基法 44 條
article = result.violations[0]
expect(article.lawTitle).eq('勞動基準法')
expect(article.id).eq('44')

// 有三種可能性的罰則
// 1. 罰款 300,000 以下
// 2. 拘役 6 個月以下
// 3. 前面兩者加起來
const penalty = article.penalize()
expect(penalty.article.id).eq('77')
expect(penalty.possibilities.length).eq(3)
```

更詳細的用法，請參考程式內的 jsdoc 註解，或是 cucumber 的 [測試案例](https://github.com/g0v/labor-standards-tw/tree/master/features/step_definitions)

### 如何貢獻

如果你發現程式碼有錯誤，或任何需要改進的地方，請到 [issues](https://github.com/g0v/labor-standards-tw/issues) 頁面開一個新的 issue。

若要提交你的修改，請送 pull request 到本專案，travis-ci 上面會有基本的語法與 coding style 檢查後，接著經由團隊成員審核後就會將您的變更合併入專案當中。

關於 cucumber 的測試方式，請參考 [test.md](https://github.com/g0v/labor-standards-tw/tree/master/docs/test.md)。

## 相關資訊

* [活動共筆：從砍七天假爭議談勞基法工時規定](https://g0v.hackpad.com/3hMbxYbFCxv)
* [2016工時制度及工作彈性化措施手冊彈性化措施手冊(勞動部)](http://www.mol.gov.tw/topic/3067/14530/14533/)
* [2016勞動法令&實務彙編(台北市勞工局)](http://bola.gov.taipei/lp.asp?ctNode=62983&CtUnit=34049&BaseDSD=7&mp=116003)
* [106年度勞基法新制上路中小企業因應須知](https://law.moeasmea.gov.tw/upload/106%E5%B9%B4%E5%BA%A6%E5%8B%9E%E5%9F%BA%E6%B3%95%E6%96%B0%E5%88%B6%E4%B8%8A%E8%B7%AF%E4%B8%AD%E5%B0%8F%E4%BC%81%E6%A5%AD%E5%9B%A0%E6%87%89%E9%A0%88%E7%9F%A5.pdf)

## 授權

本專案依照 [MIT 授權](https://github.com/g0v/labor-standards-tw/blob/master/LICENSE) 釋出，若需使用請確保您的使用方式符合 MIT 授權。
