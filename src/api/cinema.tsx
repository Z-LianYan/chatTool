import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import {Theme, Toast} from '../component/teaset/index';
import {ActivityIndicator, Text} from 'react-native';
export function get_cinema_list(params:{}, txt = '努力加载中...') {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_CINEMA_LIST, params, txt).then((res:any) => {
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
export function get_cinema_detail(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_CINEMA_DETAIL, params, '努力加载中...').then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.fail(res.message);
          reject(res.data);
          break;
      }
    });
  });
}
export function get_date_schedule(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_DATE_SCHEDULE, params, '').then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.fail(res.message);
          reject(res.data);
          break;
      }
    });
  });
}

export function get_film_in_schedule_dates(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_FILM_IN_SCHEDULE_DATES, params, '').then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.fail(res.message);
          reject(res.data);
          break;
      }
    });
  });
}
