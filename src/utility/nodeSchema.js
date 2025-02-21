import { Tree } from "./Tree.js";


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

export const fakeScript = {
  _id: "3e0ba3cff2b92d66a811c09f",
  cdb_id: "first-cdp-dev",
  name: "端午節吃粽子，越吃越重",
  state: "draft",
  flows: [
    {
      id: 0,
      parent_id: "",
      action: "",
      event: "register",
      is_yes: "",
      template: {},
      event_time: {},
      send_time: {
        types: "once",
        unit: "day",
        after: 1,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 1,
      parent_id: 0,
      action: "email",
      event: "open",
      is_yes: true,
      template: {
        template_id: "7e0ba963f186dad6e4a6c574",
        template_name: "Jeremy精心設計的模板DX版 copy",
        subject: "test2",
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 5,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 2,
      parent_id: 0,
      action: "sms",
      event: "click",
      is_yes: false,
      template: {
        template_id: "71dab7b7ce9870d56069a842",
        template_name: "Nelson測試用簡訊 copy",
        subject: "",
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 3,
      parent_id: 1,
      action: "email",
      event: "conversion",
      is_yes: true,
      template: {
        template_id: "21ba9ef186c454ceaa5cf1a2",
        template_name: "Nelson展示用模版01 copy",
        subject: "購買促銷-是",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 4,
      parent_id: 1,
      action: "email",
      event: "conversion",
      is_yes: false,
      template: {
        template_id: "c6fad6eb89355daf86ec8f2d",
        template_name: "Nelson展示用模版01 copy",
        subject: "購買促銷-否",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 5,
      parent_id: 2,
      action: "sms",
      event: "click",
      is_yes: true,
      template: {
        template_id: "073f22cec9ffe139c651189b",
        template_name: "Nelson測試用簡訊 copy",
        subject: "",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 6,
      parent_id: 2,
      action: "sms",
      event: "click",
      is_yes: false,
      template: {
        template_id: "b24b2d19af1f9851532142d5",
        template_name: "Nelson測試用簡訊 copy",
        subject: "",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 7,
      parent_id: 3,
      action: "email",
      event: "click",
      is_yes: true,
      template: {
        template_id: "ddf5eb6207a247ff84ad78c0",
        template_name: "Jeremy精心設計的模板DX版 copy",
        subject: "123",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 168,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 8,
      parent_id: 3,
      action: "email",
      event: "click",
      is_yes: false,
      template: {
        template_id: "ec2b3f03ae6f6000d3592e0f",
        template_name: "Jeremy精心設計的模板DX版 copy",
        subject: "【購買後促銷－是否】",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 9,
      parent_id: 4,
      action: "email",
      event: "click",
      is_yes: true,
      template: {
        template_id: "487cfaff74353eecb285eb6d",
        template_name: "Jeremy精心設計的模板DX版 copy",
        subject: "【購買後促銷－否是】",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 10,
      parent_id: 4,
      action: "email",
      event: "click",
      is_yes: false,
      template: {
        template_id: "7a96d22277297586eefa66dc",
        template_name: "Jeremy精心設計的模板DX版 copy",
        subject: "【購買後促銷－否否】",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 11,
      parent_id: 5,
      action: "sms",
      event: "click",
      is_yes: true,
      template: {
        template_id: "2df1af0ccf1041d11d59e450",
        template_name: "傑洛米測試 copy",
        subject: "",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 12,
      parent_id: 5,
      action: "sms",
      event: "click",
      is_yes: false,
      template: {
        template_id: "0a6e0c2697267b97bdc697f3",
        template_name: "傑洛米測試 copy",
        subject: "",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 13,
      parent_id: 6,
      action: "sms",
      event: "click",
      is_yes: true,
      template: {
        template_id: "561b4d8270eac15f415a516f",
        template_name: "傑洛米測試 copy",
        subject: "",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
    {
      id: 14,
      parent_id: 6,
      action: "sms",
      event: "click",
      is_yes: false,
      template: {
        template_id: "d9a2b28dcbb1e6d22fbf3dff",
        template_name: "傑洛米測試 copy",
        subject: "",
      },
      event_time: {
        unit: "hour",
        interval: 3,
      },
      send_time: {
        types: "once",
        unit: "hour",
        after: 3,
        schedule: {
          cron: "",
          start_date: "",
          end_count: 0,
        },
      },
    },
  ],
  sender_settings: {
    sender: "傑洛米",
    source: "nelson@retailingdata.com.tw",
  },
  options: {
    selected_list_id: "acace7de98adee6aq95a3c42f",
    selected_list_name: {
      include: ["測試人員"],
      exclude: [],
    },
    start_date: "2023-04-19",
    end_date: "2023-05-31",
  },
  trigger_settings: {
    event: "register",
    item: "",
    item_name: "",
  },
  update_at: "2023-07-16T11:21:06Z",
  create_at: "2023-07-16T11:21:06Z",
};
// -------------------------------------------
/**
 * 主劇本預設空樹狀圖 2層
 * @return {Object}  樹狀資料物件
 */
export function createMainScriptDefaultTree() {
  /** @constant
    @type {Object} Tree class instance
  */
  const mainScriptTree = new Tree(0, {
    title: "點擊設定事件",
    attr: "trigger",
    data: new triggerNodeSchema(),
    depth: 1,
  });
  mainScriptTree.insert(0, 1, {
    title: "點擊設定事件",
    attr: "response",
    data: new actionNodeSchema(),
    depth: 2,
  });

  mainScriptTree.insert(0, 2, {
    title: "點擊設定事件",
    attr: "response",
    data: new actionNodeSchema(),
    depth: 2,
  });

  return mainScriptTree;
}

/**
 * 觸發事件預設空樹狀圖 3層
 * @return {Object}  樹狀資料物件
 */
export function createTriggerEventDefaultTree() {
  /** @constant
    @type {Object} Tree class instance
  */
  const triggerEventTree = new Tree(0, {
    title: "定期投放",
    attr: "trigger",
    data: new triggerNodeSchema(),
    depth: 1,
  });
  triggerEventTree.insert(0, 1, {
    title: "點擊設定動作",
    attr: "action",
    data: new actionNodeSchema(),
    depth: 2,
  });
  triggerEventTree.insert(1, 3, {
    title: "填入模板",
    attr: "template",
    data: new templateNodeSchema(),
    depth: 3,
  });
  triggerEventTree.insert(0, 2, {
    title: "點擊設定動作",
    attr: "action",
    data: new actionNodeSchema(),
    depth: 2,
  });
  triggerEventTree.insert(2, 4, {
    title: "填入模板",
    attr: "template",
    data: new templateNodeSchema(),
    depth: 3,
  });
  triggerEventTree.finalLeafConnectLine()
  return triggerEventTree;
}
/**
 * 回應事件預設空樹狀圖 5層
 * @return {Object}  樹狀資料物件
 */
export function createResPonseEventDefaultTree() {
  /** @constant
    @type {Object} Tree class instance
  */
  const responseEventTree = new Tree(0, {
    title: "填入模板",
    content: "",
    attr: "template",
    data: new templateNodeSchema(),
    depth: 1,
    disableFocus: true,
  });
  responseEventTree.insert(0, 1, {
    title: "點擊設定事件",
    content: "",
    attr: "response",
    data: new responseNodeSchema(),
    depth: 2,
  });
  responseEventTree.insert(1, 2, {
    title: "是",
    content: "",
    attr: "wether_yes",
    data: new wetherNodeSchema(true),
    depth: 3,
  });
  responseEventTree.insert(1, 3, {
    title: "否",
    content: "",
    attr: "wether_no",
    data: new wetherNodeSchema(false),
    depth: 3,
  });
  responseEventTree.insert(2, 4, {
    title: "點擊設定動作",
    content: "",
    attr: "action",
    data: new actionNodeSchema(),
    depth: 4,
  });
  responseEventTree.insert(4, 6, {
    title: "填入模板",
    content: "",
    attr: "template",
    data: new templateNodeSchema(),
    depth: 4,
  });
  responseEventTree.insert(3, 5, {
    title: "點擊設定動作",
    content: "",
    attr: "action",
    data: new actionNodeSchema(),
    depth: 5,
  });
  responseEventTree.insert(5, 7, {
    title: "填入模板",
    content: "",
    attr: "template",
    data: new templateNodeSchema(),
    depth: 5,
  });

  responseEventTree.finalLeafConnectLine()
  return responseEventTree;
}

/**
 * 觸發事件名稱英文轉中文
 * @param {string} name 事件參數英文名
 * @return {string}  觸發事件名稱顯示中文字串
 */
function switchTriggerName(name) {
  switch (name) {
    case "register":
      return "註冊";
    case "promotion":
      return "購買後促銷";
    default:
      return "定期投放";
  }
}

/**
 * 投放渠道英文轉中文
 * @param {string} name 事件參數英文名
 * @return {string}  投放事件渠道顯示中文字串
 */
function switchActionsName(name) {
  switch (name) {
    case "email":
      return "傳送Email";
    case "sms":
      return "傳送SMS";
    default:
      return "傳送Email";
  }
}

/**
 * 週期投放時間轉換
 * @param {Object} send_time 寄送週期性設定物件
 * @param {string} send_time.types 一次性/週期性/定期投放
 * @param {string} send_time.unit 寄送時間單位
 * @param {number} send_time.after 寄送時間
 * @param {Object} send_time.optional 寄送週期性設定物件
 * @return {string}  週期應投放顯示字串
 */
export function switchSendTime(send_time) {
  console.log("觸發switchSendTime",send_time)
  const types = send_time?.types || "";
  const unit = send_time?.unit || "";
  const time = send_time?.after || 0;

  switch (unit) {
    case "hour":
      switch (types) {
        case "once":
          return `${time}小時後/一次性`;
        case "schedule":
          return `每${time}小時/週期性`;
        case "regular":
          return `每${time}小時/定期投放`;
      }
      break;
    case "day":
      switch (types) {
        case "once":
          return `${time}天後/一次性`;
        case "schedule":
          return `每${time}天/週期性`;
        case "regular":
          return `每${time}天/定期投放`;
      }
      break;
    case "week":
      switch (types) {
        case "once":
          return `${time}週後/一次性`;
        case "schedule":
          return `每${time}週/週期性`;
        case "regular":
          return `每${time}週/定期投放`;
      }
      break;
    case "month":
      switch (types) {
        case "once":
          return `${time}月後/一次性`;
        case "schedule":
          return `每${time}月/週期性`;
        case "regular":
          return `每${time}月/定期投放`;
      }
      break;
    case "year":
      switch (types) {
        case "once":
          return `${time}年後/一次性`;
        case "schedule":
          return `每${time}年/週期性`;
        case "regular":
          return `每${time}年/定期投放`;
      }
      break;
    default:
      return ``;
  }
}
/**
 * 回應事件時間投放轉換
 * @param {Object} event_time 回應事件時間投放轉換物件
 * @param {string} event_time.unit 時間單位 天/小時
 * @param {number} event_time.interval 時間
 * @return {string}  回應事件時間顯示字串
 */
export function switchEventTime(event_time) {
  console.log("switch event_time",event_time)
  const unit = event_time?.unit || "";
  const interval = event_time?.interval || 0;
  switch (unit) {
    case "hour":
      return `${interval}小時內`;
    case "day":
      return `${interval}天內`;
    case "天內":
        return `${interval}天內`;
    default:
      return ``;
  }
}
/**
 * 投放事件渠道
 * @param {string} name 事件參數英文名
 * @return {string}  投放事件渠道顯示中文字串
 */
function switchEventsName(name) {
  const event = name?.split("-")?.[0] || ""; // 預設值避免error
  const channel = name?.split("-")?.[1] || ""; // 預設值避免error
  switch (event) {
    case "open":
      return `開啟信件-${channel}`;
    case "click":
      return `點擊連結-${channel}`;
    case "conversion":
      return `轉換-${channel}`;
    default:
      return "開啟信件";
  }
}
/**
 * 依據api既有劇本資料，形成觸發事件預覽tree
 * @param {Array} flowData API劇本 flows 陣列
 * @return {Object} 觸發事件預覽樹
 */
function createPreviewTriggerEvent(flowData) {
  const tree = createTriggerEventDefaultTree();
  const flow_0 = flowData[0];
  const flow_1 = flowData[1];
  const flow_2 = flowData[2];
  // 觸發事件
  tree.find(0).value.data = {
    ...tree.find(0).value.data,
    event: switchTriggerName(flow_0?.event),
    send_time: flow_0?.send_time,
  };
  // 投放渠道
  tree.find(1).value.data = {
    ...tree.find(1).value.data,
    action: switchActionsName(flow_1?.action),
    send_time: flow_1?.send_time,
  };
  // 模板
  tree.find(3).value.data = {
    ...tree.find(3).value.data,
    template: flow_1?.template,
  };
  // 投放渠道
  tree.find(2).value.data = {
    ...tree.find(2).value.data,
    action: switchActionsName(flow_2?.action),
    send_time: flow_2?.send_time,
  };
  // 模板
  tree.find(4).value.data = {
    ...tree.find(4).value.data,
    template: flow_2?.template,
  };
  return tree;
}
/* group by id flow*/
function groupByFlow(flowArray) {
  // 依據parent id收成一組陣列
  const grouped = {};
  flowArray.forEach((flow) => {
    const grouped_property = flow?.parent_id ? flow?.parent_id : 0;
    if (!grouped[grouped_property]) {
      grouped[grouped_property] = [];
    }
    grouped[grouped_property].push(flow);
  });
  return grouped;
}
// 找出parent_id 模板資訊
function get_parent_object_by_id(parent_id, flowDataArray) {
  const parent_object = flowDataArray.find((item) => item.id === parent_id);
  return parent_object;
}
/* flow 主劇本回應事件節點使用*/
function createPreviewResponseEvent(flowArray) {
  // 創建樹狀圖
  const tree = createResPonseEventDefaultTree();
  // 取得上一樣板和回應事件選項
  const parent_id = flowArray?.[0]?.parent_id;
  const upper_template_obj = get_parent_object_by_id(
    parent_id,
    fakeScript?.flows
  )?.template;
  // ex: 點擊連結-sms 點擊連結-email 需靠後墜區分渠道
  const response_event = flowArray?.[0]?.event + "-" + flowArray?.[0]?.action;
  const response_time = flowArray?.[0]?.event_time;

  tree.find(0).value.data = {
    ...tree.find(0).value.data,
    template: upper_template_obj,
  };
  // 回應資料設定
  tree.find(1).value.data = {
    ...tree.find(1).value.data,
    event: switchEventsName(response_event),
    event_time: response_time,
  };

  // 是節點flow--------------
  const is_yes_flowData = flowArray.find((flow) => flow.is_yes === true);
  tree.find(2).value.data = {
    ...tree.find(2).value.data,
    is_yes: "是",
  };
  // 投放渠道資料設定
  tree.find(4).value.data = {
    ...tree.find(4).value.data,
    action: switchActionsName(is_yes_flowData?.action),
    send_time: is_yes_flowData?.send_time,
  };
  // 樣板資料設定
  tree.find(6).value.data = {
    ...tree.find(6).value.data,
    template: is_yes_flowData?.template,
  };

  // 否節點flow
  const is_no_flowData = flowArray.find((flow) => flow.is_yes === false);
  tree.find(3).value.data = {
    ...tree.find(3).value.data,
    is_yes: "否",
  };
  // 投放渠道資料設定
  tree.find(5).value.data = {
    ...tree.find(5).value.data,
    action: switchActionsName(is_no_flowData?.action),
    send_time: is_yes_flowData?.send_time,
  };
  // 樣板資料設定
  tree.find(7).value.data = {
    ...tree.find(7).value.data,
    template: is_no_flowData?.template,
  };
  return tree;
}

/* flow id 0~2 主劇本觸發事件節點使用*/
export function composeTriggerEventFromAPI(flowArray) {
  // id 0~15 升冪排列
  flowArray.sort((a, b) => a?.id - b?.id);
  // flow 分組
  const groupFlowArray = groupByFlow(flowArray);
  const apiTreeNode = {};
  // 產生回應事件api資料block
  for (const index in groupFlowArray) {
    if (index === "0") {
      const preview_triggerEvent = createPreviewTriggerEvent(groupFlowArray[0]);
      apiTreeNode["0"] = preview_triggerEvent;
    } else
      apiTreeNode[index] = createPreviewResponseEvent(groupFlowArray[index]);
  }
  console.log("依據parent id聚合完的flow", groupFlowArray);
  console.log("api apiTreeNode", apiTreeNode);
  return apiTreeNode;
}
