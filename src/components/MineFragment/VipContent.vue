/**
 *  VIP中心
 *
 */
 <template>
     <div class="vip-wrapper">
         <title-bar title="VIP会员俱乐部"/>
         <div class="vip-content">
            <header class="vip-headers">
              <div class="avatar">
                <img :src="userInfo.avatar" alt="">
              </div>
              <div class="mine-floor" ref="mineFloor">
                <div class="mine">
                  <!--用户名-->
                  <p class="name">{{userInfo.user_nicename}}</p>
                  <!--id号-->
                  <p class="id">ID：{{userInfo.id}}</p>
                </div>
              </div>
              <div class="Grade">
                <img :src="Grade" class="img-style" alt="">
              </div>
            </header>
            <div class="vip-info">
              <div class="vip-club boxs">
                <p class="titles">VIP会员俱乐部</p>
                <div class="club-content">
                  <div class="imgs">
                    <div class="club-imgs">
                      <img  :src="SignIn" class="img-style" alt="">
                    </div>
                    <p>签到翻倍</p>
                  </div>
                  <div class="imgs">
                    <div class="club-imgs">
                      <img  :src="TreasureBox" class="img-style" alt="">
                    </div>
                    <p>VIP宝箱</p>
                  </div>
                  <div class="imgs">
                    <div class="club-imgs">
                      <img  :src='Integral' class="img-style" alt="">
                    </div>
                    <p>积分赠送</p>
                  </div>
                  <div class="imgs">
                    <div class="club-imgs">
                      <img  :src="Power" class="img-style" alt="">
                    </div>
                    <p>总换权限</p>
                  </div>
                  <div class="imgs">
                    <div class="club-imgs">
                      <img  :src="VipRoom" style="width:100%; height:100%;" alt="">
                    </div>
                    <p>VIP房间</p>
                  </div>
                  <div class="imgs">
                    <div class="club-imgs">
                      <img  :src="Discount" class="img-style" alt="">
                    </div>
                    <p>抓取折扣</p>
                  </div>
                </div>
              </div>
              <div class="vip-box boxs">
                <p class="titles">VIP宝箱</p>
                <div class="max-box">
                  <div class="location">
                    <img src="../../assets/img/vip/location.png" class="img-style" alt="">
                  </div>
                  <span>离下一个宝箱开启</span>
                  <span class="rmb">差{{parseInt(vipData.next_box_money)/100}}元</span>
                </div>
                <div class="bao-box ">
                  <div class="bao-box-img">
                    <div class="box-line">
                    <img  src="../../assets/img/vip/vip_box_line.png" class="img-style" alt="">
                    </div>
                    <div class="left">
                      <div class="lefts"
                           v-for="(item,index) in vipData.reward_box"
                           :key="item.level"
                           v-if="index<3"
                           @click="handleClick(item)"

                      >
                        <div class="left-img">
                          <div class="box-bg" v-if="item.status==0">
                            <img :src="boxbg" class="img-style" alt="">
                          </div>
                          <div class="left-bao">
                            <img :src="item.status==2?require('../../assets/img/vip/chest_mu_yes.png'):require('../../assets/img/vip/chest_mu_no.png')" class="img-style" alt="">
                          </div>
                          <div class="VIP">VIP{{item.level}}</div>
                        </div>
                        <p>充值满<br/>{{parseInt(item.vip_score)/100}}元</p>
                      </div>
                    </div>
                    <div class="right">
                      <div class="lefts" v-for="(item,index) in vipData.reward_box" :key="item.level" v-if="index>2" @click="handleClick(item)">
                        <div class="left-img">
                          <div class="box-bg" v-if="item.status==0">
                            <img :src="boxbg" class="img-style" alt="">
                          </div>
                          <div class="left-bao">
                            <img :src="item.status==2?require('../../assets/img/vip/chest_jin_yes.png'):require('../../assets/img/vip/chest_jin_no.png')" class="img-style" alt="">
                          </div>
                          <div class="VIP">VIP{{item.level}}</div>
                        </div>
                        <p>充值满<br/>{{parseInt(item.vip_score)/100}}元</p>
                      </div>
                    </div>
                  </div>
                  <audio id="audio" ref="audios">
                    <source src="../../assets/video/open_box_music.mp3"/>
                  </audio  >
                </div>
              </div>
              <div class="vip-explain boxs">
                <p class="titles">特权说明</p>
                <div class="explain" >
                  <img class="img-style" :src="vipData.vip_intro_img"   alt="">
                </div>
              </div>
            </div>

         </div>
     </div>
 </template>

 <script>
