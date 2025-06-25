/* 觸發事件彈窗相關的schema */
import { z } from "zod";

//觸發事件傳遞給api的參數
export const TriggerType = z.enum([
  "sign", // 註冊
  "cart_abandonment", // 購物車未結
  "purchase", // 購買後促銷
  "scheduled", // 定期投放
]);

//發送方式的選項
export const TriggerEventFrequencyType = z.enum([
  "once",
  "recurrence",
  "regular",
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
  purchaseItems: z.string(),
});

/**
 * 會依據event，判斷要套用的【觸發事件】的彈窗資料格式
 */
export const TriggerEventSchema = z.discriminatedUnion("event", [
  TriggerEventPurchaseAfterPromotionSchema,
  TriggerEventBasicSchema,
]);
