
import dayjs from 'dayjs';
import { observable, action, makeAutoObservable, runInAction } from 'mobx';

class AppStore {
  constructor() {
    // 建议使用这种方式，自动识别类型，不需要再加前缀
    makeAutoObservable(this)
  }

  connecting = false; 
  
  curRouteName = 'ChatListPage'; //当前tabbar 所在的路有 （用户消息数量显示）
  tabBar = {
    ChatListPage: {
      msgCnt: 0,//消息数量
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
      msgCnt: 0, 
      isShowDot: false
    },
  };

  

  userInfo = null;
  setUserInfo(info:any){
    runInAction(()=>{
      this.userInfo = info
    });
  }
  

  qiniuUploadConfig = {
    expireTime:'',
    static_host:'',
    upload_token:''
  }; //七牛上传配置


  search_user_info = null;

  
}
const app = new AppStore()

export default app;