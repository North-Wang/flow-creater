## Purple

The purpose of this project is to develop a flowchart editor that follows the MVP principle as a proof of concept.

## Table of Contents

- [Introduction](#Introduction)
    - [Component](#Component)
    - [props](#props)
    - [Emits](#Emits)
- [Usage](#Usage)

## Introduction

- Binary Tree Structure - The flowchart is composed of a binary tree, can be continuously connected.
- use CSS variables to modify styles
- Node type - Apart from built-in specialized template types, other nodes's type can be customized. 
- Node Shapes - Supports square and rectangular node, can expanded other shape
- Node Control Options 
    - Which the node's type need to display an icon
    - Which the node's type is clickable
    - Which node's type have ability to add a new node
- icon of adding node - Each “+” sign can only add one child node

### Component
- TreeChart.vue：reusable component. display the binary tree structure
- Tree.js:There are CRUD methods to control the Tree class 

### props
| props | Description |
| --- | --- |
|data | Tree chart data |
| currentKey | ID of the currently selected node |
| activeLayer | Displays the script layer for operating the tree table |
| interfaceParentNodeIcon | Type of icon for the main node |
| returnNodeIcon | Function that returns the corresponding icon based on the node title |
| returnInterfaceNodeColor | Function that returns the corresponding background color based on the node type |
| ruleRectangleNode | Specifies which node types should be rectangular |
| ruleHasAddNode | Specifies which node types can add new nodes |
| ruleHasIcon | Specifies which node types display icons |
| ruleNotClick | Specifies which node types do not trigger click events (e.g., Yes/No) |
| ruleHasToolbar | Specifies which node types can display the side toolbar |

### emits 
| emits | Description |
| --- | --- |
| clickNode | Click on any interactive node |
| addNode | Add a node |
| previewNode | Preview function in the toolbar |
| editNode | Edit node function in the toolbar |

### slots 
| slots | Description |
| --- | --- |
| node | node's content |
| toolbar | the toolbar on the side of the node | 
| no-data | When no tree chart data is imported |

### defineExpose 
| defineExpose | Description |
| --- | --- |
| openNextLayer | Make the next layer’s nodes editable |

## Usage