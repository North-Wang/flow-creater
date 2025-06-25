/* 觸發事件彈窗相關的schema */
import { z } from "zod";

//發送方式的選項
export const TriggerEventFrequencyType = z.enum([
  "once",
  "recurrence",
  "regular",
]);

//觸發事件傳遞給api的參數
export const TriggerType = z.enum([
  "sign", // 註冊
  "cart_abandonment", // 購物車未結
  "purchase", // 購買後促銷
  "scheduled", // 定期投放
]);

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
  purchaseItems: z.string().refine((val) => val !== "-", {
    message: "請選擇購買項目",
  }),
});

/**
 * 經過多久後開始
 * @description 適用於【定期投放】以外的觸發事件
 */
export const schemaStartTimeRelative = z.object({
  triggerEvent: z.enum(["once", "recurrence"]),
  unit: z.string(),
  value: z.number().default(2),
});

/**
 * 從特定日期才開始
 * @description 適用於【定期投放】的觸發事件
 */
export const schemaStartTimeAbsolute = z.object({
  triggerEvent: z.literal("regular"),
  date: z.date(),
});

/**
 * 「經過多少時間寄第一封」or「條件開始的時間」
 */
export const schemaSendStartTime = z.discriminatedUnion("triggerEvent", [
  schemaStartTimeRelative,
  schemaStartTimeAbsolute,
]);

/**
 * 觸發事件的彈窗資料
 * @description click彈窗的儲存按鍵時要驗證
 */
export const TriggerEventSchema = z.discriminatedUnion("event", [
  TriggerEventPurchaseAfterPromotionSchema,
  TriggerEventBasicSchema,
]);
