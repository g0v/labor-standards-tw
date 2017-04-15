# labor-standards-tw

台灣勞動基準法的函式庫，可用於計算加班費、特休假、確認班表是否違法等。

## 開發環境

本專案使用 node.js v6 LTS，如果你有許多專案使用不同版本的 node.js，推薦你使用 [nvm](https://github.com/creationix/nvm)

## 開發狀況與如何貢獻

本專案目前正草創階段。目前可以分成幾個階段：

1. 撰寫只有敘述的 test case （目前在這個階段）
2. 撰寫 API 的使用方法
3. 實作 API

其中第一個階段不需要有程式基礎，也歡迎大家在各個階段送 pull request，若有任何疑問，請 [登錄 g0v 的 slack](http://join.g0v.today/) 並且加入 #labor 頻道。

### 撰寫只有敘述的 test case

剛開始還沒確定如何實作時，可以先從只有敘述的測試案例開始，比如說你想要寫跟休息日相關的測試案例，可以明確的給定輸入：
* 平均時薪，例如 150
* 休息日的上班時數，例如 2 個小時

以及明確的輸出：
* 實領加班費，例如 900 元

依照這些輸入輸出，寫成一個只有敘述的測試案例：

```javascript
it('月薪制勞工, 平均時薪 150 工作 2 小時，實領加班費為 900 元（勞基法 24 條）');
```

並且寫在相對應的測試檔案中，依照這個例子應被放置於 [pays.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/pays.test.js) 當中。

依照不同的案例類型依照勞基法的大項分類，可以把你的測試放在不同位置：

主要目標：
* 工資：[pays.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/pays.test.js)
* 工作時間、休息、休假：[workinghours-recess-holidaysleaves.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/workinghours-recess-holidaysleaves.test.js)
* 變形工時：[transformed-workshift.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/transformed-workshift.test.js)

次要目標：
* 勞資會議：[labor-meeting.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/labor-meeting.test.js)
* 女工與童工：[children-female-protection.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/children-female-protection.test.js)
* 職業災害補償：[workers-compensation.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/workers-compensation.test.js)
* 工作規則：[workers-rules.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/workers-rules.test.js)
* 勞動契約：[labor-contract.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/labor-contract.test.js)


### 撰寫 API 的使用方法

當已經有只有敘述的測試案例後，接下來則是要設計這個測試案例在此函式庫裡面有如何使用。比如說舉上面這個例子：

```javascript
it('月薪制勞工, 平均時薪 150 工作 2 小時，實領加班費為 900 元（勞基法 24 條）');
```

這個例子是要計算加班費，所以可能會需要一個 API `overtimePay()` 來取得加班費，並且需要輸入平均時薪、時數與假別，所以這個 API 就可能可以如此設計：

```javascript
it('月薪制勞工, 平均時薪 150 工作 2 小時，實領加班費為 900 元（勞基法 24 條）', () => {
  let result = std.overtimePay(150, 2, std.REST_DAY);
  expect(result.value).eq(900);
  expect(result.reference[0].id).eq('LSA-24');
});
```

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

另外如果想要邊修改邊看測試狀況，在存檔後就自動執行測試，可以用以下指令：

```
npm test -- -w -G
```

### 如何貢獻

如果你發現程式碼有錯誤，或任何需要改進的地方，請到 [issues](https://github.com/yurenju/labor-standards-tw/issues) 頁面開一個新的 issue。如果您想要參與開發，你可以依照本節前面提到的步驟，撰寫只有敘述的測試案例、設計 API 與實作 API。不過目前的階段比較適合先執行 (1), (2) 步驟，大多數的 API 設計好之後再一起開始實作比較不會因為設計變更跟著實作一起修改。

若要提交你的修改，請送 pull request 到本專案，travis-ci 上面會有基本的語法與 coding style 檢查後，接著經由團隊成員審核後就會將您的變更合併入專案當中。

## 相關資訊

* [活動共筆：從砍七天假爭議談勞基法工時規定](https://g0v.hackpad.com/3hMbxYbFCxv)
* [2016工時制度及工作彈性化措施手冊彈性化措施手冊(勞動部)](http://www.mol.gov.tw/topic/3067/14530/14533/)
* [2016勞動法令&實務彙編(台北市勞工局)](http://bola.gov.taipei/lp.asp?ctNode=62983&CtUnit=34049&BaseDSD=7&mp=116003)

## 授權

本專案依照 [MIT 授權](https://github.com/yurenju/labor-standards-tw/blob/master/LICENSE) 釋出，若需使用請確保您的使用方式符合 MIT 授權。
