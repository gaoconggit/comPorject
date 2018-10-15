/*
*
* */
import * as types from "./mutation-types";
import {setCookie, setStore} from "../common/util/ImUtils";

const mutation = {
  [types.SET_UID](state, uid) {
    setStore('wawaji_uid', uid);
    state.uid = uid;
  },
  [types.SET_TOKEN](state, token) {
    setCookie('wawaji_token', token);
    state.token = token;
  },
  [types.SET_ROOM_LIST_STATUS](state, obj) {
    state.roomListStatus = obj;
  },
  [types.SET_USER_INFO](state, userInfo) {
    setStore("wawaji_userInfo", JSON.stringify(userInfo));
    state.userInfo = userInfo;
  },
  [types.SET_HISTORY](state, history) {
    state.historyDetail = history;
  },
  [types.SET_IS_SELECT](state, item) {
    state.isSelect = item;
  },
  [types.SET_SELECT_ADDRESS](state, address) {
    state.selectAddress = address;
  },
  [types.SET_EDIT_ADDRESS](state, address) {
    state.editAddress = address;
  },
  [types.SET_MAIL_INFO](state, info) {
    state.mailInfo = info;
  },
  [types.SET_MAIL_DETAILS](state, details) {
    state.mailDetails = details
  },
  [types.SET_MAIL_DETAILS](state, details) {
    state.mailDetails = details
  },
  isOneShow(state, bool = false) {
    state.isOneShow = bool;
  },
  [types.SET_SHOW_HIDE_DIALOG](state, bool) {
    state.showHideDialog = bool
  },
  [types.SET_NOTICE_CENTER](state, obj) {
    state.noticeCenter = obj
  },
  [types.SET_NOW_USER_ID](state, id) {
    state.nowUserId = id
  },
};

export default mutation;
