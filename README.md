# labor-standards-tw

台灣勞動基準法的函式庫，可用於計算加班費、確認班表是否違法等

## 開發狀況與如何貢獻

才剛開始寫 test cases 相當早期。目前可以分成幾個階段：

1. 撰寫只有敘述的 test case
2. 撰寫 API 的使用方法
3. 實作 API

其中第一個階段不需要有程式基礎，也歡迎大家在各個階段送 pull request，若有任何疑問，請 [登錄 g0v 的 slack](http://join.g0v.today/) 並且加入 #labor 頻道。

### 撰寫只有敘述的 test case

剛開始還沒確定如何實作時，可以先從只有敘述的測試案例開始，比如說你想要寫跟休息日相關的測試案例，可以明確的給定輸入：
* 平均時薪，例如 150
* 休息日的上班時數，例如 2 個小時

以及明確的輸出：
* 實領加班費

依照這些輸入輸出，寫成一個只有敘述的測試案例：

```javascript
it('月薪制勞工, 平均時薪 150 工作 2 小時，實領加班費為 900 元（勞基法 24 條）');
```

並且寫在相對應的測試檔案中，依照這個例子應被放置於 [pays.test.js](https://github.com/yurenju/labor-standards-tw/blob/master/test/integration/pays.test.js) 當中。

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


## 相關資訊

* [活動共筆：從砍七天假爭議談勞基法工時規定](https://g0v.hackpad.com/3hMbxYbFCxv)

## 授權

本專案依照 [MIT 授權](https://github.com/yurenju/labor-standards-tw/blob/master/LICENSE) 釋出，若需使用請確保您的使用方式符合 MIT 授權。
