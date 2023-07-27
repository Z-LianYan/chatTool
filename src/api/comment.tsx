import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import {Theme, Toast} from '../component/teaset/index';

export function get_comment_list(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_COMMENT_LIST, params, '').then((res:any) => {
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
export function add_comment(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ADD_COMMENT, params, '提交中...').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.success(res.message);
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
export function edit_comment(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.EDIT_COMMENT, params, '编辑中...').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.success(res.message);
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
export function del_comment(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.DEL_COMMENT, params, '删除中...').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.success(res.message);
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

export function get_comment_detail(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_COMMENT_DETAIL, params, '加载中...').then((res:any) => {
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

export function thumb_up(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.THUMB_UP, params, '').then((res:any) => {
      switch (res.error) {
        case 0:
          resolve(res);
          break;
        default:
          Toast.fail(res.message);
          reject(res);
          break;
      }
    });
  });
}

export function comment_jubao(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.COMMENT_JUBAO, params, '').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.success(res.message);
          resolve(res);
          break;
        default:
          Toast.fail(res.message);
          reject(res);
          break;
      }
    });
  });
}

export function get_comment_reply_list(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.get(Api.GET_COMMENT_REPLY_LIST, params, '').then((res:any) => {
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
export function add_comment_reply(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.ADD_COMMENT_REPLY, params, '回复中，请稍等...').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.success(res.message);
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
export function del_comment_reply(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.DEL_COMMENT_REPLY, params, '删除中...').then((res:any) => {
      switch (res.error) {
        case 0:
          Toast.success(res.message);
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
