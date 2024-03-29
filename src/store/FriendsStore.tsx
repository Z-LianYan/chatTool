
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


  new_friends_list = {
    recentlyThreeDays:[],
    threeDaysBefore:[],
  };


  
}
const friend_Store = new FriendsStore()

export default friend_Store;