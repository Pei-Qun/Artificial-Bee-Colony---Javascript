# Artificial Bee Colony - Javascript
## 使用 Javascript 實現人工蜂群算法

展示連結：[Github Page URL](https://pei-qun.github.io/Artificial-Bee-Colony---Javascript/)

### 介紹
> 蜂群最佳化演算法是一種模仿生物的演算法，藉由模擬自然界蜜蜂的覓食行為加以模型化而成
> 在蜂群演算法最佳化的過程中，工蜂會於蜂巢的資訊分享區跳舞來分享花蜜的多寡、距離和方向
> 觀察蜂依照工蜂提供的訊息前往實務員搜索

### Variable
#### 全域
| Variable | content | type |
| ------ | ------ | ------ |
| NP | 種族的規模，採蜜蜂+觀察蜂 | int |
| FoodNumber | 食物的數量 | int |
| limit | 限度 | int |
| maxCycle | 停止條件 | int |
| D | 函数的參數個數 | int |
| lb | 函数的下界 | int |
| ub | 函数的上界 | int |

#### 清單
| Variable | content |
| ------ | ------ |
| NectarSource | 蜜源 |
| EmployedBee | 工蜂 |
| OnLooker | 觀察蜂 |
| BestSource | 紀錄最好蜜源 |

#### 區域
| Variable | content |
| ------ | ------ |
| code | 函數的維數 |
| trueFit | 紀錄真實的收益度 |
| fitness | 適應值 |
| rfitness | 輪盤的選擇概率 |
| trail | 表示實驗的次數 |

### Functions
| Function | content |
| ------ | ------ |
| `random()` | 隨機產生區間內的隨機數值 (max不包括) |
| `initilize()` | 初始化參數 |
| `calculationTruefit()` | 計算真實收益度的函數值 |
| `calculationFitness()` | 計算適應值 |
| `CalculateProbabilities()` | 計算輪盤的選擇概率 |
| `sendEmployedBees()` | 修改工蜂的函式 |
| `sendOnlookerBees()` | 工蜂與觀察蜂交流資料，觀察蜂更改資料 |
| `sendScoutBees()` | 判斷是否有偵查蜂的出现，有則重新生成蜜源 |
| `MemorizeBestSource()` | 尋找最優蜜源 |
| `cl()` | console log |
| `ui()` | 產生畫面 |

### Steps
1. 初始化 (`initilize()`)
2. 更新工蜂位置 (`sendEmployedBees()`)
3. 觀察蜂 (`OnLooker[i]`) 決定要到哪一個蜜源 (`NectarSource[i]`)
4. 當任一蜜源 (`NectarSource[i`) 的表示實驗的次數 (`NectarSource[i].trail`) 大於限度 `limit`，則放棄此蜜源，並出動一隻偵查蜂尋找一個新的蜜源
5. 記憶到目前為止收益度最高的蜜源 (`MemorizeBestSource()`)
6. 循環到符合終止條件

### 參考資料
- https://www.pixijs.com/
- https://www.chartjs.org/
- https://blog.csdn.net/wangqing008/article/details/11849255