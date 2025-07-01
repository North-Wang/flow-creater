import { z } from "zod";

//發送方式的種類
export const typeSendType = z.enum(["once", "recurrence", "regular"]);
export const typeCycleUnit = z.enum(["年", "月", "週", "日"]);

//【發送方式】：一次性投放
export const schemaSendTimeOnce = z.object({
  send_type: z.literal("once"),
});

//【發送方式】：週期性投放
export const schemaSendTimeRecurrence = z.object({
  send_type: z.literal("recurrence"),
  cycle_unit: z
    .enum(["year", "month", "week", "day"])
    .describe("寄完第一封後，投放頻率的單位"),
  cycle_frequency: z
    .number()
    .int()
    .min(1)
    .describe("寄完第一封後，投放的頻率數值"),
  cycle_time: z.string().regex(/^([01]\\d|2[0-3]):([0-5]\\d)$/, {
    message: "必須符合時間格式HH:mm",
  }),
  max_run_times: z.number().optional().describe("最多可運行幾次。預設不限制"),
});

//【發送方式】：定期投放
export const schemaSendTimeRegular = z.object({
  send_type: z.literal("regular"),
  cycle_unit: z.enum(["year", "month", "week", "day"]),
  cycle_frequency: z.number().int().min(1).optional().describe("多久投放一次"),
  month: z.number().int().min(1).max(12).optional().describe("幾月"),
  dayOfMonth: z.number().int().min(1).max(31).optional().describe("幾號"),
  week: z.number().int().min(1).max(5).optional().describe("第幾週"),
  weekday: z
    .enum([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
    .optional()
    .describe("星期幾"),
});

/**
 * 發送時間的彈窗資料
 * @description click彈窗的儲存按鍵時要驗證
 */
export const schemaSendTime = z.discriminatedUnion("send_type", [
  schemaSendTimeOnce,
  schemaSendTimeRecurrence,
  schemaSendTimeRegular,
]);
