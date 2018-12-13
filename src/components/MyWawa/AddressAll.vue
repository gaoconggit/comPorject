<!--
** 所有的收货地址
-->

<template>
  <div class="address-wrapper">
    <title-bar title="收货地址" @get-title-height="titleHeight"/>
    <div class="content">
      <scroller lock-x scrollbar-y :bounce="false" :height="tabHeight + 'px'" class="address-list" ref="addressScroll">
        <ul>
          <li class="addr-item" v-for="addr in addressList" @click.stop="clickAddressItem(addr)">
            <div class="addr-info">
              <div class="user">
                <p class="name">{{addr.username}}</p>
                <p>{{addr.mobile}}</p>
              </div>
              <div class="addr">
                <p>{{addr.addr}}<br>{{addr.addr_info}}</p>
              </div>
            </div>
            <div class="operation">
              <div class="edit" @click.stop="editAddress(addr)"><img src="~/img/wawa/address_edit.png" alt=""></div>
              <div class="delete" @click.stop="deleteAddress(addr)"><img src="~/img/wawa/address_delete.png" alt="">
              </div>
            </div>
          </li>
        </ul>
      </scroller>
      <div class="add-btn" @click="addressAdd">
        <p>新增</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import {Scroller} from "vux";
  import TitleBar from "@/common/TitleBar";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "address-all",
    data() {
      return {
        tabHeight: 0,
        addressList: [],        //收货地址列表
      }
    },
    mounted() {
      if (!this.isSelect.length) {
        this.$router.back();
      }
      this.set_editAddress({});
      this._getAddressList();
      this.$nextTick(() => {
        this.$refs.addressScroll.reset();
      })
    },
    methods: {
      ...mapMutations({
        set_editAddress: 'SET_EDIT_ADDRESS',
        set_select_address: 'SET_SELECT_ADDRESS'
      }),
      async _getAddressList() {
        let result = await api.getAddressList();
        console.log(result);
        this.addressList = result.data;
        this.$refs.addressScroll.reset();
      },
      clickAddressItem(item) {
        this.set_select_address(item);
        this.$router.back();
      },
      editAddress(item) {
        this.set_editAddress(item);
        this.$router.push({path: '/filladdress', query: {status: 'edit'}});
      },
      async deleteAddress(item) {
        let result = await api.deleteAddress(item.addr_id);
        showToast(result.msg, 'success');
        this._getAddressList();
      },
      addressAdd() {
        this.$router.push({path: '/filladdress', query: {status: 'add'}});
      },
      titleHeight(height) {
        this.tabHeight = -(height + 100);
        console.log(this.tabHeight);
      }
    },
    computed: {
      ...mapGetters(['isSelect'])
    },
    components: {TitleBar, Scroller},
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .address-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @lightGrayColor;
    .content {
      position: absolute;
      top: @titleBarHeight;
      left: 0;
      right: 0;
      bottom: 0;
      .address-list {
        padding: 10px 20px;
        height: 900px !important;
        .addr-item {
          margin: 6px 0;
          padding: 20px;
          display: flex;
          align-items: center;
          background-color: #dfdfdf;
          border: 1px solid @grayColor;
          border-radius: 16px;
        }
        .addr-info {
          flex: 1;
          .user {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            .name {
              width: 300px;
              .over-ellip;
            }
          }
        }
        .operation {
          .edit, .delete {
            margin: 10px 0;
            width: 60px;
            height: 60px;
            .img-spread;
          }
        }
      }
      .add-btn {
        position: absolute;
        left: 50%;
        bottom: 100px;
        transform: translateX(-50%);
        width: 316px;
        height: 102px;
        .background-url('~img/wawa/postage_btn.png');
        p {
          color: @whiteColor;
          line-height: 90px;
          text-align: center;
        }
      }
    }
  }
</style>
