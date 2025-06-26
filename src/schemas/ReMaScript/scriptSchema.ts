/** 定義自動化劇本中會使用的資料schema */
import { z } from "zod";
import {
  typeTriggerEvent,
  typeTriggerEventFrequency,
} from "./schema.triggerEvent";

/**
 * 定義目前顯示哪種樹狀圖
 * @description
 * - main: 主劇本
 * - trigger-event: 子劇本：觸發事件
 * - response-event: 子劇本：回應事件劇本
 */
export type TreeType = "main" | "trigger-event" | "response-event";

const ReactionType = z.enum(["trigger", "response"]);

//資料來源的種類
export const sourceType = z.enum(["data", "api"]);

//回應事件事件傳遞給api的種類
export const ResponseType = z.enum(["open"]);

/**
 * 下拉選單的單一選項
 * @property name - 顯示於介面上的文字
 * @property value - 對應儲存至資料庫的參數值
 */
export const OptionItemSchema = z.object({
  name: z.string(),
  value: z.string(),
});
type OptionItem = z.infer<typeof OptionItemSchema>;

/**
 * 一個task的資料格式
 */
export const TaskSchema = z.object({
  id: z.string(),
  reaction: ReactionType, //事件的種類
  sourceId: z.array(z.string()).nullable(), //前一個task的id
  targetId: z.array(z.string()).nullable(), //下一個task的id
  //事件的種類
  eventOption: z.object({
    event: z.union([typeTriggerEvent, ResponseType]),
    purchaseTypes: z.string().optional(),
    purchaseItems: z.string().optional(),
  }),
  //發送時間
  schedule: z.object({
    type: typeTriggerEventFrequency,
    time: z.union([
      z.object({ cron: z.string() }),
      z.object({ once: z.string() }),
    ]),
  }),
  //模板
  template: z.object({
    type: z.string(),
    id: z.string(),
    subject: z.string().optional(),
  }),
});

/**
 * 一個劇本的資料格式
 */
export const ScriptSchema = z.object({
  info: z.object({
    name: z.string(),
    time_range: z.object({
      start: z.string(),
      end: z.string(),
    }),
    source: z.object({
      type: sourceType,
    }),
  }),
  senderInfo: z.object({
    sender: z.string(),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    // .refine((e) => e === "abcd@fg.com", "This email is not in our database")
  }),
  status: z.string(),
  version: z.number(),
  task: z.array(TaskSchema),
});
