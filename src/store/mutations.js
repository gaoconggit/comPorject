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
  }
};

export default mutation;
