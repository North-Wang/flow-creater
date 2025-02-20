import { fn } from '@storybook/test';
import {Tree} from "../utility/Tree.js"

import TreeChart from '../components/TreeChart.vue';

/**
 * 回傳一個基礎的樹狀資料
 * @description 可以根據專案不同，自訂基礎的樹狀圖結構
 */
function returnEmptyTree() {
  const emptyTree = new Tree(0, {
    attr: "response",
    isActive: true,
    title: "點擊設定事件1",
    data: {}, //自訂的節點的資料
    depth: 1, //節點深度(必要)
  });
  emptyTree.insert(0, 1, {
    attr: "trigger",
    title: "點擊設定事件2",
    data: {},
    depth: 2,
  });
  emptyTree.insert(0, 2, {
    attr: "response",
    title: "點擊設定事件3",
    data: {},
    depth: 2,
  });
  emptyTree.insert(1, 3, {
    attr: "action",
    title: "action",
    data: {},
    depth: 3,
  });
  // emptyTree.insert(1, 4, {
  //   attr: "response",
  //   title: "點擊設定事件5",
  //   data: {},
  //   depth: 3,
  // });
  return emptyTree;
}
// const defaultTree= returnEmptyTree()
// console.log("預設", defaultTree.root)

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Example/TreeChart',
  component: TreeChart,
  tags: ['autodocs'],
  argTypes: {
    data:{control:{type:Object},  description: "樹狀圖資料", },
    // currentKey:{control:{type:Number},default:0}
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

const Template = (args) => ({
  components: { TreeChart },
  setup() {
    return { args };
  },
  props: Object.keys(args),
  template: '<TreeChart v-bind="args" ></TreeChart>',
});
export const Default = Template.bind({});
