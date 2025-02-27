import { Tree  } from "../../utility/Tree.js";

/**
 *【 觸發事件】預設空樹狀圖 
 * @description 新增完之後還要移除最末端連結線
 * @return {Object}  初始的樹狀資料物件
 */
export function createTriggerEventDefaultTree(depth = 1) {  
  let nodeId = null
  const treeData = new Tree(0, {
    attr: "intention",
    title: "選擇意圖",
    data: {}, //自訂的節點的資料
    depth: depth, //節點深度(必要)
    
  });
  treeData.insert(0, null, {
    attr: "starter",
    title: "選擇前菜",
    data: {},
    depth: depth +1 ,
    
  });
  treeData.insert(0, null, {
    attr: "starter",
    title: "選擇前菜",
    data: {},
    depth: depth +1 ,
    
  });
  treeData.insert(1, null, {
    attr: "template",
    title: "填入模板",
    data: {},
    depth: depth + 2,
    
  });
  treeData.insert(2, null, {
    attr: "template",
    title: "填入模板",
    data: {},
    depth: depth +2,    
  });
   nodeId = treeData.getLastNodeId() //模板的節點Id
   treeData.insert(nodeId, null, {
    attr: "meat",
    title: "選擇主菜",
    data: {},
    depth: depth +2,    
  });
  
  treeData.insert(3, null, {
    attr: "wether_no",
    title: "否",
    data: {},
    depth: depth +3,    
  });
  nodeId = treeData.getLastNodeId() //模板的節點Id
  treeData.insert(nodeId, null, {
    attr: "template",
    title: "填入模板",
    data: {},
    depth: depth +3,    
  });
  treeData.insert(3, null, {
    attr: "wether_yes",
    title: "是",
    data: {},
    depth: depth +3,    
  });
  nodeId = treeData.getLastNodeId() //模板的節點Id
  treeData.insert(nodeId, null, {
    attr: "template",
    title: "填入模板",
    data: {},
    depth: depth +3,    
  });
  treeData.finalLeafConnectLine()
  return treeData;
}




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