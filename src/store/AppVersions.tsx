
import { observable, action, makeAutoObservable,runInAction } from 'mobx';
import * as HttpUtils from '../utils/request';
import * as Api from '../api/constant';
import {Toast} from '../component/teaset/index';
import DeviceInfo from 'react-native-device-info';
import {
  Platform
} from 'react-native';
import { useState } from 'react';
import { reject } from 'lodash';
export default class AppVersions {
  constructor() {
    // 建议使用这种方式，自动识别类型，不需要再加前缀
    makeAutoObservable(this)
  }

  static versionName = DeviceInfo.getVersion();
	static app_user_agent = DeviceInfo.getUserAgentSync();
	static app_brand = DeviceInfo.getBrand();
	static platform = Platform.OS;
	static device_id = DeviceInfo.getDeviceId();
	static versionCode  = DeviceInfo.getBuildNumber();
	static unique_id  = DeviceInfo.getUniqueIdSync();
	static package_name = DeviceInfo.getInstallerPackageNameSync();
	static bundle_id = DeviceInfo.getBundleId();
  
  static checkAppUpdate(params:any={}) {
    return new Promise((resolve, reject) => {
      HttpUtils.post(Api.APP_VERSIONS_CHECK_UPDATE, {
        platform: this.platform,
        packageName: 'com.chattool',
        ...params
      }).then((res:any) => {
        runInAction(()=>{
          // this.versionCode = res.data.versionCode;
        });
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
  
}