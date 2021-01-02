const NP = 40;            // 種族的規模，採蜜蜂+觀察蜂
const FoodNumber = NP/2;  // 食物的數量
const limit = 20;         // 限度，超過這個限度沒有更新採蜜蜂便偵查蜂
const maxCycle = 10000;   // 停止條件


/***** 函數的特定參數 *****/
const D = 2;      // 函数的參數個數
const lb = -100;  // 函数的下界 
const ub = 100;   // 函数的上界

const result = [];
result[maxCycle] = {};

/***** 種族的定義 *****/
// const BeeGroup = {
//   code: {},
//   trueFit,  // 紀錄真實的收益度
//   fitness,  // 適應值
//   rfitness, // 相對適應值比例
//   trail,    // 表示實驗的次數，用於與 limit 作比较
// }
let code = []             // 函數的維數
let NectarSource = [];    // 蜜源，注意：一切的修改都是針對蜜源而言的
let EmployedBee = [];     // 工蜂
let OnLooker = [];        // 觀察蜂
let BestSource = {};      // 紀錄最好蜜源
BestSource.code = [];