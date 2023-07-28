
import {
  Platform,
  StatusBar,
  NativeModules,
} from 'react-native';

import dev from './dev';
import prod from './prod';

const {  StatusBarManager } = NativeModules;

let config = {
  // HOST: '',
  STATUS_BAR_HEIGHT : Platform.OS === "android"?  StatusBar.currentHeight : StatusBarManager.HEIGHT,//状态栏高度
  
  // theme: {
  //   mgDotCr: '#fe514d',//有消息显示的小点颜色
  //   mgDotFtCr: '#ffffff',//有消息显示的小点字体颜色
  //   dark:{//深色模式
  //     bg:'#111111',//背景色
  //     tbBg:'#1e1e1e',//tabbar 背景色
  //     actColor: '#1fba6c',//tabbar激活颜色
  //     ctBg: '#181818',//内容背景颜色,
  //     ftCr: '#d2d2d2',//字体颜色
  //     ftCr2: '#8f8f8f',//字体颜色2
  //     ftCr3: '#8494b0',//朋友圈会员名称字体
  //     headerborderBottomColor: '#ccc'//头部导航栏底部边框颜色
  //   },
  //   light:{//高亮模式
  //     bg:'#ededed',//背景色
  //     tbBg:'#f7f7f7',//tabbar 背景色
  //     actColor: '#05c160',//tabbar激活颜色
  //     ctBg: '#ffffff',//内容背景颜色,
  //     ftCr: '#1e1e1e',//字体颜色
  //     ftCr2: '#929292',//字体颜色2
  //     ftCr3: '#7586a2',//朋友圈会员名称字体
  //     headerborderBottomColor: '#ccc'//头部导航栏底部边框颜色
  //   }
  // },

  ...dev,
}

process.env.NODE_ENV=='development'?config = {
  ...config,
  ...dev
}: config = {
  ...config,
  ...prod
}

export default config;