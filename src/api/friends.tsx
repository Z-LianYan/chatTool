import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import {Theme, Toast} from '../component/teaset/index';
import { runInAction } from 'mobx';
import store from "../store";
export function getFriendList(params?:any,text='加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.GET_FRIENDS_LIST, params, text).then((res:any)=> {
      switch (res.error) {
        case 0:
          runInAction(()=>{
            store.FriendsStore.friendsData = res.data;
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

export function searchFriends(params?:any,text='加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.SEARCH_FRIENDS, params, text).then((res:any)=> {
      switch (res.error) {
        case 0:
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

export function editFriends(params?:any,text='编辑中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.EDIT_FRIENDS, params, text).then((res:any)=> {
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


export function ADD_FRIENDS_APPLY(params?:any,text='添加中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ADD_FRIENDS_APPLY, params, text).then((res:any)=> {
      switch (res.error) {
        case 0:
          resolve(res.data);
          if(res.message) Toast.show({
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
export function ACCEPT_ADD_FRIENDS(params?:any,text='操作中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ACCEPT_ADD_FRIENDS, params, text).then((res:any)=> {
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


export function get_new_friends_list(params?:any,text='加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.GET_NEW_FRIENDS_LIST, params, text).then((res:any)=> {
      switch (res.error) {
        case 0:
          runInAction(()=>{
            store.FriendsStore.new_friends_list = res.data;
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


export function  del_friends(params?:any,text='') {
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