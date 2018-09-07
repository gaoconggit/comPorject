<!--
** 游戏历史详情
-->

<template>
  <div class="history-detail">
    <title-bar title="我要申诉" :headerStyle="'background-color:#FFF'" :isWhiteBack="false"/>
    <div class="wawa-info">
      <wawa-list-item :data="(JSON.parse('[' + JSON.stringify(this.history) + ']'))">
        <p slot="right" slot-scope="slot" class="status" :class="{'active':parseInt(slot.item.success)}">
          {{parseInt(slot.item.success)?'抓取成功':'抓取失败'}}
        </p>
      </wawa-list-item>
    </div>
    <div class="list-wrapper">
      <h2>我要申诉</h2>
      <ul>
        <li class="list-item" v-for="(item,index) in appealList" :key="item.id" @click="clickItem(index)">
          <p class="text">{{item.text}}</p>
          <div class="select-icon"><img
            :src="item.isSelect?require('img/wawa/select_yes.png'):require('img/wawa/select_not.png')" alt=""></div>
        </li>
      </ul>
      <div class="commit" @click="commitAppeal"><img src="~/img/wawa/commit.png" alt=""></div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import TitleBar from "@/common/TitleBar";
  import WawaListItem from "@/common/WawaListItem";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "HistoryDetail",
    data() {
      return {
        appealList: [],       //申诉列表
        selectArr: [],        //已选中的id
      }
    },
    mounted() {
      if (this.history.hid) {
        this._getAppealList();
      } else {
        this.$router.back();
      }
    },
    methods: {
      async _getAppealList() {
        let result = await api.getAppealList(this.history.room_id);
        let arr = result.data;
        arr.forEach((item) => {
          item.isSelect = false;
        });
        this.appealList = result.data;
      },
      async _getConfirmAppeal(type) {
        let result = await api.getConfirmAppeal(this.history.hid, type);
        if (result.code == 1) {
          showToast(result.msg, 'success', 1000)
        } else {
          showToast(result.msg, 'cancel', 1000, '280px')
        }
        setTimeout(() => {
          this.$router.back();
        }, 1200)
      },
      clickItem(index) {
        let arr = this.appealList;
        arr[index].isSelect = !this.appealList[index].isSelect;
        this.appealList = arr;
      },
      commitAppeal() {
        let arr = [];
        this.appealList.forEach((item) => {
          if (item.isSelect) {
            arr.push(item.id);
          }
        })
        if (arr.length) {
          this._getConfirmAppeal(arr.join());
        } else {
          showToast('请选择你需要申诉的理由', 'text', 1000, '250px')
        }
      }
    },
    computed: {
      ...mapGetters(['history'])
    },
    components: {TitleBar, WawaListItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .history-detail {
    .wawa-info {
      .status {
        width: 180px;
        text-align: center;
        font-size: @subFontSize;
        color: @grayColor;
        &.active {
          color: @mainColor;
        }
      }
    }
    .list-wrapper {
      padding: 0 20px;
      margin-top: 30px;
      .list-item {
        padding: 0 20px;
        display: flex;
        align-items: center;
        height: 120px;
        border-bottom: 1px solid @lightGrayColor;
        .text {
          flex: 1;
        }
        .select-icon {
          width: 34px;
          height: 34px;
          .img-spread;
        }
      }
      .commit {
        margin: 40px auto;
        width: 404px;
        height: 80px;
        .img-spread;
      }
    }
  }
</style>
