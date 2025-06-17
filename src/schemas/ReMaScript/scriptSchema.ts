/** 定義自動化劇本中會使用的資料schema */
import { z } from "zod";

/**
 * 定義目前顯示哪種樹狀圖
 * @description
 * - main: 主劇本
 * - trigger-event: 子劇本：觸發事件
 * - response-event: 子劇本：回應事件劇本
 */
export type TreeType = "main" | "trigger-event" | "response-event";

export const ReactionType = z.enum(["trigger", "response"]);
export const sourceType = z.enum(["data", "api"]);

//觸發事件傳遞給api的種類
export const TriggerType = z.enum([
  "sign", // 註冊
  "cart_abandonment", // 購物車未結
  "purchase", // 購買後促銷
  "scheduled", // 定期投放
]);
//觸發事件的【發送頻率】傳遞給api的種類
export const TriggerEventFrequencyType = z.enum(["once", "recurrence"]);
//傳送渠道的種類
export type ActionType = "Email" | "SMS";
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
 * 【觸發事件】的彈窗 所有種類共有的資料格式
 * @description 觸發事件【購買後促銷】不適用此schema
 */
export const TriggerEventBasicSchema = z.object({
  event: z
    .enum([
      "sign", //註冊
      "cart_abandonment",
      "scheduled",
    ])
    .default("sign"),
  frequency: TriggerEventFrequencyType.default("once"),
});

//【觸發事件】的特例：購買後促銷
export const TriggerEventPurchaseAfterPromotionSchema = z.object({
  event: z.literal("purchase"),
  frequency: TriggerEventFrequencyType.default("once"),
  purchaseTypes: z.string(),
  purchaseItems: z.string(),
});

/**
 * 會依據event，判斷要套用的【觸發事件】的彈窗資料格式
 */
export const TriggerEventSchema = z.discriminatedUnion("event", [
  TriggerEventPurchaseAfterPromotionSchema,
  TriggerEventBasicSchema,
]);

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
    event: z.union([TriggerType, ResponseType]),
    purchaseTypes: z.string().optional(),
    purchaseItems: z.string().optional(),
  }),
  //發送時間
  schedule: z.object({
    type: TriggerEventFrequencyType,
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
