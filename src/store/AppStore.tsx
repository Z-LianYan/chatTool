
import { observable, action, makeAutoObservable } from 'mobx';

class AppStore {
  constructor() {
    // 建议使用这种方式，自动识别类型，不需要再加前缀
    makeAutoObservable(this)
  }

  curRouteName = 'ChatListPage'; //当前tabbar 所在的路有 （用户消息数量显示）
  tabBar = {
    ChatListPage: {
      msgCnt: 10123,//消息数量
      isShowDot: false//tabbar是否显示有消息小点 （如果 isShowDot 为 true 消息数量msgCnt 就不会显示 ）
    },
    AddressBookPage: {
      msgCnt: 0, //显示tabbar通讯录 上的数量
      msgCnt2: 0, // 显示通讯录页面上的数量
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
  setUserInfo(info:any){
    this.userInfo = info
  }
  
  // locationInfo= {
  //   city_id: 440100, //默认城市编码
  //   lng: "",
  //   lat: "",
  //   city_name: "广州", //默认城市广州
  //   isInLocation: true, //判断是否在定位中
  //   realLocation: null, //真实定位信息
  //   // isShowSwitchLocationModal: false, //首页（film页）banner ，定位成功显示切换模态框
  // };
  // setLocationInfo(info:any,callBack?:()=>void){
  //   this.locationInfo = {
  //     ...this.locationInfo,
  //     ...info
  //   }
  //   callBack && callBack();
  // }

  // cityList = null;

  qiniuUploadConfig = {
    expireTime:'',
    static_host:'',
    upload_token:''
  }; //七牛上传配置


  search_user_info = null;

  addFirendsApply = [];

  chatLogs = {};
  
}
const app = new AppStore()

export default app;