import {mapGetters} from "vuex"
import TitleBar from "@/common/TitleBar";
/*请求*/
import BaseService from "../../api/BaseService.js";
import {showToast} from "../../common/util/Utils";

export default {
  name: "VipContent",
  data() {
    return {
      vipData: {},
      vipReward:{},
      Grade:"",
      SignIn:require("../../assets/img/vip/vip_icon_1_no.png"),
      TreasureBox:require("../../assets/img/vip/vip_icon_2_no.png"),
      Integral:require("../../assets/img/vip/vip_icon_3_no.png"),
      Power:require("../../assets/img/vip/vip_icon_4_no.png"),
      VipRoom:require("../../assets/img/vip/vip_icon_5_no.png"),
      Discount:require("../../assets/img/vip/vip_icon_6_no.png"),
      boxbg:require("../../assets/img/vip/vip_box_bg_2.png"),
      chest:require("../../assets/img/vip/chest_mu_no.png"),
      chest1:require("../../assets/img/vip/chest_jin_no.png"),
    };
  },
  methods: {
    handleClick(re){
      console.log(re);
      if(re.status==0){
        showToast("暂时不能领取宝箱");
      }else if(re.status==1){
        this.vipBoxReward(re.level);
      }else {
        showToast("你已经领取过该宝箱");
      }
    },
    VipInformations :function () {
      BaseService.VipInformations()
        .then( (result)=> {
          this.vipData = result.data;
          console.log(result.data);
          this.VipClub();
          this.VipCode();
        }).catch( (err)=> {
          console.log(err);
      })
    },
    vipBoxReward :function (r) {
      BaseService.VipBoxReward(r)
        .then( (result)=> {
          console.log(result.data);
          showToast("成功领取"+result.data.reward_coin+"金币", 'success');
          this.$refs.audios.play();
          /*this.open_box_music;*/

          this.VipInformations();
        }).catch( (err)=> {
        console.log(err);
      })
    },
    VipClub:function () {
      for(let i=0; i<this.vipData.privileges.length; i++){
        if(this.vipData.privileges[i]==="sign_in_extral"){
          this.SignIn=require("../../assets/img/vip/vip_icon_1.png");
        }else if(this.vipData.privileges[i]==="vip_reward_box"){
          this.TreasureBox=require("../../assets/img/vip/vip_icon_2.png");
        }else if(this.vipData.privileges[i]==="room_score_extral"){
          this.Integral=require("../../assets/img/vip/vip_icon_3.png");
        }else if(this.vipData.privileges[i]==="exchange"){
          this.Power=require("../../assets/img/vip/vip_icon_4.png");
        }else if(this.vipData.privileges[i]==="vip_room"){
          this.VipRoom=require("../../assets/img/vip/vip_icon_5.png");
        }else {
          this.Discount=require("../../assets/img/vip/vip_icon_6.png");
        }
      }

    },
    VipCode:function () {
      switch(parseInt(this.vipData.level)){
        case 1:
          this.Grade=require("../../assets/img/vip/vip_1.png");
          break;
        case 2:
          this.Grade=require("../../assets/img/vip/vip_2.png");
          break;
        case 3:
          this.Grade=require("../../assets/img/vip/vip_3.png");
          break;
        case 4:
          this.Grade=require("../../assets/img/vip/vip_4.png");
          break;
        case 5:
          this.Grade=require("../../assets/img/vip/vip_5.png");
          break;
        case 6:
          this.Grade=require("../../assets/img/vip/vip_6.png");
          break;
        case 7:
          this.Grade=require("../../assets/img/vip/vip_7.png");
          break;
        default:
          this.Grade="";
      }
    },

  },
  computed:{
    ...mapGetters(['userInfo']),
  },
  mounted(){
    this.VipInformations();
  },
  destroyed(){
    this.$refs.audios=null;
  },
  components: {
    TitleBar
  }
};
</script>

 <style scoped lang="less">
   @import "~assets/style/index.less";
   .lefts{
     width:140px;
     height: 100%;
     float:left;
     margin-left:40px;
     .left-img{
       width:100%;
       height:140px;
       pading-top:20px;
       position: relative;
       .box-bg{
        width:100%;
        height:100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
         z-index:4;
       }
       .left-bao{
         width:70%;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translateX(-50%) translateY(-50%);
         z-index:3;

       }
       .VIP{
         width:80px;
         height:25px;
         background:#fe0002;
         color:#fff;
         font-size: 16px;
         text-align: center;
         line-height: 25px;
         border-radius:10px;
         position: absolute;
         top:88%;
         left:30px;
         z-index:4;
       }

     }
     p{
       width:85px;
       height:25px;
       font-size: 16px;
       text-align: center;
       line-height: 30px;
       margin:10px auto;
     }
   }
   .titles{
       height:76px;
       font-size:@minFontSize;
       line-height: 76px;
       padding-left: 25px;
       box-sizing: border-box;

   }
   .vip-wrapper {
     background: linear-gradient(to bottom, @mainColor 5%, #fff 50%);
     .title {
       position: fixed;
       top: 0;
       left: 0;
       right: 0;
       z-index: 10;
     }
     .boxs {
       width:710px;
       height:496px;
       border-radius: 25px;
       box-shadow: 1px 1px 5px #ccc;
       background: #fff;
       display: block;
       margin:auto;
       overflow: hidden;
     }
     .img-style{
       width:100%; height:100%;
     }
     .vip-content{
       position: relative;
       top:0px;
       background:linear-gradient(#ff8eac,white);
       .vip-headers{
         position: relative;
         top: 0;
         z-index: 2;
         width:710px;
         height: 200px;
         margin:auto;
         .avatar {
           position: absolute;
           top: 50%;
           width: 120px;
           height: 120px;
           border-radius: 50%;
           border: 12px solid @auxColor;
           overflow: hidden;
           .img-spread;
           transform: translateY(-50%);
         }
         .mine-floor {
           position: absolute;
           top:50%;
           left:200px;
           transform: translateY(-50%);
           z-index: 1;
           width: 200px;
           height: 90px;
           .mine {
             text-align:left;
             color:#fff;
             p {
               font-size: @subFontSize;
               line-height: 40px;
             }
           }
         }
         .Grade{
           width:120px;
           height:84px;
           position: absolute;
           top:50%;
           right:0;
           transform:translateY(-50%);

         }
       }
       .vip-info{
         position: relative;
         z-index: 3;
         width:100%;
         .vip-club{
           .club-content{
             width:660px;
             height:400px;
             margin:auto;
             overflow: hidden;
             .clearfix;
             .imgs{
               width:220px;
               height:200px;
               float: left;
               .club-imgs{
                 width:100%;
                 height:100%;
               }
               p{
                 width:100%;
                 height:50px;
                 margin-top: -50px;
                 font-size:@minFontSize;
                 text-align: center;
                 line-height:50px;

               }
             }
           }
         }
         .vip-box{
           margin:20px auto;
           position: relative;
           .clearfix;
           .max-box{
             width:350px;
             height:76px;
             font-size:@minFontSize;
             line-height: 76px;
             position: absolute;
             right:0px;
             top:0px;
             .location{
               width:30px;
               height: 30px;
               float:left;
               margin:8px 10px 0px 0px;
             }
             .rmb{
               color:#efc650;
             }
           }
           .bao-box{
             width:100%;
             height:400px;
             .clearfix;
             .bao-box-img{
               width:90%;
               height:100%;
               margin:auto;
               position: relative;
               .box-line{
                 width:589px;
                 height: 243px;
                 .img-spread;
                 position:absolute;
                 top:50px;
               }
               .left{
                 width:540px;
                 height: 200px;
                 position:absolute;
                 top:0px;
                 left:0px;
                 &:nth-child(1){
                   margin-left: 0px;
                 }

               }
               .right{
                 width:540px;
                 height: 200px;
                 position:absolute;
                 top:210px;
                 right:0px;
               }
             }
           }
         }
         .vip-explain{
           .explain{
             width:100%;
             height:400px;
           }
         }
       }
     }
   }
</style>

