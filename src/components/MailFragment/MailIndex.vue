/**
*  邮件中心
*
*/
<template>
  <div class="mail-wrapper">
    <title-bar title="消息" :isWhiteBack="false" headerStyle="background-color:#FFF" @get-title-height="titleHeight"/>
    <div class="mail-box">
      <tab active-color="#000" :line-width="2" ref="tabRef">
        <tab-item @on-item-click="onItemClick(0)">个人消息</tab-item>
        <tab-item @on-item-click="onItemClick(1)">系统消息</tab-item>
      </tab>
      <div class="mail-content">
        <p class="more-max" ref="moreMax">消息过多，请自行删除</p>
        <scroller class="person-wrap" v-if="mailIndex===0" ref="personScroller"
                  :bounce="false" lock-x :scrollbarY="true" :height="personHeight + ''">
          <ul>
            <li v-if="noticeList.length" class="mail-item" v-for="item in noticeList" :key="item.id"
                @click="clickItem(Number(item.id),1)"
                :class="{'active':item.status==0}">
              <div class="icon"><img src="~/img/mail/head.png" alt=""></div>
              <div class="mail-center">
                <p class="title">{{item.title}}</p>
                <p class="desc">{{item.desc}}</p>
              </div>
              <p class="time">{{formatTime(item.ctime)}}</p>
            </li>
            <div v-if="!noticeList.length" class="empty-notice">
              <div class="empty-icon"><img src="~/img/com_img/not_notice.png" alt=""></div>
              <p class="empty-text">暂时没有通知消息哦~</p>
            </div>
          </ul>
        </scroller>
        <scroller class="person-wrap" v-if="mailIndex===1" ref="systemScroller"
                  :bounce="false" lock-x :scrollbarY="true" :height="personHeight + ''">
          <ul>
            <li class="mail-item" v-for="item in sysList" :key="item.id"
                @click="clickItem(Number(item.id),2)">
              <div class="icon"><img src="~/img/mail/head.png" alt=""></div>
              <div class="mail-center">
                <p class="title">{{item.title}}</p>
                <p class="desc">{{item.desc}}</p>
              </div>
              <p class="time">{{formatTime(item.ctime)}}</p>
            </li>
            <div v-if="!sysList.length" class="empty-notice">
              <div class="empty-icon"><img src="~/img/com_img/not_notice.png" alt=""></div>
              <p class="empty-text">暂时没有通知消息哦~</p>
            </div>
          </ul>

        </scroller>
      </div>
    </div>
    <MailContent v-if="isDetail&&itemId" :platform="platform" :id="itemId" @close-popup="closePopup"/>
  </div>
</template>

<script>
  import {Tab, TabItem, Scroller} from 'vux'
  import TitleBar from "@/common/TitleBar";
  import {getTimeDate, updateBaseInfo} from "../../common/util/Utils";
  import api from "../../api/BaseService";
  import MailContent from "./MailContent";

  export default {
    name: "MainIndex",
    data() {
      return {
        isOverMaxSize: false, //信息条数是否超出
        mailIndex: 0,         //默认选择
        personHeight: 0,      //高度
        noticeList: [],       //个人消息
        sysList: [],          //系统消息
        isDetail: false,      //是否展示详情
        itemId: 0,            //内容详情
        allRead: false,       //是否所有的都已读
        platform: 1,          //1:个人消息，2:系统消息
      };
    },
    mounted() {
      this.$nextTick(() => {
        if (this.$refs.personScroller) {
          this.$refs.personScroller.reset();
        }
        if (this.$refs.systemScroller) {
          this.$refs.systemScroller.reset();
        }
      });
      this._getNoticeList();
    },
    watch: {
      isOverMaxSize() {
        let moreMaxHeight = 0;
        if (this.isOverMaxSize) {
          moreMaxHeight = this.$refs.moreMax.clientHeight;
        }
        this.personHeight -= moreMaxHeight;
      }
    },
    methods: {
      async _getNoticeList() {
        let result = await api.getNoticeList();
        if (result.data.length >= api.MAXSIZE) {
          this.isOverMaxSize = true;
          this.$refs.moreMax.style.display = 'block';
          result.data.pop();
        } else {
          this.$refs.moreMax.style.display = 'none';
        }
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].status == 0) {
            this.allRead = false;
            break;
          } else {
            this.allRead = true;
          }
        }
        this.noticeList = result.data;
        this.$vux.loading.hide();
      },
      async _getSysNoticeList() {
        let result = await api.getSysNoticeList();
        this.sysList = result.data;
        this.$vux.loading.hide();
      },
      onItemClick(index) {
        if (index !== this.mailIndex) {
          this.$vux.loading.show({text: '加载中...'});
          if (index === 0) {
            if (!this.noticeList.length) {
              this._getNoticeList();
            } else {
              this.$vux.loading.hide();
            }
          }
          if (index === 1) {
            if (!this.sysList.length) {
              this._getSysNoticeList();
            } else {
              this.$vux.loading.hide();
            }
          }
          this.mailIndex = index;
        }
      },
      clickItem(id, platform) {
        this.platform = platform;
        this.itemId = id;
        this.isDetail = true;
      },
      closePopup(bool) {
        if (!bool) {
          this._getNoticeList();
        }
        this.isDetail = false;
      },
      formatTime(num) {
        return getTimeDate(num);
      },
      titleHeight(height) {
        if (Number(height)) {
          this.personHeight = -(height + this.$refs.tabRef.$el.clientHeight + 10);
        }
      }
    },
    destroyed() {
      if (this.allRead) {
        updateBaseInfo();
      }
    },
    components: {
      TitleBar, Tab, TabItem, Scroller, MailContent
    },
  };
</script>

<style lang="less">
  @import "~assets/style/index.less";

  @roomTabHeight: 80px;
  @paddingWidth: 16px;

  .mail-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: @lightGrayColor;
    .mail-box {
      padding: @paddingWidth;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .vux-tab-wrap {
        padding: 0 !important;
        height: @roomTabHeight !important;
      }
      .vux-tab-container {
        height: @roomTabHeight !important;
      }
      .vux-tab {
        height: @roomTabHeight !important;
        border-top-right-radius: 30px;
        border-top-left-radius: 30px;
        overflow: hidden;
      }
      .vux-tab-item {
        height: @roomTabHeight !important;
        line-height: @roomTabHeight !important;
        font-size: @subFontSize;
      }
      .mail-content {
        .more-max {
          display: none;
          text-align: center;
          color: @warnColor;
          font-size: @subFontSize;
          line-height: 50px;
        }
        .person-wrap {
          background-color: @whiteColor;
        }
        .mail-item {
          padding: 10px 20px;
          display: flex;
          align-items: center;
          background-color: @whiteColor;
          &.active {
            background-color: @lightGrayColor;
          }
          .icon {
            margin: 0 20px 0 10px;
            width: 120px;
            height: 120px;
            overflow: hidden;
            .img-spread;
          }
          .mail-center {
            flex: 1;
            .over-ellip;
          }
          .desc, .time {
            font-size: @subFontSize;
            line-height: 40px;
            color: @grayColor;
          }
        }
      }
      .empty-notice {
        .empty-icon {
          margin: 200px auto 50px;
          width: 363px;
          height: 363px;
          .img-spread;
        }
        .empty-text {
          text-align: center;
          font-size: @subFontSize;
          color: @grayColor;
        }
      }
    }
  }
</style>


