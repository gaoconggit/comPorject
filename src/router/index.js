import App from "../App";

const Index = r => require([], () => r(require('../components/HomeFragment/Index')));
const HomeIndex = r => require([], () => r(require('../components/HomeFragment/HomeIndex/HomeIndex')));
const XzwwIndex = r => require([], () => r(require('../components/HomeFragment/XzwwFragment/XzwwIndex')));
const NiuIndex = r => require([], () => r(require('../components/HomeFragment/NiuFragment/NiuIndex')));
const ScoreIndex = r => require([], () => r(require('../components/HomeFragment/ScoreFragment/ScoreIndex')));
const EarnIndex = r => require([], () => r(require('../components/HomeFragment/EarnFragment/EarnIndex')));
const MineIndex = r => require([], () => r(require('../components/MineFragment/MineIndex')));
const CoinsIndex = r => require([], () => r(require('../components/CoinsRecharge/CoinsIndex')));
const RoomIndex = r => require([], () => r(require('../components/RoomFragment/RoomIndex')));
const FrameContent = r => require([], () => r(require('../common/FrameContent')));
const VipContent = r => require([], () => r(require('../components/MineFragment/VipContent')));
const MailIndex = r => require([], () => r(require('../components/MailFragment/MailIndex')));
const UseGetDetailed = r => require([], () => r(require('../components/MineFragment/UseGetDetailed')));

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
        {path: '/home/niu', name: '扭蛋', component: NiuIndex, meta: {keepAlive: true}},
        {path: '/home/score', name: '积分商城', component: ScoreIndex},
        {path: '/home/earn', name: '游戏中心', component: EarnIndex, meta: {keepAlive: true}},
      ]
    },// 如果此路由需要微信授权请设置为true,默认为false
    {path: '/my', name: '我的中心', component: MineIndex, meta: {keepAlive: true}},
    {path: '/recharge', name: '充值中心', component: CoinsIndex,},
    {path: '/room', name: '娃娃机房间', component: RoomIndex},
    {path: '/details', name: '内容详情', component: FrameContent},
    {path: '/vip', name: 'VIP会员俱乐部', component: VipContent},
    {path: '/email', name: '邮件中心', component: MailIndex},
    {path: '/coindetail', name: '金币明细', component: UseGetDetailed},
    {path: '/scoredetail', name: '积分明细', component: UseGetDetailed},
  ]
}];
