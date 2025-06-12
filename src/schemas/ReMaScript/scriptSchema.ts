/** 定義自動化劇本中會使用的資料schema */
import {z} from "zod";

/**
 * 定義目前顯示哪種樹狀圖
 * @description
 * - main: 主劇本
 * - trigger-event: 子劇本：觸發事件
 * - response-event: 子劇本：回應事件劇本
 */
type TreeType = "main" | "trigger-event" | "response-event";

/**
 * 一個task的資料格式
*/
export const taskSchema = z.object({
  id: z.string(),
  reaction: z.enum(['trigger', 'response']), //事件的種類
  sourceId: z.string().nullable(), //前一個task的id
  targetId: z.string(), //下一個task的id
  //事件的種類
  eventOption: z.object({
    type:z.string()
  }), 
  //發送時間  
  schedule: z.object({
    type: z.enum(['once', 'cycle']), 
    time: z.union([
      z.object({ cron: z.string() }),
      z.object({ once: z.string() })
    ])
  }),
  //模板  
  template: z.object({
    type: z.string(),
    id: z.string(),
    subject: z.string()
  })
});

/**
 * 一個劇本的資料格式
*/
export const scriptSchema = z.object({
  info: z.object({
    name: z.string(),
    time_range: z.object({
      start: z.string(),
      end: z.string()
    }),
    source: z.object({
      type: z.enum(['data', 'api'])
    })
  }),
  senderInfo: z.object({
    sender: z.string(),
    email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.")
    // .refine((e) => e === "abcd@fg.com", "This email is not in our database")
   }),
  status: z.string(),
  version: z.number(),
  task: z.array(taskSchema)
});