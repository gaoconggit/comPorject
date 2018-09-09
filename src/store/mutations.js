/*
*
* */
import * as types from "./mutation-types";

const mutation = {
  [types.SET_UID](state, uid) {
    state.uid = uid;
  },
  [types.SET_TOKEN](state, token) {
    state.token = token;
  },
  [types.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo;
    window.localStorage.setItem("wawaji_userInfo", JSON.stringify(userInfo));
  },
  [types.SET_HISTORY](state, history) {
    state.historyDetail = history;
  },
  [types.SET_IS_SELECT](state, item) {
    state.isSelect = item;
  },
  [types.SET_SELECT_ADDRESS](state,address){
    state.selectAddress = address;
  },
  [types.SET_EDIT_ADDRESS](state,address){
    state.editAddress = address;
  }
};

export default mutation;
