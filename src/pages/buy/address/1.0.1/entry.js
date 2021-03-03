// import IndexPage from './index.vue';
// // import Vue from 'vue';
// IndexPage.el = '#root';
// new Vue(IndexPage);

import index from './index.js';

function addTwo (x, y = 2) {  
    return x + y;  
}  

let numbers = [4, 382222];  
addTwo(...numbers)


function someOtherTest () {
    const p1 = {
      name: 'p1'
    };
    
    Object.assign({c: 3}, {a: 1, b: 2 });

    const combinedP1 = {
      height: 1001222,
      ...p1
    }
  }