import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import {Theme, Toast} from '../component/teaset/index';


export function get_order_list(params?:any,text='努力加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_ORDER_LIST, params, text).then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.message(res.message);
          reject(res);
          break;
      }
    });
  });
}
export function create_order(params?:any,text='努力加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.CREATE_ORDER, params, text).then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          reject(res);
          Toast.message(res.message);
          break;
      }
    });
  });
}

export function get_buy_ticket_detail(params?:any,text='努力加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_BUY_TICKET_DETAIL, params, text).then(
      (res:any) => {
        switch (res.error) {
          case 0:
            resolve(res.data);
            break;
          default:
            reject(res);
            Toast.message(res.message);
            break;
        }
      },
    );
  });
}

export function cancle_order(params?:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.CANCLE_ORDER, params, '').then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          reject(res);
          Toast.message(res.message);
          break;
      }
    });
  });
}

export function get_order_detail(params?:any,text='努力加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_ORDER_DETAIL, params, text).then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          reject(res);
          Toast.message(res.message);
          break;
      }
    });
  });
}

export function pay_order(params?:any,text='努力加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.PAY_ORDER, params, text).then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          Toast.success(res.message);
          break;
        case 'noBalance':
          reject(res);
          break;
        default:
          reject(res);
          Toast.message(res.message);
          break;
      }
    });
  });
}
