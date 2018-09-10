/*
*  vuex getters
*  获取state
* */
import state from "./state";

export const uid = state => state.uid;

export const token = state => state.token;

export const userInfo = state => state.userInfo;

export const history = state => state.historyDetail;

export const isSelect = state => state.isSelect;

export const mailInfo = state => state.mailInfo;

export const selectAddress = state => state.selectAddress;

export const editAddress = state => state.editAddress;

export const mailDetails = state => state.mailDetails;
