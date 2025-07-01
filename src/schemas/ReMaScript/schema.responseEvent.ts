import { z } from "zod";

//回應事件的種類
export const typeResponseEvent = z.enum([
  "open_mail",
  "click_url",
  "purchase_conversion",
]);

export const schemaResponseEvent = z.object({
  event: typeResponseEvent,
  response_time_value: z.number().int().min(1),
  response_time_unit: z.enum(["時內"]),
});
