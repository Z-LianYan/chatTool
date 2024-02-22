import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import { Toast } from '../component/teaset/index';
import store from '../store';
export function checkAppUpdate(params:any={}) {
    return new Promise((resolve, reject) => {
        HttpUtils.post(Api.APP_VERSIONS_CHECK_UPDATE, {
          platform: store.AppVersions.platform,
          packageName: 'com.chattool',
          ...params
        }).then((res:any) => {
          switch (res.error) {
            case 0:
              resolve(res.data);
              break;
            default:
              reject(res.data);
              break;
          }
        }).catch(err=>{
          reject(err)
        });;
      })
}