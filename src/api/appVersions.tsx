import * as HttpUtils from '../utils/request';
import * as Api from './constant';
import { Toast } from '../component/teaset/index';
// export function checkAppUpdate(params:any={}) {
//   return new Promise((resolve, reject) => {
//     HttpUtils.post(Api.APP_VERSIONS_CHECK_UPDATE, {
//       platform: 'android',
//       packageName: 'com.filmticketsaleclientrnts',
//       ...params
//     }).then((res:any) => {
//       // console.log('=========>>>',res.data);
//       switch (res.error) {
//         case 0:
//           resolve(res.data);
//           break;
//         default:
//           reject(res.data);
//           break;
//       }
//     });
//   });
// }
