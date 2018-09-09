<!--
** 修改和添加地址
-->

<template>
  <div class="fix-address">
    <title-bar :title="title"/>
    <div class="center">
      <group class="group">
        <x-input title="收货人:" name="name" v-model="name"/>
        <x-input title="手机号码:" name="mobile" v-model="mobile"/>
        <x-address title="城市:" v-model="addr" :list="addressData"
                   ref="address"
                   placeholder="请选择地址"
                   :show.sync="showAddress"/>
        <x-input title="详细地址:" name="addr_info" v-model="addr_info"/>
      </group>
      <div class="save-btn" @click="confirmAddr">
        <p>保存</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {Group, XInput, XAddress, ChinaAddressV4Data} from "vux";
  import TitleBar from "@/common/TitleBar";
  import {showToast} from "../../common/util/Utils";
  import api from "../../api/BaseService";

  export default {
    name: "fill-address",
    data() {
      return {
        isEdit: false,
        title: "",
        name: "",
        mobile: "",
        addr: [],
        addr_info: "",
        addressData: ChinaAddressV4Data,
        showAddress: false,
      }
    },
    mounted() {
      if (this.$route.query.status === "edit") {
        this.isEdit = true;
        this.title = "修改地址";
        this.name = this.editAddress.username;
        this.mobile = this.editAddress.mobile;
        this.addr = this.editAddress.addr.split(",");
        this.addr_info = this.editAddress.addr_info;
        if (!this.editAddress.addr_id) {
          this.$router.back();
        }
      } else {
        this.isEdit = false;
        this.title = "新增地址";
      }
    },
    methods: {
      confirmAddr() {
        if (!this.name.trim()) {
          showToast('请输入姓名');
          return false;
        }
        if (!this.mobile.trim()) {
          showToast('请输入手机号');
          return false;
        } else if (!/^1[34578]\d{9}$/.test(this.mobile)) {
          showToast('手机号格式不正确');
          return false;
        }
        if (!this.$refs.address.nameValue) {
          showToast('请选择地址');
          return false;
        }
        if (!this.addr_info.trim()) {
          showToast('请输入详细地址');
          return false;
        }
        let address = this.$refs.address.nameValue.replace(/\s/g, ",");
        if (this.isEdit) {
          api.fixAddress(this.editAddress.addr_id, this.name, this.mobile, address, this.addr_info)
            .then((res) => {
              showToast(res.msg, 'success');
              this.$router.back();
            })
            .catch((err) => {
              showToast(err.message, 'cancel');
            })
        } else {
          api.addAddAddress(this.name, this.mobile, address, this.addr_info)
            .then((res) => {
              console.log("新增", res);
              showToast(res.msg, 'success');
              this.$router.back();
            })
            .catch((err) => {
              showToast(err.message, 'cancel');
            })
        }
      }
    },
    computed: {
      ...mapGetters(['editAddress'])
    },
    components: {TitleBar, Group, XInput, XAddress},
  };
</script>

<style lang="less">
  @import "~assets/style/index.less";

  .fix-address {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @lightGrayColor;
    .center {
      padding: 20px;
      position: absolute;
      top: @titleBarHeight;
      left: 0;
      right: 0;
      .group {
        padding: 20px;
        border-radius: 15px;
        box-shadow: 4px 4px 10px @grayColor;
        background-color: @whiteColor;
        .weui-cells {
          margin: 0 !important;
        }
      }
      .save-btn {
        margin: 40px auto;
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
