/***** 函式的實現 ****/

//隨機產生區間內的隨機數值
function random(min, max) {
  // max（不包括）
  return Math.floor(Math.random() * (max - min)) + min;

  // max（包括）
  // return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 初始化參數
function initilize() {
  for (let i=0 ; i<FoodNumber ; i++) {
    NectarSource[i] = { code: [] }
    EmployedBee[i] = { code: [] }
    OnLooker[i] = { code: [] }
    // BestSource[i] = { code: [] }  //好像不需要先註解
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

// 計算真實收益度的函數值
function calculationTruefit(bee)
{
  let truefit = 0;
  
  /****** 測試函數1 ******/
  truefit = 0.5 + 
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

  // console.log("calculationTruefit: ", truefit)
  return truefit;
}

// 計算適應值
function calculationFitness(truefit)
{
  let fitnessResult = 0;
  if (truefit >= 0) {
    fitnessResult = 1 / (truefit + 1);
  } else {
    fitnessResult= 1 + Math.abs(truefit);
  }
  return fitnessResult;
}

let result22;
/****** 二維三角 ******/
function newPosition(i, k) {
  // 取得 -1 的點
  let newK = []
  for(let xy=0; xy<=1; xy++) {
    if(EmployedBee[k].code[xy] > EmployedBee[i].code[xy]) {
      newK[xy] = EmployedBee[k].code[xy] + Math.abs(EmployedBee[i].code[xy] - EmployedBee[k].code[xy])
    } else {
      newK[xy] = EmployedBee[k].code[xy] - Math.abs(EmployedBee[i].code[xy] - EmployedBee[k].code[xy])
    }
  }

  // A-C, B-c 長度
  let length = [
    Math.abs(EmployedBee[i].code[0] - newK[1]),
    Math.abs(EmployedBee[i].code[1] - newK[0]),
  ]

  // A-B 長度
  let h = Math.sqrt( (length[0] * length[0]) + (length[1] * length[1]) );

  // 隨機段落
  let percentage = random(0, 100)/100;

  // A-B 之間隨機點的長度
  let m = percentage*h

  // 結果
  let result = [
    (h-m)/h*EmployedBee[i].code[0]+m/h*EmployedBee[k].code[0],
    (h-m)/h*EmployedBee[i].code[1]+m/h*EmployedBee[k].code[1],
  ]
  // result22 = {
  //   result: newK,
  //   A: EmployedBee[i].code,
  //   B: EmployedBee[k].code
  // }
  // let transVal = (val) => {
  //   // return `${(val + 100) / 2}%`
  //   return `${val}pt`
  // }
  EmployedBee[i].code[0] = result[0]
  EmployedBee[i].code[1] = result[1]
  // $('.test .A .x').css("left", transVal(result22.A[0])).css("top", transVal(result22.A[1]))
  // $('.test .B .x').css("left", transVal(result22.B[0])).css("top", transVal(result22.B[1]))
  // $('.test .re .x').css("left", transVal(result22.result[0])).css("top", transVal(result22.result[1]))
}

// 修改工蜂的函式
function sendEmployedBees() {
  let k;
  let param2change;               // 需要改變的維數
  let Rij;                        // [-1, 1] 之间的隨機數
  for (let i = 0; i < FoodNumber; i++) {
    param2change = random(0, D);  //隨機選取需要改變的維數
 
    /****** 選取不等於 i 的 k ********/
    while (1) {
      k = random(0, FoodNumber);
      if (k != i) { break };
    }
 
    // for (let j = 0; j < D; j++) {
    //   // 第 i 隻埰蜜蜂的 code = 蜜源 code
    //   EmployedBee[i].code[j] = NectarSource[i].code[j];
    // }
 
    /******* 工蜂去更新資料 *******/
    // Rij = random(-1, 1);
    // EmployedBee[i].code[param2change] = 
    //   NectarSource[i].code[param2change] + 
    //   Rij * ( NectarSource[i].code[param2change] - NectarSource[k].code[param2change] );
    newPosition(i, k)
    // console.log(i, Rij, NectarSource[i].code[param2change] - NectarSource[k].code[param2change])
    
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
      for (let j=0; j<D; j++) {
        NectarSource[i].code[j] = EmployedBee[i].code[j];
      }
      NectarSource[i].trail = 0;
      NectarSource[i].trueFit = EmployedBee[i].trueFit;
      NectarSource[i].fitness = EmployedBee[i].fitness;
      // console.log(i, NectarSource[i]);
    } else {
      NectarSource[i].trail++;
    }
  }
}

// 計算輪盤的選擇概率
function CalculateProbabilities() {
  let maxfit = NectarSource[0].fitness;
  // 查詢最大的適應值並儲存於 maxfit 中
  for (let i=1; i<FoodNumber; i++) {
    if (NectarSource[i].fitness > maxfit){
      maxfit = NectarSource[i].fitness;
    }
  }
  // 計算相對適應值比例
  for (let i=0; i<FoodNumber; i++) {
    NectarSource[i].rfitness = ( 0.9 * (NectarSource[i].fitness/maxfit) ) + 0.1;
  }
}

// 工蜂與觀察蜂交流資料，觀察蜂更改資料
function sendOnlookerBees() {
  let i,j,t,k;
  let R_choosed;    // 被選中的概率
  let param2change; // 需要被改變的維數
  let Rij;          // [-1,1] 之間的隨機數
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
      Rij = random(-1, 1);
      OnLooker[i].code[param2change] = 
        NectarSource[i].code[param2change] + 
        Rij * ( NectarSource[i].code[param2change] - NectarSource[k].code[param2change] );
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

/******* 只有一隻偵查蜂 **********/
// 判斷是否有偵查蜂的出现，有則重新生成蜜源
function sendScoutBees() {
	let maxtrialindex, i, j;
	let R;    // [0,1] 之間的隨機數
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

//尋找最優蜜源
function MemorizeBestSource() {
  let j;
  let indexOfMax = 0;
  let tempMax = NectarSource[0];
	for (let i=0; i<NectarSource.length; i++)
	{
    if(NectarSource[i] > tempMax){
      tempMax = a[i];
      indexOfMax = i;
    }
		// if (NectarSource[i].trueFit<BestSource.trueFit) {
		// 	for (j=0; j<D; j++) {
    //     BestSource.code[j]=NectarSource[i].code[j];
		// 	}
    //   BestSource.trueFit=NectarSource[i].trueFit;
		// }
  }
  BestSource = NectarSource[indexOfMax]
  ui();
}

function run() {
  sendEmployedBees();
  CalculateProbabilities();
  sendOnlookerBees();
  MemorizeBestSource();
  sendScoutBees();
  MemorizeBestSource();
  ui();
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
  run();
});