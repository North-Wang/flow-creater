import iconSignUp from "../assets/icons/sign-up.svg";
import iconAfterSales from "../assets/icons/after-sales.svg";
import iconShoppingCar from "../assets/icons/shopping-car.svg";
import iconCycleTime from "../assets/icons/cycle-time.svg";
import iconSendEmail from "../assets/icons/send-email.svg";
import iconSendSms from "../assets/icons/send-sms.svg";

/**
 * 根據節點種類，回傳對應的背景色
 * @param {String} type 節點種類 
 * @returns {String} 背景色
 */
export function interfaceNodeColor(type){
   if(!type) return ""
   switch (type) {
      case "trigger":      
         return "#BAABE7";
      case "response":
         return "#96C5D7";
      case "action":
         return "#F9C357";
      case "wether_yes":
         return "#8BC19B";
      case "wether_no":
         return "#FF8B8B";
      case "template":
         return "#EAF3F4";
      default:
         console.warn("未定義的節點種類", type)
         return "gray";
   }
 
}
// 「節點選項」與對應的icon
const nodeIconMap = {
   "註冊": iconSignUp,
   "購物車未結": iconAfterSales,
   "購買後促銷": iconShoppingCar,
   "定期投放": iconCycleTime,
   "傳送Email": iconSendEmail,
   "傳送SMS": iconSendSms,
}
 // 「節點種類」與工具列的選項
const nodeToolbarMap = {
      "trigger":{
        "註冊": iconSignUp,
        "購物車未結": iconAfterSales,
        "購買後促銷": iconShoppingCar,
        "定期投放": iconCycleTime
      },
      'starter':{
        "註冊": iconSignUp,
        "購物車未結": iconAfterSales,
        "購買後促銷": iconShoppingCar,
        "定期投放": iconCycleTime
      },
      "action":{
        "傳送Email": iconSendEmail,
        "傳送SMS": iconSendSms,
      },
      "response":{
         "開啟信件":"",
         "點擊連結":"",
         "轉換":""
      }
    }
/**
 * 根據節點選項，回傳正確的icon
 * @param {String} option 節點的選項 ex:註冊、購物車未結
 * @returns {String} 對應的icon
 */
export function  returnIconByNode(option){
   console.log("回傳的icon:", nodeIconMap[option])
    if(!nodeIconMap[option]) return ""
    return nodeIconMap[option]
  }

/**
 * 根據節點的種類，回傳工具列選項
 * @param {String} nodeType 節點的選項 ex:註冊、購物車未結
 * @returns {Object} 對應的工具列選項
 */
export function returnToolbarOptions(nodeType){
   const options = nodeToolbarMap[nodeType] || []
   return options
} 