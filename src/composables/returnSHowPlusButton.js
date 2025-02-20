import { computed } from "vue";

/* 自訂判斷要顯示「+」號的邏輯 */
export function returnSHowPlusButton(nodeType) {
  try {
     if(!nodeType){
      throw Error("未收到參數")
    }
  } catch (error) {
    console.warn('判斷是否開啟+號的邏輯 錯誤', error)
  }
 
}