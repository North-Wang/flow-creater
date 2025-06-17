export class ScriptValidator {
  constructor() {
    this.errors = [];
  }

  // 验证整个脚本
  validate(script) {
    this.errors = [];

    if (!script) {
      this.errors.push("脚本数据不能为空");
      return this.errors;
    }

    // 验证基本信息
    this.validateInfo(script.info);

    // 验证发送者信息
    this.validateSenderInfo(script.senderInfo);

    // 验证任务列表
    this.validateTasks(script.task);

    // 验证任务连接
    this.validateConnections(script.task);

    // 验证循环引用
    this.validateCircularReferences(script.task);

    return this.errors;
  }

  // 验证基本信息
  validateInfo(info) {
    if (!info) {
      this.errors.push("脚本基本信息不能为空");
      return;
    }

    if (!info.name || info.name.trim() === "") {
      this.errors.push("脚本名称不能为空");
    }

    if (info.name && info.name.length > 100) {
      this.errors.push("脚本名称不能超过100个字符");
    }

    if (info.time_range) {
      if (info.time_range.start && info.time_range.end) {
        const startTime = new Date(info.time_range.start);
        const endTime = new Date(info.time_range.end);

        if (isNaN(startTime.getTime())) {
          this.errors.push("开始时间格式无效");
        }

        if (isNaN(endTime.getTime())) {
          this.errors.push("结束时间格式无效");
        }

        if (startTime >= endTime) {
          this.errors.push("开始时间必须早于结束时间");
        }
      }
    }

    if (!info.source || !info.source.type) {
      this.errors.push("数据源类型不能为空");
    }
  }

  // 验证发送者信息
  validateSenderInfo(senderInfo) {
    if (!senderInfo) {
      this.errors.push("发送者信息不能为空");
      return;
    }

    if (!senderInfo.sender || senderInfo.sender.trim() === "") {
      this.errors.push("发送者名称不能为空");
    }

    if (!senderInfo.email || senderInfo.email.trim() === "") {
      this.errors.push("发送者邮箱不能为空");
    }

    if (senderInfo.email && !this.isValidEmail(senderInfo.email)) {
      this.errors.push("发送者邮箱格式无效");
    }
  }

  // 验证任务列表
  validateTasks(tasks) {
    if (!Array.isArray(tasks)) {
      this.errors.push("任务列表必须是数组");
      return;
    }

    if (tasks.length === 0) {
      this.errors.push("至少需要一个任务");
      return;
    }

    // 检查任务ID唯一性
    const taskIds = new Set();
    tasks.forEach((task, index) => {
      if (taskIds.has(task.id)) {
        this.errors.push(`任务ID重复: ${task.id}`);
      } else {
        taskIds.add(task.id);
      }

      this.validateTask(task, index);
    });

    // 检查是否有触发事件
    const hasTrigger = tasks.some((task) => task.reaction === "trigger");
    if (!hasTrigger) {
      this.errors.push("至少需要一个触发事件");
    }
  }

  // 验证单个任务
  validateTask(task, index) {
    if (!task.id || task.id.trim() === "") {
      this.errors.push(`任务 ${index + 1}: ID不能为空`);
    }

    if (!task.reaction || !["trigger", "response"].includes(task.reaction)) {
      this.errors.push(
        `任务 ${task.id}: 反应类型必须是 'trigger' 或 'response'`
      );
    }

    // 验证事件选项
    this.validateEventOption(task.eventOption, task.id);

    // 验证排程
    this.validateSchedule(task.schedule, task.id);

    // 验证模板
    this.validateTemplate(task.template, task.id);
  }

  // 验证事件选项
  validateEventOption(eventOption, taskId) {
    if (!eventOption) {
      this.errors.push(`任务 ${taskId}: 事件选项不能为空`);
      return;
    }

    if (!eventOption.type || eventOption.type.trim() === "") {
      this.errors.push(`任务 ${taskId}: 事件类型不能为空`);
    }

    // 验证特定事件类型的字段
    switch (eventOption.type) {
      case "purchase":
        if (
          !eventOption.purchaseTypes ||
          eventOption.purchaseTypes.trim() === ""
        ) {
          this.errors.push(`任务 ${taskId}: 购买类型不能为空`);
        }
        if (
          !eventOption.purchaseItems ||
          eventOption.purchaseItems.trim() === ""
        ) {
          this.errors.push(`任务 ${taskId}: 购买项目不能为空`);
        }
        break;
      case "scheduled":
        if (
          !eventOption.cronExpression ||
          eventOption.cronExpression.trim() === ""
        ) {
          this.errors.push(`任务 ${taskId}: 定时任务需要Cron表达式`);
        }
        break;
    }
  }

  // 验证排程
  validateSchedule(schedule, taskId) {
    if (!schedule) {
      this.errors.push(`任务 ${taskId}: 排程不能为空`);
      return;
    }

    if (!schedule.type || !["once", "recurrence"].includes(schedule.type)) {
      this.errors.push(`任务 ${taskId}: 排程类型必须是 'once' 或 'recurrence'`);
    }

    if (!schedule.time) {
      this.errors.push(`任务 ${taskId}: 排程时间不能为空`);
      return;
    }

    if (schedule.type === "once") {
      if (!schedule.time.once || schedule.time.once.trim() === "") {
        this.errors.push(`任务 ${taskId}: 一次性排程需要指定执行时间`);
      } else {
        const time = new Date(schedule.time.once);
        if (isNaN(time.getTime())) {
          this.errors.push(`任务 ${taskId}: 执行时间格式无效`);
        }
      }
    }

    if (schedule.type === "recurrence") {
      if (!schedule.time.cron || schedule.time.cron.trim() === "") {
        this.errors.push(`任务 ${taskId}: 重复排程需要Cron表达式`);
      } else {
        if (!this.isValidCron(schedule.time.cron)) {
          this.errors.push(`任务 ${taskId}: Cron表达式格式无效`);
        }
      }
    }
  }

  // 验证模板
  validateTemplate(template, taskId) {
    if (!template) {
      this.errors.push(`任务 ${taskId}: 模板不能为空`);
      return;
    }

    if (
      !template.type ||
      !["email", "sms", "popup", "none"].includes(template.type)
    ) {
      this.errors.push(
        `任务 ${taskId}: 模板类型必须是 'email', 'sms', 'popup' 或 'none'`
      );
    }

    if (template.type !== "none") {
      if (!template.id || template.id.trim() === "") {
        this.errors.push(`任务 ${taskId}: 模板ID不能为空`);
      }

      if (!template.subject || template.subject.trim() === "") {
        this.errors.push(`任务 ${taskId}: 模板主题不能为空`);
      }
    }
  }

  // 验证连接
  validateConnections(tasks) {
    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    tasks.forEach((task) => {
      if (task.sourceId && !taskMap.has(task.sourceId)) {
        this.errors.push(
          `任务 ${task.id}: 引用了不存在的源任务 ${task.sourceId}`
        );
      }

      if (task.targetId && !taskMap.has(task.targetId)) {
        this.errors.push(
          `任务 ${task.id}: 引用了不存在的目标任务 ${task.targetId}`
        );
      }
    });
  }

  // 验证循环引用
  validateCircularReferences(tasks) {
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycle = (taskId) => {
      if (recursionStack.has(taskId)) {
        return true;
      }

      if (visited.has(taskId)) {
        return false;
      }

      visited.add(taskId);
      recursionStack.add(taskId);

      const task = tasks.find((t) => t.id === taskId);
      if (task && task.targetId) {
        if (hasCycle(task.targetId)) {
          return true;
        }
      }

      recursionStack.delete(taskId);
      return false;
    };

    tasks.forEach((task) => {
      if (!visited.has(task.id) && hasCycle(task.id)) {
        this.errors.push(`检测到循环引用: ${task.id}`);
      }
    });
  }

  // 验证邮箱格式
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 验证Cron表达式格式（简单验证）
  isValidCron(cron) {
    const cronRegex =
      /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    return cronRegex.test(cron);
  }

  // 获取验证错误
  getErrors() {
    return this.errors;
  }

  // 检查是否有错误
  hasErrors() {
    return this.errors.length > 0;
  }

  // 清空错误
  clearErrors() {
    this.errors = [];
  }
}
