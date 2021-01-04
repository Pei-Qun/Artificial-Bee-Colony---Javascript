/***** 函式的實現 ****/

let random, floatNumber, initilize, calculationTruefit, calculationFitness, sendEmployedBees, CalculateProbabilities, sendOnlookerBees, sendScoutBees, MemorizeBestSource;

//隨機產生區間內的隨機數值
random = function(min, max) {
  // max（不包括）
  return Math.floor(Math.random() * (max - min)) + min;
}

floatNumber = function(val, idx = 8) {
  return Number(val.toFixed(idx));
}

// 初始化參數
initilize = function() {
  for (let i=0 ; i<FoodNumber ; i++) {
    NectarSource[i] = { code: [] }
    EmployedBee[i] = { code: [] }
    OnLooker[i] = { code: [] }
    for (let j=0; j<D; j++) {
      NectarSource[i].code[j] = random(lb,ub);
      // EmployedBee[i].code[j] = NectarSource[i].code[j];
      EmployedBee[i].code[j] = random(lb,ub);
      // OnLooker[i].code[j] = NectarSource[i].code[j];
      OnLooker[i].code[j] = random(lb,ub);
      // BestSource.code[j] = NectarSource[0].code[j];
      BestSource.code[j] = random(lb,ub);
    }
    /**** 蜜源的初始化 ****/
    NectarSource[i].trueFit = calculationTruefit(NectarSource[i]);
    NectarSource[i].fitness = calculationFitness(NectarSource[i].trueFit);
    NectarSource[i].rfitness = 0;
    NectarSource[i].trail = 0;
    
    /**** 工蜂的初始化 ****/
    EmployedBee[i].trueFit = NectarSource[i].trueFit;
    EmployedBee[i].fitness = NectarSource[i].fitness;
    EmployedBee[i].rfitness = NectarSource[i].rfitness;
    EmployedBee[i].trail = NectarSource[i].trail;
    
    /**** 觀察蜂的初始化 ****/
    OnLooker[i].trueFit = NectarSource[i].trueFit;
    OnLooker[i].fitness = NectarSource[i].fitness;
    OnLooker[i].rfitness = NectarSource[i].rfitness;
    OnLooker[i].trail = NectarSource[i].trail;
  }
  /***** 最優蜜源的初始化 *****/
  BestSource.trueFit = NectarSource[0].trueFit;
  BestSource.fitness = NectarSource[0].fitness;
  BestSource.rfitness = NectarSource[0].rfitness;
  BestSource.trail = NectarSource[0].trail;
  // console.log(NectarSource, EmployedBee, OnLooker, BestSource);
  ui();
}

let calculationTruefit_truefit = 0;
// 計算真實收益度的函數值
calculationTruefit = function(bee)
{
  calculationTruefit_truefit = 0;
  
  /****** 測試函數1 ******/
  calculationTruefit_truefit = 0.5 + 
  (
    Math.sin(
      Math.sqrt(bee.code[0] * bee.code[0] + bee.code[1] * bee.code[1])
    ) * Math.sin(
      Math.sqrt(bee.code[0] * bee.code[0] + bee.code[1] * bee.code[1])
    )-0.5
  ) / (
    (
      1 + 0.001 * (bee.code[0] * bee.code[0] + bee.code[1] * bee.code[1])
    ) * (
      1 + 0.001 * (bee.code[0] * bee.code[0] + bee.code[1] * bee.code[1])
    )
  );

  // console.log("calculationTruefit: ", calculationTruefit_truefit)
  return floatNumber(calculationTruefit_truefit);
}

let calculationFitness_fitnessResult = 0;
// 計算適應值
calculationFitness = function(truefit)
{
  calculationFitness_fitnessResult = 0;
  if (truefit >= 0) {
    calculationFitness_fitnessResult = 1 / (truefit + 1);
  } else {
    calculationFitness_fitnessResult= 1 + Math.abs(truefit);
  }
  return floatNumber(calculationFitness_fitnessResult);
}

