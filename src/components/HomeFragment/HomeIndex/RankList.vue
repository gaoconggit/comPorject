<template>
  <transition-scale>
    <div v-show="isShow" class="rank-wrapper">
      <div class="box">
        <div class="close" @click="closeRank">
          <img src="~img/com_img/close.png" alt="">
        </div>
        <nav class="rank-nav" @click="navClick">
          <p class="nav-item day-rank" :class="index===1?'active':''" :data-index="1"></p>
          <p class="nav-item week-rank" :class="index===2?'active':''" :data-index="2"></p>
        </nav>
        <scroller v-show="data.length" :bounce="false" scrollbar-y lock-x class="rank-list" ref="rankScorll">
          <ul>
            <li class="rank-item"
                :style="index<3?`backgroundImage:url(${require('../../../assets/img/rank/rank_bg_1.png')})`:`backgroundImage:url(${require('../../../assets/img/rank/rank_bg_2.png')})`"
                v-for="(item,index) in data">
              <div class="num">
                <img v-if="index<10" :src='rankNumber(index)' alt="">
                <p v-else class="num-text">{{index+1}}</p>
              </div>
              <div class="avatar"><img :src="item.avatar" alt=""></div>
              <p class="name">{{item.user_nicename}}</p>
              <p class="freq">抓中<br>{{item.zhuazhong_count}}次</p>
            </li>
          </ul>
        </scroller>
        <h2 class="rank-list-empty" v-show="!data.length">快来抢占榜单吧~</h2>
      </div>
    </div>
  </transition-scale>
</template>

<script>
import { Scroller } from "vux";
import TransitionScale from "@/common/TransitionScale";
import api from "../../../api/BaseService";

export default {
  name: "RankList",
  data() {
    return {
      index: 1, //菜单默认选择
      data: [], //展示的数据
      dayList: [], //日榜
      weekList: [] //周榜
    };
  },
  props: {
    isShow: {
      //是否展示排行榜
      type: Boolean,
      default: false
    }
  },
  created() {
    this.$emit("changeZIndex", 0);
    this.$nextTick(() => {
      this.$refs.rankScorll.reset();
    });
  },
  mounted() {
    this._getDayRankList();
  },
  methods: {
    async _getDayRankList() {
      let result = await api.getDayRankList();
      console.log(result);
      this.dayList = result.data;
      this.data = result.data;
    },
    async _getWeekRankList() {
      let result = await api.getWeekRankList();
      console.log(result);
      this.weekList = result.data;
      this.data = result.data;
    },
    closeRank() {
      this.$emit("closeRank");
    },
    navClick(e) {
      if (e.target.nodeName.toLowerCase() === "p") {
        let _index = Number(e.target.dataset.index);
        if (this.index !== _index) {
          this.$refs.rankScorll.reset({ top: 0 });
          this.index = _index;
          switch (_index) {
            case 1:
              if (this.dayList.length) {
                this.data = this.dayList;
              } else {
                this._getDayRankList();
              }
              break;
            case 2:
              if (this.weekList.length) {
                this.data = this.weekList;
              } else {
                this._getWeekRankList();
              }
              break;
          }
        }
      }
    },
    rankNumber(num) {
      return require(`img/rank/${num + 1}.png`);
    }
  },
  components: {
    TransitionScale,
    Scroller
  }
};
</script>

<style scoped lang="less">
@import "~assets/style/index";

.rank-wrapper {
  background-color: @bgOpacity;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    position: relative;
    z-index: 100;
    width: 640px;
    height: 1090px;
    .background-url("~img/rank/rank_bg.png");
    .close {
      position: absolute;
      right: -12px;
      top: 120px;
      width: 60px;
      height: 60px;
      .img-spread;
    }
    .rank-nav {
      padding: 0 80px;
      position: absolute;
      top: 210px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 120px;
      z-index: 1;
      box-sizing: border-box;
      .nav-item {
        width: 180px;
        height: 70px;
        &.day-rank {
          .background-url("~img/rank/btn_n2.png");
        }
        &.day-rank.active {
          .background-url("~img/rank/btn_s2.png");
          height: 80px;
        }
        &.week-rank {
          .background-url("~img/rank/btn_n3.png");
        }
        &.week-rank.active {
          .background-url("~img/rank/btn_s3.png");
          height: 80px;
        }
      }
    }
    .rank-list {
      padding: 0 40px;
      position: absolute;
      top: 320px;
      width: 100%;
      height: 700px !important;
      box-sizing: border-box;
      overflow: hidden;
      .rank-item {
        margin: 12px 0;
        display: flex;
        align-items: center;
        width: 560px;
        height: 120px;
        .background-url("~img/rank/rank_bg_1.png");
      }
      .num {
        width: 84px;
        height: 84px;
        line-height: 84px;
        text-align: center;
        .img-spread;
        .num-text {
          font-size: @maxFontSize;
          color: @mainColor;
          font-weight: 600;
        }
      }
      .avatar {
        margin: 0 12px;
        width: 90px;
        height: 90px;
        border-radius: 20px;
        border: 4px solid #fff;
        overflow: hidden;
        .img-spread;
      }
      .name {
        flex: 1;
        font-size: @subFontSize;
        .over-ellip;
      }
      .freq {
        width: 60px;
        text-align: center;
        font-size: @subFontSize;
        line-height: 32px;
        color: #fff;
      }
    }
    .rank-list-empty {
      padding: 40px 40px 0;
      position: absolute;
      top: 320px;
      width: 100%;
      height: 700px !important;
      box-sizing: border-box;
      text-align: center;
      .over-ellip;
    }
  }
}
</style>
