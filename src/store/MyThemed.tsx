
import { observable, action, makeAutoObservable } from 'mobx';

const ftCrDark = '#d2d2d2';
const ftCr2Dark = '#8f8f8f';
const ftCr3Dark = '#8494b0';

const ftCrLight = '#1e1e1e';
const ftCr2Light = '#929292';
const ftCr3Light = '#7586a2';

const primaryColorDark = '#05c160';//深色模式
const primaryColorLight = '#05c160';//明亮模式

//次要 color
const secondaryColorDark = '#76c79d';
const secondaryColorLight = '#76c79d';
 

const defaultTextColorDark = ftCrDark;
const defaultTextColorLight = ftCrLight;
 

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
    ctBg: '#181818',//内容背景颜色,
    ftCr: ftCrDark,//字体颜色
    ftCr2: ftCr2Dark,//字体颜色2
    ftCr3: ftCr3Dark,//朋友圈会员名称字体
    hdBg: '#111111',//头部导航栏背景色
    hdbrBmCr: '#ccc',//头部导航栏底部边框颜色 

    primaryColor: primaryColorDark,//主题色
    secondaryColor: secondaryColorDark,//次要 色

    //button组件 ---start
    btnPrimaryBorderColor: primaryColorDark,// type=‘primary’ 边框颜色
    btnPrimaryColor: primaryColorDark,// type=‘primary’ 背景颜色
    btnPrimaryTitleColor: '#fff',// type=‘primary’ title颜色

    btnColor: primaryColorDark, // type=‘default’ 背景颜色
    btnBorderColor: primaryColorDark,//  type=‘default’ 边框颜色
    btnTitleColor: primaryColorDark,//  type=‘default’ title字体颜色

    btnSecondaryColor: secondaryColorDark, // type='secondary' 背景颜色
    btnSecondaryBorderColor: secondaryColorDark, //type='secondary' 边框颜色
    btnSecondaryTitleColor: '#fff',// type='secondary' title颜色

    btnDangerColor: '#e6a23c',//type='danger' 背景颜色
    btnDangerBorderColor: '#e6a23c',//type='danger' 边框颜色
    btnDangerTitleColor: '#fff', //type='danger' title颜色
    
    btnLinkColor: 'rgba(0, 0, 0, 0)',//type='link' 背景颜色
    btnLinkBorderColor: 'rgba(0, 0, 0, 0)',//type='link' 边框颜色
    btnLinkTitleColor: primaryColorDark,//type='link' title颜色
    //button组件 ----end
 
    //Label - color
    labelTextColor: defaultTextColorDark,
    labelTextTitleColor: defaultTextColorDark,
    labelTextDetailColor: '#989898', 
    labelTextDangerColor: '#a94442',
  }
  light = {//高亮模式
    bg:'#ededed',//屏幕背景底色
    tbBg:'#f7f7f7',//tabbar 背景色
    ctBg: '#ffffff',//内容背景颜色,
    ftCr: ftCrLight,//字体颜色
    ftCr2: ftCr2Light,//字体颜色2
    ftCr3: ftCr3Light,//朋友圈会员名称字体
    hdBg: '#ededed',//头部导航栏背景色
    hdbrBmCr: '#ccc',//头部导航栏底部边框颜色,

    primaryColor: primaryColorLight,//主题色
    secondaryColor: secondaryColorDark,//次要 色
  
    //button组件 ---start
    btnPrimaryBorderColor: primaryColorLight,// type=‘primary’ 边框颜色
    btnPrimaryColor: primaryColorLight,// type=‘primary’ 背景颜色
    btnPrimaryTitleColor: '#fff',

    btnColor: primaryColorLight, // type=‘default’ 背景颜色
    btnBorderColor: primaryColorLight,//  type=‘default’ 边框颜色
    btnTitleColor: '#fff',//  type=‘default’ title字体颜色

    btnSecondaryColor: secondaryColorLight, // type='secondary' 背景颜色
    btnSecondaryBorderColor: secondaryColorLight, //type='secondary' 边框颜色
    btnSecondaryTitleColor: '#fff',// type='secondary' title颜色
    
    btnDangerColor: '#e6a23c', //type='danger' 背景颜色
    btnDangerBorderColor: "#e6a23c", //type='danger' 边框颜色
    btnDangerTitleColor: '#fff', //type='danger' title颜色

    btnLinkColor: 'rgba(0, 0, 0, 0)', //type='link' 背景颜色
    btnLinkBorderColor: 'rgba(0, 0, 0, 0)',//type='link' 边框颜色
    btnLinkTitleColor: primaryColorLight,//type='link' title颜色
    //button组件 ----end

    //Label - color
    labelTextColor: defaultTextColorLight,
    labelTextTitleColor: defaultTextColorLight, 
    labelTextDetailColor: '#989898',
    labelTextDangerColor: '#a94442',
  }
}
const app = new MyThemed()

export default app;