let i,k,j,t;
let param2change;               // 需要改變的維數
let Rij;                        // [-1, 1] 之间的隨機數
// 修改工蜂的函式
sendEmployedBees = function() {
  for (i = 0; i < FoodNumber; i++) {
    param2change = random(0, D);  //隨機選取需要改變的維數
 
    /****** 選取不等於 i 的 k ********/
    while (1) {
      k = random(0, FoodNumber);
      if (k != i) { break };
    }
 
    for (j = 0; j < D; j++) {
      // 第 i 隻埰蜜蜂的 code = 蜜源 code
      EmployedBee[i].code[j] = NectarSource[i].code[j];
    }
 
    /******* 工蜂去更新資料 *******/
    Rij = random(-100, 100);
    EmployedBee[i].code[param2change] = 
    floatNumber(
      NectarSource[i].code[param2change] + 
      Rij/100 * ( NectarSource[i].code[param2change] - NectarSource[k].code[param2change] )
    );
    
    /******* 判斷是否越界 ********/
    if (EmployedBee[i].code[param2change] > ub) {
      EmployedBee[i].code[param2change] = ub;
    }
    if (EmployedBee[i].code[param2change] < lb) {
      EmployedBee[i].code[param2change] = lb;
    }
    EmployedBee[i].trueFit = calculationTruefit(EmployedBee[i]);
    EmployedBee[i].fitness = calculationFitness(EmployedBee[i].trueFit);
 
    /****** 貪婪選擇策略 *******/
    if (EmployedBee[i].trueFit < NectarSource[i].trueFit) {
      // 如果這隻工蜂的 trueFit < 蜜源 trueFit，蜜源的內容改為這隻工蜂的內容
      for (j=0; j<D; j++) {
        NectarSource[i].code[j] = EmployedBee[i].code[j];
      }
      NectarSource[i].trail = 0;
      NectarSource[i].trueFit = EmployedBee[i].trueFit;
      NectarSource[i].fitness = EmployedBee[i].fitness;
    } else {
      NectarSource[i].trail++;
    }
  }
}

let maxfit;
// 計算輪盤的選擇概率
CalculateProbabilities = function() {
  maxfit = NectarSource[0].fitness;
  // 查詢最大的適應值並儲存於 maxfit 中
  for (i=1; i<FoodNumber; i++) {
    if (NectarSource[i].fitness > maxfit){
      maxfit = NectarSource[i].fitness;
    }
  }
  // 計算相對適應值比例
  for (i=0; i<FoodNumber; i++) {
    NectarSource[i].rfitness = ( 0.9 * (NectarSource[i].fitness/maxfit) ) + 0.1;
  }
}

let R_choosed;    // 被選中的概率
// 工蜂與觀察蜂交流資料，觀察蜂更改資料
sendOnlookerBees = function() {
  i = 0;
  t = 0;
  while(t < FoodNumber)
  {
    R_choosed = Math.random()
    // 根據被選擇的概率選擇
    if(R_choosed < NectarSource[i].rfitness) {        
      t++;
      param2change = random(0, D);
      
      /****** 選取不等於 i 的 k ********/
      while (1) {
        k = random(0,FoodNumber);
        if (k != i) { break }
      }
 
      for( j=0; j<D; j++) {
        // 交換訊息
        OnLooker[i].code[j] = NectarSource[i].code[j];
      }
      
      /****更新觀察蜂資料******/
      Rij = random(-100, 100);
      OnLooker[i].code[param2change] = 
      floatNumber(
        NectarSource[i].code[param2change] + 
        Rij/100 * ( NectarSource[i].code[param2change] - NectarSource[k].code[param2change] )
      );
      // console.log(OnLooker[i]);
      
      /*******判斷是否越界*******/
      if (OnLooker[i].code[param2change] < lb) {
        OnLooker[i].code[param2change]=lb;
      }
      if (OnLooker[i].code[param2change] > ub) {	
        OnLooker[i].code[param2change]=ub;
      }
      OnLooker[i].trueFit = calculationTruefit(OnLooker[i]);
      OnLooker[i].fitness = calculationFitness(OnLooker[i].trueFit);
      
      /****貪婪選擇策略******/
      if (OnLooker[i].trueFit < NectarSource[i].trueFit) {
      // 如果這隻觀察蜂的 trueFit < 蜜源 trueFit，蜜源的內容改為這隻觀察蜂的內容
        for (j=0; j<D; j++) {
          NectarSource[i].code[j] = OnLooker[i].code[j];
        }
        NectarSource[i].trail = 0;
        NectarSource[i].trueFit = OnLooker[i].trueFit;
        NectarSource[i].fitness = OnLooker[i].fitness;
      } else {
        NectarSource[i].trail++;
      }
    }
    i++;
    if (i == FoodNumber) {
      i = 0;
    }
  }
}


