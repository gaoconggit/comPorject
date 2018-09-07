/*
*  vuex actions
*  修改state函数
* */
import * as types from "./mutation-types";

export const addSelect = ({commit, state}, item) => {
  let arr = state.isSelect.slice();
  arr.push(item);
  commit(types.SET_IS_SELECT, arr);
};

export const deleteSelect = ({commit, state}, item, index) => {
  let newArr = state.isSelect.slice();
  newArr.splice(index, 1);
  console.log("newArr--:", newArr);
  commit(types.SET_IS_SELECT, newArr);
};
