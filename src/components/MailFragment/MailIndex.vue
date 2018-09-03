/**
*  邮件中心
*
*/
<template>
  <div class="mail-wrapper">
    <title-bar title="消息" :isWhiteBack="false" headerStyle="background-color:#FFF"/>
    <div class="mail-box">
      <tab v-model="mailIndex" active-color="#000" line-width="2">
        <tab-item @on-item-click="onItemClick">个人消息</tab-item>
        <tab-item @on-item-click="onItemClick">系统消息</tab-item>
      </tab>
      <div class="mail-content">
        <div class="person-wrap" v-if="mailIndex===0">
          <ul>
            <li class="mail-item" v-for="item in list" :key="item.id">
              <div class="icon"><img :src="item.icon" alt=""></div>
              <div class="mail-center">
                <p>{{item.title}}</p>
                <p>{{item.desc}}</p>
              </div>
              <p>{{item.time}}</p>
            </li>
          </ul>
        </div>
        <div class="system-wrap" v-if="mailIndex===1">
          4567
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Tab, TabItem} from 'vux'
  import TitleBar from "@/common/TitleBar";

  export default {
    name: "MainIndex",
    data() {
      return {
        mailIndex: 0,         //默认选择
        list: [
          {
            id: 1,
            icon: require("img/mine/avatar.png"),
            title: "我是标题",
            desc: "我是描述",
            content: "我是内容",
            time: 125647136
          },
          {
            id: 2,
            icon: require("img/mine/avatar.png"),
            title: "我是标题",
            desc: "我是描述",
            content: "我是内容",
            time: 125647136
          }
        ],
      };
    },
    methods: {
      onItemClick(index) {
        this.mailIndex = index;
      },
    },
    components: {
      TitleBar, Tab, TabItem
    }
  };
</script>

<style lang="less">
  @import "~assets/style/index.less";

  @roomTabHeight: 80px;
  @paddingWidth: 20px;

  .mail-wrapper {
    .mail-box {
      padding: @paddingWidth;
      position: fixed;
      top: @titleBarHeight;
      bottom: 0;
      left: 0;
      right: 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background-color: @lightGrayColor;
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
      }
      .mail-content {
        padding: 0 @paddingWidth;
        position: absolute;
        top: @roomTabHeight + @paddingWidth;
        left: 0;
        bottom: 0;
        right: 0;
        .mail-item{
          padding: 10px 20px;
          display: flex;
          align-items:center;
          background-color: @whiteColor;
          &.active{
            background-color: @lightGrayColor;
          }
          .icon{
            margin: 0 20px 0 10px;
            width: 120px;
            height: 120px;
            .img-spread;
          }
          .mail-center{
            flex: 1;
            .over-ellip;
          }
        }
      }
    }
  }
</style>


