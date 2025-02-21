/**
 * 根據節點種類，回傳對應的背景色
 * @param {String} type 節點種類 
 * @returns {String} 背景色
 */
export default function interfaceNodeColor(type){
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