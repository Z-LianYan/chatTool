
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
   * {
   *  user_id,
   *  user_name,
   *  avatar,
   *  msg_contents:[]
   * }
   * */
  chatLogs = []

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
    console.log('获取新朋友=========》〉》');
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
  
}
const friend_Store = new FriendsStore()

export default friend_Store;