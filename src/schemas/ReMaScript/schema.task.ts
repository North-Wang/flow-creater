import { z } from "zod";

/**
 * 根據觸發事件的種類，判斷欄位是否都必填
 * @returns
 */
function getTriggerEventValidator(trigger_event: string) {
  return (data: any, ctx: SuperRefineContext) => {
    switch (trigger_event) {
      case "post_purchase_marketing":
        if (!data.purchase_item_type || data.purchase_item_type === "-") {
          ctx.addIssue({
            path: ["purchase_item_type"],
            code: z.ZodIssueCode.custom,
            message: "請選擇有效的商品類型",
          });
        }
        if (!data.purchase_item || data.purchase_item === "-") {
          ctx.addIssue({
            path: ["purchase_item"],
            code: z.ZodIssueCode.custom,
            message: "請選擇有效的商品",
          });
        }
        break;
      case "recurring_scheduled":
        if (!data.first_send_date) {
          ctx.addIssue({
            path: ["first_send_date"],
            code: z.ZodIssueCode.custom,
            message: "請選擇開始的日期",
          });
        }
        break;
      default:
        break;
    }
  };
}

export const formSchema = z
  .object({
    trigger_event: z.string(),
    purchase_item_type: z.string().optional(),
    purchase_item: z.string().optional(),
    first_send_date: z.string().nonempty("請選擇開始的日期!!!").optional(),
  })
  .superRefine((data, ctx) => {
    const validator = getTriggerEventValidator(data.trigger_event);
    validator(data, ctx);
  });

type SuperRefineContext = Parameters<
  z.ZodEffects<z.ZodTypeAny>["superRefine"]
>[1];
