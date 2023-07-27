import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import {Theme, Toast} from '../component/teaset/index';

export function phone_register(params:any,text='登录中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.PHONE_REGISTER, params, text).then((res:any)=> {
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

export function send_verify_code(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.SEND_VERIFY_CODE, params, '努力加载中...').then((res:any) => {
      console.log('12345', res);
      switch (res.error) {
        case 0:
          resolve(res.data);
          Toast.show({
            icon: 'success',
            duration: 800,
            text: res.message,
          });
          break;
        default:
          // Toast.message(res.message);
          Toast.fail(res.message);
          reject(res.data);
          break;
      }
    });
  });
}

export function get_user_info(params?:any,text="") {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.GET_USER_INFO, params, text).then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          // Toast.message(res.message);
          // Toast.fail(res.message);
          reject(res);
          break;
      }
    });
  });
}

export function login_out(params?:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.LOGIN_OUT, params, '').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.show({
            icon: 'success',
            duration: 800,
            text: res.message,
          });
          resolve(res.data);
          break;
        default:
          // Toast.message(res.message);
          Toast.fail(res.message);
          reject(res.data);
          break;
      }
    });
  });
}

export function user_recharge(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.USER_RECHARGE, params, '充值中...').then((res:any) => {
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
          // Toast.message(res.message);
          Toast.fail(res.message);
          reject(res.data);
          break;
      }
    });
  });
}

export function edit_user_info(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.EDIT_USER_INFO, params, '修改中...').then((res:any) => {
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
          // Toast.message(res.message);
          Toast.fail(res.message||'修改成功');
          reject(res);
          break;
      }
    });
  });
}
