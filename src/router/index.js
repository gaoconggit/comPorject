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

export default [{
  path: '/',
  component: App,  //顶层路由
  children: [
    {
      path: '',
      redirect: '/home'//默认为首页
    },
    {
      path: '/home', component: Index, meta: { auth: true },
      children: [
        { path: '/home', redirect: '/home/index' },
        { path: '/home/index', name: '首页', component: HomeIndex },
        { path: '/home/zxww', name: '旋转抓娃娃', component: XzwwIndex },
        { path: '/home/niu', name: '扭蛋', component: NiuIndex },
        { path: '/home/score', name: '积分商城', component: ScoreIndex },
        { path: '/home/earn', name: '游戏中心', component: EarnIndex },
      ]
    },// 如果此路由需要微信授权请设置为true,默认为false
    { path: '/my', name: '我的中心', component: MineIndex },
    { path: '/recharge', name: '充值中心', component: CoinsIndex },
    { path: '/room', name: '娃娃机房间', component: RoomIndex, meta: { keepAlive: true } },
    { path: '/details', name: '内容详情', component: FrameContent, meta: { anima: true } },
  ]
}];
