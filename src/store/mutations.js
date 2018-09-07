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
    console.log("state item:", item);
    state.isSelect = item;
  }
};

export default mutation;
