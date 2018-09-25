<!--
** 未发货的
-->

<template>
  <div class="un-delivery">
    <scroll-view v-show="unList.length" :tabHeight="unHeight"
                 ref="unDeliveryScroller"
                 :showBottom="{isShow:true,text:'只有这么多娃娃了哟~'}"
                 @on-pulldown-loading="onPullDown"
                 @on-pullup-loading="onPullUp">
      <wawa-list-item :data="unList" @on-item-click="clickItem">
        <div class="select-icon" slot-scope="slot" slot="left"><img
          :src="slot.item.is_select?require('img/wawa/select_yes.png'):require('img/wawa/select_not.png')" alt=""></div>
      </wawa-list-item>
    </scroll-view>
    <div v-if="!unList.length" class="empty-wrapper">
      <div class="empty-icon"><img src="~/img/com_img/not_notice.png" alt=""></div>
      <p>暂无需要邮寄的娃娃，快去抓一个吧~</p>
    </div>
    <div class="bottom-wrapper" ref="wawaBottom">
      <div class="btn deliver" @click="applyWawa"><img src="~/img/wawa/button_deliver.png" alt=""></div>
      <div class="btn exchange" @click="changeWawa">
        <img src="~/img/wawa/button_exchange.png" alt="">
        <p>(可兑换{{selectScore}}积分)</p>
      </div>
    </div>
    <transition-scale v-if="isChangeScore">
      <div class="change-wrapper">
        <div class="box">
          <div class="close" @click="changeCoinClose"><img src="~/img/com_img/close.png" alt=""></div>
          <p class="title">确认兑换</p>
          <p class="desc">可以兑换{{selectScore}}个积分</p>
          <div class="change-btn" @click="confirmChangeCoin"><p>确认兑换</p></div>
        </div>
      </div>
    </transition-scale>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex";
  import ScrollView from "@/common/ScrollView";
  import WawaListItem from "@/common/WawaListItem";
  import TransitionScale from "@/common/TransitionScale";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "UnDelivery",
    props: ['tabHeight'],
    data() {
      return {
        unHeight: 0,
        unList: [],         //未发货的列表
        page: 1,            //默认页码
        selectScore: 0,      //选中可兑换的积分
        isChangeScore: false,  //娃娃兑换积分
      }
    },
    mounted() {
      this._getMyWawaList();
    },
    watch: {
      tabHeight() {
        this.unHeight = this.tabHeight - this.$refs.wawaBottom.clientHeight;
        this.$refs.unDeliveryScroller.reset();
      },
      isSelect() {
        if (this.isSelect.length) {
          this.selectScore = 0;
          this.isSelect.forEach((item) => {
            this.selectScore += parseInt(item.needscore, 10);
          })
        } else {
          this.selectScore = 0;
          let arr = this.unList;
          arr.forEach((item) => {
            item.is_select = false;
          });
        }
      }
    },
    methods: {
      ...mapMutations({set_isSelect: 'SET_IS_SELECT', set_mailInfo: 'SET_MAIL_INFO'}),
      ...mapActions(['addSelect', 'deleteSelect', 'emptySelect']),
      async _getMyWawaList(page = 1, isRefresh = false) {
        let result = await api.getMyWawaList(page);
        if (result.data.length) {
          let arr = result.data;
          arr.forEach((item) => {
            item.is_select = false;
          });
          if (this.isSelect.length) {
            for (let i = 0; i < this.isSelect.length; i++) {
              let nIndex = arr.findIndex((item) => {
                return item.w_id === this.isSelect[i].w_id;
              })
              console.log("nIndex:", nIndex);
              if (nIndex > -1) {
                arr[nIndex].is_select = true;
              }
            }
          }
          if (page === 1) {
            console.log("is_select:", arr);
            this.unList = arr;
          } else {
            this.unList = this.unList.concat(arr);
          }
          if (isRefresh) {
            this.emptySelect();
            this.$refs.unDeliveryScroller.reset({top: 0}, 500);
            this.$refs.unDeliveryScroller.enablePullup();
            this.$refs.unDeliveryScroller.donePulldown();
          } else {
            this.$refs.unDeliveryScroller.reset();
          }
          if (result.data.length < 10) {
            this.$refs.unDeliveryScroller.disablePullup();
          } else {
            this.$refs.unDeliveryScroller.donePullup();
          }
        } else if (page > 1) {
          this.$refs.unDeliveryScroller.disablePullup();
        } else {
          this.unList = [];
          this.$refs.unDeliveryScroller.disablePullup();
        }
      },
      onPullDown() {
        this.page = 1;
        this._getMyWawaList(1, true);
      },
      onPullUp() {
        this.page += 1;
        this._getMyWawaList(this.page);
      },
      clickItem(item) {
        let arr = this.unList;
        if (arr.length) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].w_id === item.w_id) {
              arr[i].is_select = !arr[i].is_select;
            }
          }
        }
        this.unList = arr;

        let sIndex = this.isSelect.findIndex((val) => {
          console.log("item.w_id:", item.w_id);
          console.log("val.w_id:", val.w_id);
          return item.w_id === val.w_id;
        });
        let data = {
          w_id: item.w_id,
          gifticon: item.gifticon,
          giftname: item.giftname,
          needcoin: item.needcoin,
          needscore: item.needscore,
          is_receive: item.is_receive,
          is_newbee: item.is_newbee,
          ctime: item.ctime
        };
        if (sIndex == -1) {
          this.addSelect(data);
        } else {
          this.deleteSelect({item: data, index: sIndex});
        }
      },
      //申请发货
      applyWawa() {
        if (this.isSelect.length) {
          let arr = [];
          this.isSelect.forEach((item) => {
            arr.push(item.w_id);
          })
          api.getWawaMail(arr.join())
            .then((res) => {
              console.log(res);
              if (res.code == 1) {
                this.set_mailInfo(res.data);
                this.$router.push({path: '/distri'});
              } else {
                showToast(res.msg, 'cancel', 1000, '300px');
              }
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          showToast('请选择你要申请发货的娃娃！', 'text', 1000, '300px');
        }
      },
      //兑换娃娃
      changeWawa() {
        this.isSelect.forEach((item) => {
          console.log(item);
          if (parseInt(item.is_newbee)) {
            showToast(item.giftname + '不能兑换积分', 'cancel', 2000, '300px');
            return false;
          }
          if (!parseInt(item.needscore)) {
            showToast(item.giftname + '为活动娃娃，不能兑换积分', 'cancel', 2000, '300px');
            return false;
          }
        })
        let isNeedscore = -1;//积分为0的娃娃不可兑换
        isNeedscore = this.isSelect.findIndex((item) => {
          return parseInt(item.needscore) <= 0;
        });
        if (isNeedscore !== -1) {
          showToast(this.isSelect[isNeedscore].giftname + "不能兑换积分");
          return;
        }
        if (this.selectScore) {
          this.isChangeScore = true;
        } else {
          showToast('请选择需要兑换的娃娃');
        }
      },
      async confirmChangeCoin() {
        let arr = [];
        this.isSelect.forEach((item) => {
          arr.push(item.w_id);
        })
        let result = await api.getWawaConvertScore(arr.join());
        if (result.code == 1) {
          showToast(result.msg, 'success');
        } else {
          showToast(result.msg, 'cancel')
        }
        this.isChangeScore = false;
        this.page = 1;
        this._getMyWawaList(1, true);
      },
      changeCoinClose() {
        this.isChangeScore = false
      }
    },
    computed: {
      ...mapGetters(['isSelect'])
    },
    destroyed() {

    },
    components: {ScrollView, WawaListItem, TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .un-delivery {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .select-icon {
      padding: 0 16px;
      width: 34px;
      height: 34px;
      .img-spread;
    }
    .empty-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .empty-icon {
        margin-bottom: 30px;
        width: 363px;
        height: 363px;
        .img-spread;
      }
    }
    .bottom-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 120px;
      .btn {
        width: 316px;
        height: 92px;
        .img-spread;
      }
      .exchange {
        position: relative;
        p {
          position: absolute;
          bottom: 18px;
          width: 100%;
          text-align: center;
          font-size: @subFontSize;
          color: @whiteColor;
        }
      }
    }
    .change-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: @bgOpacity;
      display: flex;
      justify-content: center;
      align-items: center;
      .box {
        position: relative;
        width: 564px;
        height: 464px;
        .background-url("~img/wawa/exchange_pop_bg.png")
      }
      .close {
        position: absolute;
        top: -10px;
        right: 0;
        width: 60px;
        height: 60px;
        .img-spread;
      }
      .title {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        text-align: center;
      }
      .desc {
        position: absolute;
        top: 160px;
        left: 40px;
        right: 40px;
        text-align: center;
      }
      .change-btn {
        position: absolute;
        left: 50%;
        bottom: -50px;
        transform: translateX(-50%);
        width: 284px;
        height: 128px;
        line-height: 96px;
        text-align: center;
        color: @whiteColor;
        .background-url("~img/wawa/btn_bg.png")
      }
    }
  }
</style>
