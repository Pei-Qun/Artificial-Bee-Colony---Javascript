let NP = 40;            // 種族的規模，採蜜蜂+觀察蜂
let FoodNumber = NP/2;  // 食物的數量
let limit = 20;         // 限度，超過這個限度沒有更新採蜜蜂便偵查蜂
let maxCycle = 10000;   // 停止條件
let iterations = 0    // 目前跌代次數
let chartData = []    // 圖表


/***** 函數的特定參數 *****/
const D = 2;      // 函数的參數個數
const lb = -100;  // 函数的下界 
const ub = 100;   // 函数的上界

let NectarSource = [];    // 蜜源，注意：一切的修改都是針對蜜源而言的
let EmployedBee = [];     // 工蜂
let OnLooker = [];        // 觀察蜂
let BestSource = {};      // 紀錄最好蜜源
BestSource.code = [];