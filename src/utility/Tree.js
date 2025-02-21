/**
 * 產生樹狀圖的節點
 */
class TreeNode {
   /**
     * @constructs TreeNode
     * @param {number} key 節點id 
     * @param {Object} value 節點資料
     * @param {Object} parent 父節點Tree物件
     * @param {Array} children 存放子節點物件的資料
     */
  constructor(key, value = key, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent; //指向父節點，根節點則為 null
    this.children = []; // 子節點陣列，預設為空
  }

  /**
   * 是否為葉節點? 沒有子節點的就是葉節點
   */
  get isLeaf() {
    return this.children.length === 0;
  }

  /**
  * 是否有子節點
  */
  get hasChildren() {
    return !this.isLeaf;
  }
}

/**
 * 管理樹狀結構
 * @description 有很多方法
 */
class Tree {
  /**
   * @constructs Tree
   * @param {number} key 樹狀圖根結點id 預設為0
   * @param {Object} value 樹狀圖根結節點資料
  */
  constructor(key=0, value = key) {
    this.root = new TreeNode(key, value);
    this.lastNodeId = 0 //紀錄最後一個節點的id
  }

  /**
    * 遍歷搜尋樹狀圖所有節點 (先產生該節點)
    * @param {Object} node 樹狀圖根節點
    */
  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  /**
    * 遍歷搜尋樹狀圖所有節點 (最後產生該節點)
    * @param {Object} node 樹狀圖根節點
    */

  *postOrderTraversal(node = this.root) {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

   /**
    * 樹狀圖新增節點
    * @param {number} parentNodeKey 要在哪一個節點id底下新增節點
    * @param {number} key 新增節點id(key)
    * @param {Object} value 新增節點資料
    * @return {Boolean}
    */
  insert(parentNodeKey, key, value = {}) {
    this.lastNodeId +=1 
    const newNodeId = this.lastNodeId 
    for (let node of this.preOrderTraversal()) {
      
      //根據id找到目標的節點，在其children陣列新增節點
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(newNodeId, value, node));
        return true;
      }
    }
    return false;
  }

  /**
    * 樹狀圖移除節點
    * @param {number} key 欲移除節點id(key)
    * @return {Boolean}
    * @description 會將該節點以下所有樹狀圖移除
    */

  remove(key) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter(c => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }
  /**
    * 搜尋樹狀圖中某一節點
    * @param {number} key 欲搜尋節點id(key)
    * @return {(Object | undefined)}
    */
  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
  /**
    * 樹狀圖節點UI互動ACTIVE
    * @param {number} key 點擊互動節點id(key)
    * @return {Boolean}
    */
  // activeNodeFocus(key) {
  //   for(const node of this.preOrderTraversal()) {
  //     if (node.key === Number(key)) {
  //        node.value.isActive = true
  //     }
  //     else {
  //       node.value.isActive = false
  //     }
  //   }
  // }
   /**
    * 移除樹狀圖最後結點末端連接線
    * @return {Boolean}
    */
  finalLeafConnectLine() {
    for(const node of this.preOrderTraversal()) {
      if (node.isLeaf) {
         node.value.showConnectLine = true
      }
      else {
        node.value.showConnectLine = false
      }
    }
  }
   /**
    * 取得樹狀圖所有結點資料
    * @return {Array}
    * @description 回傳攤平陣列
    */
  nodeData() {
    return [...this.preOrderTraversal()].map(x=>x.value)
  }

}
export {Tree, TreeNode}



