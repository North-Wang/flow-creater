import { z } from "zod";

// 基础字段定义
export const BaseFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["string", "number", "boolean", "select", "date", "object"]),
  required: z.boolean().default(false),
  defaultValue: z.any().optional(),
  validation: z.any().optional(),
  metadata: z.record(z.any()).optional(),
});

// 动态字段集合
export const DynamicFieldsSchema = z.record(z.string(), BaseFieldSchema);

// 版本信息
export const VersionInfoSchema = z.object({
  major: z.number(),
  minor: z.number(),
  patch: z.number(),
  migrationScript: z.string().optional(),
});

// 可扩展的事件选项
export const ExtensibleEventOptionSchema = z.object({
  type: z.string(),
  // 动态字段
  fields: DynamicFieldsSchema.optional(),
  // 版本信息
  version: VersionInfoSchema.optional(),
  // 扩展数据
  extensions: z.record(z.any()).optional(),
});

// 可扩展的调度选项
export const ExtensibleScheduleSchema = z.object({
  type: z.enum(["once", "recurrence", "cron", "custom"]),
  // 动态配置
  config: z.record(z.any()).optional(),
  // 版本信息
  version: VersionInfoSchema.optional(),
  // 扩展数据
  extensions: z.record(z.any()).optional(),
});

// 可扩展的模板选项
export const ExtensibleTemplateSchema = z.object({
  type: z.string(),
  id: z.string(),
  // 动态字段
  fields: DynamicFieldsSchema.optional(),
  // 版本信息
  version: VersionInfoSchema.optional(),
  // 扩展数据
  extensions: z.record(z.any()).optional(),
});

// 可扩展的任务 Schema
export const ExtensibleTaskSchema = z.object({
  id: z.string(),
  reaction: z.enum(["trigger", "response"]),
  sourceId: z.string().nullable(),
  targetId: z.string().nullable(),
  // 可扩展的事件选项
  eventOption: ExtensibleEventOptionSchema,
  // 可扩展的调度选项
  schedule: ExtensibleScheduleSchema,
  // 可扩展的模板选项
  template: ExtensibleTemplateSchema,
  // 版本信息
  version: VersionInfoSchema.optional(),
  // 扩展数据
  extensions: z.record(z.any()).optional(),
});

// 可扩展的剧本 Schema
export const ExtensibleScriptSchema = z.object({
  info: z.object({
    name: z.string(),
    time_range: z.object({
      start: z.string(),
      end: z.string(),
    }),
    source: z.object({
      type: z.enum(["data", "api"]),
    }),
    // 扩展信息
    extensions: z.record(z.any()).optional(),
  }),
  senderInfo: z.object({
    sender: z.string(),
    email: z.string().email(),
    // 扩展信息
    extensions: z.record(z.any()).optional(),
  }),
  status: z.string(),
  version: VersionInfoSchema,
  task: z.array(ExtensibleTaskSchema),
  // 全局扩展数据
  extensions: z.record(z.any()).optional(),
});

// 版本迁移器
export class SchemaMigrator {
  private migrations: Map<string, (data: any) => any> = new Map();

  // 注册迁移脚本
  registerMigration(
    fromVersion: string,
    toVersion: string,
    migrationFn: (data: any) => any
  ) {
    const key = `${fromVersion}_${toVersion}`;
    this.migrations.set(key, migrationFn);
  }

  // 执行迁移
  migrate(data: any, targetVersion: string): any {
    const currentVersion = data.version || { major: 1, minor: 0, patch: 0 };
    const currentVersionStr = `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`;

    if (currentVersionStr === targetVersion) {
      return data;
    }

    const migrationKey = `${currentVersionStr}_${targetVersion}`;
    const migrationFn = this.migrations.get(migrationKey);

    if (migrationFn) {
      return migrationFn(data);
    }

    throw new Error(
      `No migration found from ${currentVersionStr} to ${targetVersion}`
    );
  }

  // 获取所有可用版本
  getAvailableVersions(): string[] {
    const versions = new Set<string>();
    for (const key of this.migrations.keys()) {
      const [from, to] = key.split("_");
      versions.add(from);
      versions.add(to);
    }
    return Array.from(versions).sort();
  }
}

// 字段验证器
export class FieldValidator {
  // 验证动态字段
  static validateFields(
    data: any,
    fields: z.infer<typeof DynamicFieldsSchema>
  ): boolean {
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      const value = data[fieldName];

      // 检查必填字段
      if (
        fieldDef.required &&
        (value === undefined || value === null || value === "")
      ) {
        throw new Error(`Field ${fieldName} is required`);
      }

      // 检查类型
      if (value !== undefined && value !== null) {
        this.validateFieldType(value, fieldDef.type, fieldName);
      }

      // 执行自定义验证
      if (fieldDef.validation) {
        this.executeCustomValidation(value, fieldDef.validation, fieldName);
      }
    }

    return true;
  }

  // 验证字段类型
  private static validateFieldType(
    value: any,
    type: string,
    fieldName: string
  ) {
    switch (type) {
      case "string":
        if (typeof value !== "string") {
          throw new Error(`Field ${fieldName} must be a string`);
        }
        break;
      case "number":
        if (typeof value !== "number") {
          throw new Error(`Field ${fieldName} must be a number`);
        }
        break;
      case "boolean":
        if (typeof value !== "boolean") {
          throw new Error(`Field ${fieldName} must be a boolean`);
        }
        break;
      case "date":
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          throw new Error(`Field ${fieldName} must be a valid date`);
        }
        break;
      case "object":
        if (typeof value !== "object" || value === null) {
          throw new Error(`Field ${fieldName} must be an object`);
        }
        break;
    }
  }

  // 执行自定义验证
  private static executeCustomValidation(
    value: any,
    validation: any,
    fieldName: string
  ) {
    if (typeof validation === "function") {
      const result = validation(value);
      if (result !== true) {
        throw new Error(`Field ${fieldName} validation failed: ${result}`);
      }
    }
  }
}

// 导出类型
export type ExtensibleTask = z.infer<typeof ExtensibleTaskSchema>;
export type ExtensibleScript = z.infer<typeof ExtensibleScriptSchema>;
export type DynamicFields = z.infer<typeof DynamicFieldsSchema>;
export type VersionInfo = z.infer<typeof VersionInfoSchema>;
