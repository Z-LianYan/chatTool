import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import { Toast } from '../component/teaset/index';

export function get_schedule_info(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_SCHEDULE_INFO, params, '努力加载中...').then((res:any) => {
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

export function get_seat(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_SEAT, params, '努力加载中...').then((res:any) => {
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
