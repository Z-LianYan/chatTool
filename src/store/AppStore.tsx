
import { observable, action, makeAutoObservable } from 'mobx';

class AppStore {
  constructor() {
    // 建议使用这种方式，自动识别类型，不需要再加前缀
    makeAutoObservable(this)
  }

  tabBar = {
    ChatPage: {
      msgCnt: 10123,//消息数量
      isShowDot: false//tabbar是否显示有消息小点 （如果 isShowDot 为 true 消息数量msgCnt 就不会显示 ）
    },
    AddressBookPage: {
      msgCnt: '',
      isShowDot: false
    },
    FindPage: {
      msgCnt: 0,
      isShowDot: true
    },
    MePage: {
      msgCnt: 1,
      isShowDot: false
    },
  };



  userInfo = null;

  locationInfo= {
    city_id: 440100, //默认城市编码
    lng: "",
    lat: "",
    city_name: "广州", //默认城市广州
    isInLocation: true, //判断是否在定位中
    realLocation: null, //真实定位信息
    // isShowSwitchLocationModal: false, //首页（film页）banner ，定位成功显示切换模态框
  };

  rateLevelTex = {
    0: "可以点击星星评分",
    1: "超烂啊,太差了",
    2: "超烂啊,太差了",
    3: "很差,不推荐",
    4: "很差,不推荐",
    5: "一般般",
    6: "一般般",
    7: "还可以,看看也行",
    8: "比较好,可以尝试",
    9: "很不错,推荐看看",
    10: "棒极了,极力推荐",
  };
  
  setUserInfo(info:any){
    this.userInfo = info
  }

  setLocationInfo(info:any,callBack?:()=>void){
    this.locationInfo = {
      ...this.locationInfo,
      ...info
    }
    callBack && callBack();
  }

  cityList = null;

  qiniuUploadConfig = {
    expireTime:'',
    static_host:'',
    upload_token:''
  }; //七牛上传配置
  
}
const app = new AppStore()

export default app;