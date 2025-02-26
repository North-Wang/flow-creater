import { Tree  } from "../../utility/Tree.js";
import { ref,computed } from "vue";
import iconSignUp from "../../assets/icons/sign-up.svg";
import iconAfterSales from "../../assets/icons/after-sales.svg";
import iconShoppingCar from "../../assets/icons/shopping-car.svg";
import iconCycleTime from "../../assets/icons/cycle-time.svg";
import iconSendEmail from "../../assets/icons/send-email.svg";
import iconSendSms from "../../assets/icons/send-sms.svg";

/**
 *【 觸發事件】預設空樹狀圖 
 * @description 新增完之後還要移除最末端連結線
 * @return {Object}  初始的樹狀資料物件
 */
export function createTriggerEventDefaultTree(depth = 1) {  
 
  const triggerEventTree = new Tree(0, {
    attr: "trigger",
    title: "點擊設定事件",
    data: new triggerNodeSchema(), //自訂的節點的資料
    depth: depth, //節點深度(必要)
    
  });
  triggerEventTree.insert(0, null, {
    attr: "wether_yes",
    title: "是",
    data: {},
    depth: depth +1 ,
    
  });
  triggerEventTree.insert(0, null, {
    attr: "wether_no",
    title: "否",
    data: {},
    depth: depth +1 ,
    
  });
  triggerEventTree.insert(1, null, {
    attr: "action",
    title: "點擊設定動作",
    data: new actionNodeSchema(),
    depth: depth + 2,
    
  });
  triggerEventTree.insert(2, null, {
    attr: "action",
    title: "點擊設定動作",
    data: new actionNodeSchema(),
    depth: depth +2,
    
  });
  triggerEventTree.insert(3, null, {
    attr: "template",
    title: "插入模板",
    data: new templateNodeSchema(),
    depth: depth +3,
    
  });
  triggerEventTree.insert(4, null, {
    attr: "template",
    title: "插入模板",
    data: new templateNodeSchema(),
    depth: depth +3,
    
  });
  triggerEventTree.finalLeafConnectLine()
  return triggerEventTree;
}

/**
 * 【回應事件】預設空樹狀圖
 * @description 從【模板節點】新增下一層資料時，要新增的樹狀物件
 * @deprecated 新的節點 ID 會比先前所有的 ID 都大
 * @description 新增完之後還要移除最末端連結線
 * @param {Number} depth 新的樹狀物件的根節點在第幾層 
 * @param {Number} id 父節點的id 
 */
export function createResponseEventDefaultTree(treeData, depth, id) {    
  try {
    if(!treeData) throw new Error("未設定哪個節點要新增");
    if(!id) throw new Error("未設定父層的節點id");
    if(!depth) throw new Error("是預設的層數");
    treeData.insert(id, null, {
      title: "設定回應事件",
      attr: "response",
      data: new responseNodeSchema(),
      depth: depth,
    });
    const nodeIdResponseEvent = treeData.getLastNodeId()  //回應事件的節點Id
    treeData.insert(nodeIdResponseEvent, null, {
      title: "是",
      attr: "wether_yes",
      data:{},
      depth: depth+1,    
    });
    const nodeIdYes = treeData.getLastNodeId() //yes的節點Id
    treeData.insert(nodeIdResponseEvent, null, {
      title: "否",
      attr: "wether_no",
      data:{},
      depth: depth+1,    
    });
    const nodeIdNo = treeData.getLastNodeId() //no的節點Id
    treeData.insert(nodeIdYes, null, {
      title: "點擊設定動作",
      attr: "action",
      data:new actionNodeSchema(),
      depth: depth+2,    
    });
    let nodeIdTemplate = treeData.getLastNodeId() //模板的節點Id
    treeData.insert(nodeIdTemplate, null, {
      title: "插入模板",
      attr: "template",
      data:new templateNodeSchema(),
      depth: depth+2,    
    });
    treeData.insert(nodeIdNo, null, {
      title: "點擊設定動作",
      attr: "action",
      data:new actionNodeSchema(),
      depth: depth+2,    
    });
    nodeIdTemplate = treeData.getLastNodeId() //模板的節點Id
    treeData.insert(nodeIdTemplate, null, {
      title: "插入模板",
      attr: "template",
      data:new templateNodeSchema(),
      depth: depth+2,    
    });
    } catch (error) {
      console.warn("新增回應事件樹狀圖 失敗", error)
    }  
    treeData.finalLeafConnectLine()
    return treeData;

}

/**
 * 「節點種類」與「工具列選項」與「icon」的對照表
 */
export class iconMap {
  constructor(){
    // 「節點種類」與工具列的選項
    this.nodeToolbarMap = {
      "trigger":{
        "註冊": iconSignUp,
        "購物車未結": iconAfterSales,
        "購買後促銷": iconShoppingCar,
        "定期投放": iconCycleTime
      },
      "action":{
        "傳送Email": iconSendEmail,
        "傳送SMS": iconSendSms,
      }
    }
    // 「節點選項」與對應的icon
    this.nodeIconMap = {
       "註冊": iconSignUp,
        "購物車未結": iconAfterSales,
        "購買後促銷": iconShoppingCar,
        "定期投放": iconCycleTime,
        "傳送Email": iconSendEmail,
        "傳送SMS": iconSendSms,
    }
  }
  //根據節點的種類，回傳工具列選項
  returnToolbarOptions(nodeType){
    const options = this.nodeToolbarMap[nodeType] || []
    return options
  }
}
/**
 * 「節點種類」與工具列的選項
 */
// const nodeToolbarMap = ref({
//   "trigger":{
//     "註冊": iconSignUp,
//     "購物車未結": iconAfterSales,
//     "購買後促銷": iconShoppingCar,
//     "定期投放": iconCycleTime
//   },
//   "action":{
//     "傳送Email": iconSendEmail,
//     "傳送SMS": iconSendSms,
//   }
// })
// 「節點選項」與icon的對照表
// export const nodeIconMap = computed(()=>{
//   return Object.assign({}, ...Object.values(nodeToolbarMap.value).map(opt => ({ ...opt })))
// })
// /**
//  * 根據「節點種類」回傳對應的工具列選項
//  * @param {String} nodeType 
//  * @param {String} value 
//  */
// export function returnToolbarOptions(nodeType, value) {
//   /**
//    * @constant nodeToolbarMap 各種節點的選項
//    */ 
//   const options = nodeToolbarMap.value[nodeType] || []
//   return options
// }


// 劇本節點參數名稱schema
// 觸發事件
export class triggerNodeSchema {
  constructor() {
    this.event = "";
    this.send_time = {
      types: "",
      unit: "",
      after: "",
      schedule: {
        cron: "",
        start_date: "",
        end_count: "",
      },
    };
  }
}
// 投放種類
export class actionNodeSchema {
  constructor() {
    this.action = "";
    this.send_time = {
      types: "",
      unit: "",
      after: "",
      schedule: {
        cron: "",
        start_date: "",
        end_count: "",
      },
    };
  }
}
// 模板
export class templateNodeSchema {
  constructor() {
    this.template = {
      template_id: "",
      template_name: "",
      subject: "",
    };
  }
}
// 是/否
export class wetherNodeSchema {
  constructor(yes) {
    this.is_yes = yes;
  }
}
export class responseNodeSchema {
  constructor() {
    this.action = "";
    this.event_time = {
      unit: "",
      interval: "",
    };
  }
}