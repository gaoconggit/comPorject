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
        <scroller scrollbar-y lock-x class="rank-list" ref="rankScorll">
          <ul>
            <li class="rank-item"
                :style="index<3?{}:{backgroundImage:`url(require('../../../assets/img/rank/rank_bg_2.png'))`}"
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
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import {Scroller} from 'vux';
  import TransitionScale from "@/common/TransitionScale"
  import api from "../../../api/BaseService";

  export default {
    name: "RankList",
    data() {
      return {
        index: 1,           //菜单默认选择
        data: [],           //展示的数据
        dayList: [],        //日榜
        weekList: [],       //周榜
      }
    },
    props: {
      isShow: {         //是否展示排行榜
        type: Boolean,
        default: false
      }
    },
    created() {
      this.$emit('changeZIndex', 0);
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
        this.$emit('closeRank');
      },
      navClick(e) {
        if (e.target.nodeName.toLowerCase() === 'p') {
          let _index = Number(e.target.dataset.index);
          if (this.index !== _index) {
            this.$refs.rankScorll.reset({top: 0})
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
      },
    },
    components: {
      TransitionScale, Scroller
    }
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index";

  .rank-wrapper {
    background-color: rgba(0, 0, 0, .3);
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
      width: 640/2px;
      height: 1090/2px;
      .background-url('~img/rank/rank_bg.png');
      .close {
        position: absolute;
        right: -6px;
        top: 120/2px;
        width: 60/2px;
        height: 60/2px;
        .img-spread;
      }
      .rank-nav {
        padding: 0 40px;
        position: absolute;
        top: 210/2px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 120/2px;
        z-index: 1;
        box-sizing: border-box;
        .nav-item {
          width: 180/2px;
          height: 70/2px;
          &.day-rank {
            .background-url('~img/rank/btn_n2.png');
          }
          &.day-rank.active {
            .background-url('~img/rank/btn_s2.png');
            height: 80/2px;
          }
          &.week-rank {
            .background-url('~img/rank/btn_n3.png');
          }
          &.week-rank.active {
            .background-url('~img/rank/btn_s3.png');
            height: 80/2px;
          }
        }
      }
      .rank-list {
        padding: 0 40/2px;
        position: absolute;
        top: 320/2px;
        width: 100%;
        height: 700/2px !important;
        box-sizing: border-box;
        overflow: hidden;
        .rank-item {
          margin: 12/2px 0;
          display: flex;
          align-items: center;
          width: 560/2px;
          height: 120/2px;
          .background-url('~img/rank/rank_bg_1.png')
        }
        .num {
          width: 84/2px;
          height: 84/2px;
          line-height: 84/2px;
          text-align: center;
          .img-spread;
          .num-text {
            font-size: 26px;
            color: @mainColor;
            font-weight: 600;
          }
        }
        .avatar {
          margin: 0 6px;
          width: 90/2px;
          height: 90/2px;
          border-radius: 10px;
          border: 2px solid #FFF;
          overflow: hidden;
          .img-spread;
        }
        .name {
          flex: 1;
          font-size: 14px;
          .over-ellip;
        }
        .freq {
          width: 60px;
          text-align: center;
          font-size: 14px;
          line-height: 16px;
          color: #FFF;
        }
      }
    }
  }
</style>
