#language: zh-TW

功能: 工作時間
  場景: 工作十小時
    假設 正常工時情況下
    當 勞工於一天內工作 10 小時
    而且 計算工作時間時
    那麼 8 小時是正常工時
    而且 2 小時是加班

  場景: 工作十二小時
    假設 正常工時情況下
    當 勞工於一天內工作 12 小時
    而且 計算工作時間時
    那麼 8 小時是正常工時
    而且 4 小時是加班

  場景: 工作十五小時
    假設 正常工時情況下
    當 勞工於一天內工作 15 小時
    而且 計算工作時間時
    那麼 8 小時是正常工時
    而且 7 小時是加班
    而且 違反勞基法 32 條
    並且 根據 "勞基法 79 條" 罰款 20000 至 100000 元

  場景: 休息時間
    假設 正常工時情況下
    當 勞工於一天內工作 15 小時
    而且 計算休息時間時
    那麼 根據勞基法 35 條
    並且 有 1 小時的休息時間
