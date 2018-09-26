/*
*  vuex state
*  初始化原始数据
* */

const state = {
  uid: '',                   //用户ID
  token: '',                //用户TOKEN
  userInfo: {},             //用户信息
  historyDetail: {},        //单个游戏历史记录
  isSelect: [],             //已选择邮寄的娃娃
  mailInfo: [],             //邮寄娃娃规则
  selectAddress: [],        //选中的地址
  editAddress: {},          //修改地址
  mailDetails: {},          //邮寄娃娃详情
  isOneShow: true,          //签到，公告只展示一次
  showHideDialog: false,    //展示分享界面
  noticeCenter: {},         //滚动公告内容,
};

export default state;
