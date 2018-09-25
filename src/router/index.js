import App from "../App";
/*首页顶部按钮页面*/
const Index = r => require([], () => r(require('../components/HomeFragment/Index')));
/*首页整体按钮组件*/
const HomeIndex = r => require([], () => r(require('../components/HomeFragment/HomeIndex/HomeIndex')));
/*旋转娃娃页面组件*/
const XzwwIndex = r => require([], () => r(require('../components/HomeFragment/XzwwFragment/XzwwIndex')));
/*扭蛋页面组件*/
const NiuIndex = r => require([], () => r(require('../components/HomeFragment/NiuFragment/NiuIndex')));
/*扭蛋房间页面组件*/
const NiuDanRoom = r => require([], () => r(require('../components/HomeFragment/NiuFragment/NiuDanRoom')));
/*积分商城页面*/
const ScoreIndex = r => require([], () => r(require('../components/HomeFragment/ScoreFragment/ScoreIndex')));
/*赚金币页面*/
const EarnIndex = r => require([], () => r(require('../components/HomeFragment/EarnFragment/EarnIndex')));
/*我的  用户的信息页面*/
const MineIndex = r => require([], () => r(require('../components/MineFragment/MineIndex')));
/*充值中心列表*/
const CoinsIndex = r => require([], () => r(require('../components/CoinsRecharge/CoinsIndex')));

const RoomIndex = r => require([], () => r(require('../components/RoomFragment/RoomIndex')));
const FrameContent = r => require([], () => r(require('../common/FrameContent')));
const VipContent = r => require([], () => r(require('../components/MineFragment/VipContent')));
const MailIndex = r => require([], () => r(require('../components/MailFragment/MailIndex')));
const SystemSet = r => require([], () => r(require('../components/MineFragment/SystemSet')));
const Faq = r => require([], () => r(require('../components/MineFragment/Faq')));
const CoinDetailed = r => require([], () => r(require('../components/MineFragment/CoinDetailed')));
const ScoreDetailed = r => require([], () => r(require('../components/MineFragment/ScoreDetailed')));
const InvitationCode = r => require([], () => r(require('../components/MineFragment/InvitationCode')));
const InvitationInput = r => require([], () => r(require('../components/MineFragment/InvitationInput')));
const WawaIndex = r => require([], () => r(require('../components/MyWawa/WawaIndex')));
const HistoryIndex = r => require([], () => r(require('../components/Historys/HistoryIndex')));
const HistoryDetail = r => require([], () => r(require('../components/Historys/HistoryDetail')));
const DistriDetail = r => require([], () => r(require('../components/MyWawa/DistriDetail')));
const AddressAll = r => require([], () => r(require('../components/MyWawa/AddressAll')));
const FillAddress = r => require([], () => r(require('../components/MyWawa/FillAddress')));
const MailDetails = r => require([], () => r(require('../components/MyWawa/MailDetails')));
const WheelSurf = r => require([], () => r(require('../components/HomeFragment/EarnFragment/WheelSurf')));
const RoomUserData = r => require([], () => r(require('../components/RoomFragment/RoomUserData')));
const RedEnvelopes = r => require([], () => r(require('../components/RedEnvelopes/RedEnvelopes')));

export default [{
  path: '/',
  component: App,  //顶层路由
  children: [
    {
      path: '',
      redirect: '/home'//默认为首页
    },
    {
      path: '/home', component: Index, meta: {auth: true},
      children: [
        {path: '/home', redirect: '/home/index'},
        {path: '/home/index', name: '首页', component: HomeIndex, meta: {keepAlive: true}},
        {path: '/home/zxww', name: '旋转抓娃娃', component: XzwwIndex},
        {path: '/home/niu', name: '扭蛋', component: NiuIndex},
        {path: '/home/score', name: '积分商城', component: ScoreIndex},
        {path: '/home/earn', name: '游戏中心', component: EarnIndex, meta: {keepAlive: true}},
      ]
    },// 如果此路由需要微信授权请设置为true,默认为false
    {path: '/my', name: '我的中心', component: MineIndex, meta: {keepAlive: true}},
    {path: '/recharge', name: '充值中心', component: CoinsIndex},
    {path: '/room', name: '娃娃机房间', component: RoomIndex},
    {path: '/niu', name: '扭蛋房间', component: NiuDanRoom},
    {path: '/details', name: '内容详情', component: FrameContent, meta: {keepAlive: true}},
    {path: '/vip', name: 'VIP会员俱乐部', component: VipContent},
    {path: '/email', name: '邮件中心', component: MailIndex},
    {path: '/system', name: '系统设置 ', component: SystemSet},
    {path: '/faq', name: '常见问题', component: Faq},
    {path: '/coin', name: '金币明细', component: CoinDetailed},
    {path: '/score', name: '积分明细', component: ScoreDetailed},
    {path: '/mywawa', name: '我的娃娃', component: WawaIndex},
    {path: '/history', name: '游戏历史', component: HistoryIndex},
    {path: '/history/:id', name: '游戏申诉', component: HistoryDetail},
    {path: '/distri', name: '配送详情', component: DistriDetail},
    {path: '/address', name: '收货地址', component: AddressAll},
    {path: '/filladdress', name: '新增修改地址', component: FillAddress},
    {path: '/maildetails', name: '订单详情', component: MailDetails},
    {path: '/invitation', name: '我的邀请码', component: InvitationCode},
    {path: '/invitationinput', name: '输入邀请码', component: InvitationInput},
    {path: '/wheel', name: '转盘', component: WheelSurf},
    {path: '/user', name: '用户资料', component: RoomUserData},
    {path: '/envelopes', name: '用户资料', component: RedEnvelopes},
  ]
}];
