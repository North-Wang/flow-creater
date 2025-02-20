/**
 * 根據節點種類，回傳對應的背景色
 * @param {String} type 節點種類 
 * @returns {String} 背景色
 */
export default function interfaceNodeColor(type){
  switch (type) {
    case "trigger":      
       return "#eba759";
    case "response":
       return "#baabe7";
    case "action":
        return "#96c5d7";
    default:
       return "#eaf3f4";
  }
 
}