/* 原點的task */
export const elements1 = [
  {
    "id": "task-001",
    "reaction": "trigger",
    "sourceId": null,
    "targetId": "task-002",
    "eventOption": {
      "type": "register"
    },
    "schedule": {
      "type": "once",
      "time": {
        "once": "2025-06-11T09:00:00Z"
      }
    },
    "template": {
      "type": "email",
      "id": "template-001",
      "subject": "歡迎註冊通知"
    }
  },
  {
    "id": "task-002",
    "reaction": "response",
    "sourceId": "task-001",
    "targetId": "task-003",
    "eventOption": {
      "type": "click"
    },
    "schedule": {
      "type": "cycle",
      "time": {
        "cron": "0 0 9 * * *" // 每天上午 9:00 觸發
      }
    },
    "template": {
      "type": "sms",
      "id": "template-002",
      "subject": "點擊後提醒"
    }
  },
  {
    "id": "task-003",
    "reaction": "response",
    "sourceId": "task-002",
    "targetId": "task-004",
    "eventOption": {
      "type": "open"
    },
    "schedule": {
      "type": "once",
      "time": {
        "once": "2025-06-12T14:30:00Z"
      }
    },
    "template": {
      "type": "email",
      "id": "template-003",
      "subject": "感謝開啟信件"
    }
  }
]
export const task1 ={
  "id": "task-001",
  "reaction": "trigger",
  "sourceId": null,
  "targetId": "task-002",
  "eventOption": {
    "type": "register"
  },
  "schedule": {
    "type": "once",
    "time": {
      "once": "2025-06-11T09:00:00Z"
    }
  },
  "template": {
    "type": "email",
    "id": "template-001",
    "subject": "歡迎註冊通知"
  }
}
export const task2 = {
  "id": "task-002",
  "reaction": "response",
  "sourceId": "task-001",
  "targetId": "task-003",
  "eventOption": {
    "type": "click"
  },
  "schedule": {
    "type": "cycle",
    "time": {
      "cron": "0 0 9 * * *" // 每天上午 9:00 觸發
    }
  },
  "template": {
    "type": "sms",
    "id": "template-002",
    "subject": "點擊後提醒"
  }
}
export const task3 = {
  "id": "task-003",
  "reaction": "response",
  "sourceId": "task-002",
  "targetId": "task-004",
  "eventOption": {
    "type": "open"
  },
  "schedule": {
    "type": "once",
    "time": {
      "once": "2025-06-12T14:30:00Z"
    }
  },
  "template": {
    "type": "email",
    "id": "template-003",
    "subject": "感謝開啟信件"
  }
}