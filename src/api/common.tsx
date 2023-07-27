import * as HttpUtils from '../utils/request';
import * as Api from '../api/constant';
import {Toast} from '../component/teaset/index';
import store from '../store';
import dayjs from 'dayjs';

export function get_upload_qiuniu_config(params?:any) {
  return new Promise((resolve, reject) => {
    if(store.AppStore.qiniuUploadConfig.expireTime && store.AppStore.qiniuUploadConfig.expireTime>dayjs().add(5,'minutes').format('YYYY-MM-DD HH:mm:ss')) {
      return resolve(store.AppStore.qiniuUploadConfig);
    }else {
      store.AppStore.qiniuUploadConfig = {
        expireTime:'',
        static_host:'',
        upload_token:''
      }
    }

    console.log('------------>>哈哈哈哈')
    HttpUtils.get(Api.GET_UPLOAD_QINIU_CONFIG, params, '').then((res:any )=> {
      switch (res.error) {
        case 0:
          resolve(res.data);
          store.AppStore.qiniuUploadConfig = res.data;
          break;
        default:
          Toast.fail(res.message);
          reject(res);
          break;
      }
    }).catch(err=>{
      reject(err);
    });
  });
}

export function upload_file(params:any) {
  return new Promise((resolve, reject) => {
    HttpUtils.post(Api.UPLOAD_FILE, params, '上传中...',{
      "Content-Type": "multipart/form-data"
    }).then((res:any )=> {
      console.log('res----->>',res)
      switch (res.error) {
        case 0:
          resolve(res.data);
          break;
        default:
          Toast.fail(res.message);
          reject(res);
          break;
      }
    }).catch(err=>{
      reject(err);
    });
  });
}