let maxtrialindex;
let R;    // [0,1] 之間的隨機數
/******* 出動偵查蜂 **********/
// 判斷是否有偵查蜂的出现，有則重新生成蜜源
sendScoutBees = function() {
  maxtrialindex = 0;
  // 尋找有最高 trail 的蜜源
	for (i=1; i<FoodNumber; i++) {
		if (NectarSource[i].trail > NectarSource[maxtrialindex].trail) {
			maxtrialindex = i;
		}
	}
	if (NectarSource[maxtrialindex].trail >= limit) {
		/*******重新初始化*********/
		for (j=0; j<D; j++) {
      R = Math.random();
			NectarSource[maxtrialindex].code[j] = parseInt(lb + R * (ub-lb));
		}
		NectarSource[maxtrialindex].trail = 0;
		NectarSource[maxtrialindex].trueFit = calculationTruefit(NectarSource[maxtrialindex]);
    NectarSource[maxtrialindex].fitness = calculationFitness(NectarSource[maxtrialindex].trueFit);
	}
}

// 保存最優蜜源
MemorizeBestSource = function() {
	// let i,j;
	for (i=1; i<FoodNumber; i++)
	{
		if (NectarSource[i].trueFit<BestSource.trueFit) {
			for (j=0; j<D; j++) {
        BestSource.code[j]=NectarSource[i].code[j];
			}
      BestSource.trueFit=NectarSource[i].trueFit;
		}
  }
}

function run() {
  sendEmployedBees();
  CalculateProbabilities();
  sendOnlookerBees();
  MemorizeBestSource();
  sendScoutBees();
  MemorizeBestSource();
  ui();
  console.log(BestSource.trueFit);
}

function cl() {
  console.log(NectarSource, EmployedBee, OnLooker, BestSource);
}

function ui() {
  let transVal = (val) => {
    return `${(val + 100) / 2}%`
    // return `${val / 2}%`
  }
  NectarSource.forEach((item, index) => {
    $('.NectarSource').append(`<li class="style${index}"></li>`)
    $(`.NectarSource li.style${index}`)
      .attr('trueFit', item.trueFit)
      .attr('code', `[${item.code[0]}, ${item.code[1]}]`)
      .css("left", transVal(item.code[0])).css("top", transVal(item.code[1]))
  });
  EmployedBee.forEach((item, index) => {
    $('.EmployedBee').append(`<li class="style${index}"></li>`)
    $(`.EmployedBee li.style${index}`)
      .attr('trueFit', item.trueFit)
      .attr('code', `[${item.code[0]}, ${item.code[1]}]`)
      .css("left", transVal(item.code[0])).css("top", transVal(item.code[1]))
  });
  OnLooker.forEach((item, index) => {
    $('.OnLooker').append(`<li class="style${index}"></li>`)
    $(`.OnLooker li.style${index}`)
      .attr('trueFit', item.trueFit)
      .attr('code', `[${item.code[0]}, ${item.code[1]}]`)
      .css("left", transVal(item.code[0])).css("top", transVal(item.code[1]))
  });
  $('.BestSource li').css("left", transVal(BestSource.code[0])).css("top", transVal(BestSource.code[1]))
}

/*******主函式*******/
$( document ).ready(function() {
  initilize();//初始化
  MemorizeBestSource(); //保存最好的蜜源

  // for(let i=0;i<=100;i++){
  //   run();
  // }
});