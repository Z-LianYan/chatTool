
import { observable, action, makeAutoObservable } from 'mobx';

class MyThemed {
  constructor() {
    // 建议使用这种方式，自动识别类型，不需要再加前缀
    makeAutoObservable(this)
  }

  mgDotCr='#fe514d'//有消息显示的小点颜色
  mgDotFtCr= '#ffffff'//有消息显示的小点字体颜色
  dark = {//深色模式
    bg:'#111111',//屏幕背景底色
    tbBg:'#1e1e1e',//tabbar 背景色
    actColor: '#1fba6c',//tabbar激活颜色
    ctBg: '#181818',//内容背景颜色,
    ftCr: '#d2d2d2',//字体颜色
    ftCr2: '#8f8f8f',//字体颜色2
    ftCr3: '#8494b0',//朋友圈会员名称字体
    hdBg: '#111111',//头部导航栏背景色
    hdbrBmCr: '#ccc',//头部导航栏底部边框颜色
    btnPrimaryColor:"#05c160",//按钮主题色
  }
  light = {//高亮模式
    bg:'#ededed',//屏幕背景底色
    tbBg:'#f7f7f7',//tabbar 背景色
    actColor: '#05c160',//tabbar激活颜色
    ctBg: '#ffffff',//内容背景颜色,
    ftCr: '#1e1e1e',//字体颜色
    ftCr2: '#929292',//字体颜色2
    ftCr3: '#7586a2',//朋友圈会员名称字体
    hdBg: '#ededed',//头部导航栏背景色
    hdbrBmCr: '#ccc',//头部导航栏底部边框颜色,
    btnPrimaryColor:"#05c160",//按钮主题色
  }
}
const app = new MyThemed()

export default app;