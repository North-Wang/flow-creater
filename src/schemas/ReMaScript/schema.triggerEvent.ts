/* 觸發事件彈窗相關的schema */
import { z } from "zod";

//發送方式的選項
export const typeTriggerEventFrequency = z.enum([
  "once",
  "recurrence",
  "regular",
]);

//觸發事件傳遞給api的參數
export const typeTriggerEvent = z.enum([
  "sign", // 註冊
  "cart_abandonment", // 購物車未結
  "purchase", // 購買後促銷
  "scheduled", // 定期投放
]);

/**
 * 經過多久後開始
 * @description 適用於【定期投放】以外的觸發事件
 */
export const schemaStartTimeRelative = z.object({
  unit: z.string(),
  value: z.number().default(2),
});

/**
 * 從特定日期才開始
 * @description 適用於【定期投放】的觸發事件
 */
export const schemaStartTimeAbsolute = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "日期格式錯誤，請使用 YYYY-MM-DD",
    }),
});

/**
 * 「經過多少時間寄第一封」or「條件開始的時間」
 */
export const schemaSendStartTime = z.union([
  schemaStartTimeRelative,
  schemaStartTimeAbsolute,
]);

/**
 * 經過多少時間寄第一封
 * @description 適用於「註冊」「購物車未結」「購買後促銷」
 */
const schemaDelayUntilFirstMail = z.object({
  value: z.number().describe("經過多久之後寄出第一封信的數值"),
  unit: z.enum(["天後"]).describe("經過多久之後寄出第一封信的單位"),
});

/**
 * 條件開始的時間
 * @description 適用於「定期投放」
 */
const schemaStartDate = z.object({
  date: z.string().datetime().describe("條件開始的日期"),
});

/**
 * 【觸發事件】：註冊
 */
export const schemaTriggerEventSign = z.object({
  event: z.literal("sign"),
});

/**
 * 【觸發事件】：購物車未結
 */
export const schemaTriggerEventCartAbandonment = z.object({
  event: z.literal("cart_abandonment"),
});

/**
 * 【觸發事件】：購買後促銷
 * @description 會有購買的種類與項目
 */
export const schemaTriggerEventPurchaseAfterPromotion = z.object({
  event: z.literal("purchase"),
  purchaseTypes: z.string(),
  purchaseItems: z.string().refine((val) => val !== "-", {
    message: "請選擇購買項目",
  }),
});

/**
 * 【觸發事件】：定期投放
 * @description 發送方式固定式定期性投放
 */
export const schemaTriggerEventScheduled = z.object({
  event: z.literal("scheduled"),
});

/**
 * 觸發事件的彈窗資料
 * @description click彈窗的儲存按鍵時要驗證
 */
export const schemaTriggerEvent = z.discriminatedUnion("event", [
  schemaTriggerEventSign,
  schemaTriggerEventCartAbandonment,
  schemaTriggerEventPurchaseAfterPromotion,
  schemaTriggerEventScheduled,
]);
