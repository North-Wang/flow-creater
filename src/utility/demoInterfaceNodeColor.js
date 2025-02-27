/**
 * 根據節點種類，回傳對應的背景色
 * @param {String} type 節點種類 
 * @returns {String} 背景色
 */
export default function returnInterfaceNodeColor(type){
  if(!type) return ""
  
  switch (type) {
    case "start":   
    case "intention":     
      return "#D06BFF";
    case "starter":      
      return "#A0DA8B";
    case "template":      
      return "#EAF3F4";
    case "wether_yes":
        return "#8BC19B";
    case "wether_no":
    case "meat":
        return "#FF8B8B";
    default:
      console.warn("未定義的節點種類", type)
      return "#4FB0FF";
  }
 
}