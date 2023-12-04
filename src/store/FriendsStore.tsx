
import { observable, action, makeAutoObservable,runInAction } from 'mobx';
import * as HttpUtils from '../utils/request';
import * as Api from '../api/constant';
import {Toast} from '../component/teaset/index';
import DeviceInfo from 'react-native-device-info';
import {
  Platform
} from 'react-native';
import { useState } from 'react';
class FriendsStore {
  constructor() {
    // 建议使用这种方式，自动识别类型，不需要再加前缀
    makeAutoObservable(this)
  }

  
  /** 
   * chatLogs 聊天记录
   * login_user_id: {
   *  user_id: {
   *    user_id,
   *    user_name,
   *    avatar,
   *    msg_contents:[]
   *  }
   * }
   * */ 
  addFriendChatLogs = {}//添加朋友时的聊天记录
  chatLogs = {}//添加朋友后聊天记录

  friendsData = {
    count: 0,
    rows: []
  }
  
  async getFriendList(params?:any,text='加载中...') {
    return new Promise((resolve, reject) => {
      HttpUtils.post(Api.GET_FRIENDS_LIST, params, text).then((res:any)=> {
        switch (res.error) {
          case 0:
            runInAction(()=>{
              (this as any).friendsData = res.data;
            });
            resolve(res.data);
            break;
          default:
            Toast.fail(res.message);
            reject(res);
            break;
        }
      });
    });
  }

  new_friends_list = {
    recentlyThreeDays:[],
    threeDaysBefore:[],
  };

  async get_new_friends_list(params?:any,text='') {
    return new Promise((resolve, reject) => {
      HttpUtils.post(Api.GET_NEW_FRIENDS_LIST, params, text).then((res:any)=> {
        switch (res.error) {
          case 0:
            runInAction(()=>{
              this.new_friends_list = res.data;
            });
            resolve(res.data);
            break;
          default:
            Toast.fail(res.message);
            reject(res);
            break;
        }
      });
    });
  }


  async del_friends(params?:any,text='') {
    return new Promise((resolve, reject) => {
      HttpUtils.post(Api.DEL_FRIENDS, params, text).then((res:any)=> {
        switch (res.error) {
          case 0:
          resolve(res.data);
          Toast.show({
            icon: 'success',
            duration: 2000,
            text: res.message,
          });
          break;
        default:
          Toast.fail(res.message);
          reject(res);
          break;
        }
      });
    });
  }

  
}
const friend_Store = new FriendsStore()

export default friend_Store;