import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import {Theme, Toast} from '../component/teaset/index';

export function getFriendsLabelList(params?:any,text='加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.GET_FRIENDS_LABEL_LIST, params, text).then((res:any)=> {
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

export function addFriendsLabel(params?:any,text='添加中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ADD_FRIENDS_LABEL, params, text).then((res:any)=> {
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


export function editFriendsLabel(params?:any,text='编辑中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.EDIT_FRIENDS_LABEL, params, text).then((res:any)=> {
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

export function delFriendsLabel(params?:any,text='删除中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.DEL_FRIENDS_LABEL, params, text).then((res:any)=> {
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

