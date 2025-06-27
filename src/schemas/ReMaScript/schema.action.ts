import { z } from "zod";

//傳送渠道的種類
export const typeAction = z.enum(["email", "sms"]);

export const schemaEmail = z.object({
  type: z.literal("email"),
  id: z.string(),
  name: z.string().nonempty().describe("模板名稱"),
  subject: z.string().nonempty().describe("主旨"),
});

export const schemaSms = z.object({
  type: z.literal("sms"),
  id: z.string(),
  name: z.string().nonempty().describe("模板名稱"),
});

/**
 * 模板的彈窗資料
 * @description click彈窗的儲存按鍵時要驗證
 */
export const schemaAction = z.discriminatedUnion("type", [
  schemaEmail,
  schemaSms,
]);
