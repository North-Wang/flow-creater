import { fn } from '@storybook/test';
import {Tree} from "../utility/Tree.js"

import TreeChart from '../components/TreeChart.vue';

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
