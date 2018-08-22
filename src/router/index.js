import App from "../App";

const Index = r => require([], () => r(require('../components/HomeFragment/Index')));
const HomeIndex = r => require([], () => r(require('../components/HomeFragment/HomeIndex/HomeIndex')));
const XzwwIndex = r => require([], () => r(require('../components/HomeFragment/XzwwFragment/XzwwIndex')));
const NiuIndex = r => require([], () => r(require('../components/HomeFragment/NiuFragment/NiuIndex')));
const ScoreIndex = r => require([], () => r(require('../components/HomeFragment/ScoreFragment/ScoreIndex')));
const EarnIndex = r => require([], () => r(require('../components/HomeFragment/EarnFragment/EarnIndex')));
const MineIndex = r => require([], () => r(require('../components/MineFragment/MineIndex')));
const CoinsIndex = r => require([], () => r(require('../components/CoinsRecharge/CoinsIndex')));

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
      children:[
        {path:'/home',redirect:'/home/index'},
        {path:'/home/index',component:HomeIndex},
        {path:'/home/zxww',component:XzwwIndex},
        {path:'/home/niu',component:NiuIndex},
        {path:'/home/score',component:ScoreIndex},
        {path:'/home/earn',component:EarnIndex},
      ]
    },// 如果此路由需要微信授权请设置为true,默认为false
    {path: '/my', component: MineIndex},
    {path: '/recharge', component: CoinsIndex},
  ]
}];
