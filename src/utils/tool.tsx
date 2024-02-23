import dayjs from 'dayjs';
import store from '../store/index';
import _ from 'lodash';
import { runInAction } from 'mobx';
import { Platform } from 'react-native';
import { Toast } from '../component/teaset';
import RNFS from 'react-native-fs';
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import AsyncStorage from '@react-native-async-storage/async-storage';
const getFinalRowMsg =  function(msg_contents:any[]){
    let len = msg_contents.length-1;
    if(len<0) return null;
    for(let i=len;i>=0;i--){
      if(msg_contents[i].msg_type || msg_contents[i].type=='time') return msg_contents[i];
    }
    return null;
}
export function uniqueMsgId(user_id:string){
    return (user_id?String(user_id):'') + String(dayjs().valueOf()) + String(Math.random()).substring(2,6);
}
type handlerChatLogType = {
    chatLogs:any,
    login_user_id: number,
    data: any,
    type?: string,//type: 'addFriendsApply'
};
export async function handlerChatLog({
    chatLogs = {},
    login_user_id,
    data,
    type = ''
}:handlerChatLogType){
    return new Promise((resolve,reject)=>{
        runInAction(async ()=>{
            const from_user_id = data.user_id;
            if(!data.msg_content) return;
            const addTypes = ['addFriendsApply','addFriendApplyReply'];
            const time = {
                type: 'time',
                created_at: data?.msg_content?.created_at,
            }, des = {
                type: 'des',
                des: '以上是打招呼的内容'
            },des2 = {
                type: 'des',
                des: `你已添加了${data?.user_name},现在可以开始聊天了`
            }
            if(!chatLogs[login_user_id]){
                chatLogs[login_user_id] = {
                    userIdSort: [from_user_id]
                };
                let msg_contents = [data.msg_content];
                //acceptAddFriends 同意添加好友 notAddFriendVerify 对方开启了添加好友无需认证， alreadyFriend 你已经是对方好友 (notAddFriendVerify,alreadyFriend 申请添加好友的时候返回的)
                /**
                 * 
                 * notAddFriendVerify alreadyFriend 添加人 传给 添加人的类型
                 * 
                 * acceptAddFriends  接受人同意添加好友时通知添加人 传给 添加人的类型
                 * 
                 * notAddFriendVerifyAcceptAddFriends 接受人开启了无需认证添加好友申请 传给 接受人的类型
                */
                if(['notAddFriendVerifyAcceptAddFriends'].includes(type)) msg_contents = msg_contents.concat([des,des2]);// 对方开启了添加好友无需认证默认接受添加好友
                if(['acceptAddFriends','notAddFriendVerify','alreadyFriend'].includes(type)) msg_contents = msg_contents.concat([des]); 
                if(!addTypes.includes(type))  msg_contents.unshift(time);
                chatLogs[login_user_id][from_user_id] = {
                    user_id:  data?.user_id,
                    user_name:  data?.user_name,
                    f_user_name_remark: data?.f_user_name_remark,
                    avatar:  data?.avatar, 
                    msg_contents: msg_contents,
                }
            }else{
                if(!Array.isArray(chatLogs[login_user_id].userIdSort)){
                    chatLogs[login_user_id].userIdSort = [];
                }
                const idx = chatLogs[login_user_id].userIdSort.indexOf(from_user_id);
                if(idx!=-1) chatLogs[login_user_id].userIdSort.splice(idx,1);
                chatLogs[login_user_id].userIdSort.unshift(from_user_id);

                if(!chatLogs[login_user_id][from_user_id]){
                    let msg_contents = [data.msg_content];
                    if(!addTypes.includes(type)) msg_contents.unshift(time);
                    //acceptAddFriends 同意添加好友 notAddFriendVerify 对方开启了添加好友无需认证， alreadyFriend 你已经是对方好友  (notAddFriendVerify,alreadyFriend 申请添加好友的时候返回的)
                    if(['notAddFriendVerifyAcceptAddFriends'].includes(type)) msg_contents = msg_contents.concat([des,des2]);// 对方开启了添加好友无需认证默认接受添加好友
                    if(['acceptAddFriends','notAddFriendVerify','alreadyFriend'].includes(type)) msg_contents = msg_contents.concat([des]); 
                    
                    chatLogs[login_user_id][from_user_id]={
                        user_id:  data?.user_id,
                        user_name:  data?.user_name,
                        f_user_name_remark: data?.f_user_name_remark,
                        avatar:  data?.avatar,
                        msg_contents: msg_contents,
                    }
                }else if(chatLogs[login_user_id][from_user_id]){
                    let msg_contents = [...chatLogs[login_user_id][from_user_id].msg_contents];
                    if(!addTypes.includes(type)){
                        const finalRowMsg = getFinalRowMsg(msg_contents);
                        const minute = dayjs(data?.msg_content?.created_at).diff(finalRowMsg?.created_at,'minute');
                        //acceptAddFriends 同意添加好友 notAddFriendVerify 对方开启了添加好友无需认证， alreadyFriend 你已经是对方好友    (notAddFriendVerify,alreadyFriend 申请添加好友的时候返回的)
                        if(['alreadyFriend'].includes(type)){
                            if(minute==0 || minute>3) msg_contents.push(time);
                            msg_contents = msg_contents.concat([data.msg_content,des]);
                        }else if(['acceptAddFriends','notAddFriendVerify'].includes(type)){// acceptAddFriends 接受人同意添加好友时通知添加人 传给 添加人的类型
                            if(minute==0 || minute>3) msg_contents.unshift(time);
                            msg_contents.push(des);
                        }else if(['notAddFriendVerifyAcceptAddFriends'].includes(type)){// 接受人开启了无需认证添加好友申请 传给 接受人的类型
                            if(minute==0 || minute>3) msg_contents.push(time);
                            msg_contents = msg_contents.concat([des,des2]);// 对方开启了添加好友无需认证默认接受添加好友
                        }else if(minute>3) {
                            msg_contents.push(time); 
                        }
                    }
                    if(!['alreadyFriend'].includes(type)) msg_contents.push(data.msg_content);
                    chatLogs[login_user_id][from_user_id] = {
                        ...chatLogs[login_user_id][from_user_id],
                        msg_contents: msg_contents,
                        user_id:  data?.user_id,
                        user_name:  data?.user_name,
                        f_user_name_remark: data?.f_user_name_remark,
                        avatar:  data?.avatar,
                    }
                }
            }
            resolve({
                error: 0
            })
        })
    })
}

export async function chatListPageMsgCount(chatLogs:any={}) {
    let chatListPageNotreadMsgCount = 0;
    for(const key in chatLogs){
        if(['userIdSort'].includes(key)) continue;
        const msg_contents = chatLogs[key]?.msg_contents||[];
        for(const item of msg_contents) if(item.msg_type && !item.readMsg) chatListPageNotreadMsgCount += 1;
    }
    return chatListPageNotreadMsgCount;
}



function handerHour(hour:any){
    if(hour<6) return '凌晨';
    if(hour===6) return '早上';
    if(hour<12) return '上午';
    if(hour===12) return '中午';
    if(hour<18) return '下午';
    if(hour<=23) return '晚上';
}
function week(day:any){
    switch(day){
        case 0:
            return '周日';
        case 1:
            return "周一";
        case 2:
            return "周二";
        case 3:
            return "周三";
        case 4:
            return "周四";
        case 5:
            return "周五";
        case 6:
            return "周六";
    }
}

export function formatTime(time:string){
    if(!time) return;
    const year = dayjs(time).year(),
        month = dayjs(time).month(),
        date = dayjs(time).date(),
        hour = dayjs(time).hour(),
        minute = dayjs(time).minute(),
        second = dayjs(time).second(),
        day = dayjs(time).day(),
        full_date = dayjs(time).format('YYYY-MM-DD'),

        cur_year = dayjs().year(),
        cur_month = dayjs().month(),
        cur_date = dayjs().date(),
        cur_hour = dayjs().hour(),
        cur_minute = dayjs().minute(),
        cur_second = dayjs().second(),
        cur_day = dayjs().day(),
        cur_full_date = dayjs().format('YYYY-MM-DD'),
        dif = dayjs(cur_full_date).diff(full_date,'day');
    if(dif===0) {
        return dayjs(time).format('HH:mm')
    }else if(dif===1){
        return "昨天 " + dayjs(time).format('HH:mm')
    }else if(dif==2){
        return week(day) + " " + dayjs(time).format('HH:mm');
    }else{
        return dayjs(time).format((dif>2 && year==cur_year)?'M月D日':'YYYY年M月D日') +" "+ handerHour(hour) +" "+ dayjs(time).format('HH:mm');
    }
}





export function isLocalFile (path:any) {
    // 本地⽂件路径的常⻅前缀
    const localFilePrefixes = ['file://', '/'];
    // 检查⽂件路径是否以本地⽂件前缀开始
    for (const prefix of localFilePrefixes) {
        if (path.startsWith(prefix)) {
            return true; // 是本地⽂件
        }
    }
    // 如果不是本地⽂件前缀开头，则可能是⽹络⽂件
    return false;
};
export async function saveToCameraRoll(imageUrl:any) {
    return new Promise( async (resolve,reject)=>{
        console.log('0000--->>',imageUrl)
        if(isLocalFile(imageUrl)) {
            console.log('0000--->>0',imageUrl)

            // 使⽤ CameraRoll 保存图⽚到相册
            // CameraRoll.saveToCameraRoll(imageUrl, 'photo')
            const result:any = await CameraRoll.save(imageUrl);
            console.log('1111111---->>',JSON.stringify(result));
            if(result){
              console.log('1111111')
              resolve({error: 0,data: result});
            //   Toast.message('已成功保存到相册');
            }else{
                resolve({error: 401});
                // Toast.fail('保存失败');
            }
            return;
        }
        const index = imageUrl.lastIndexOf('.');
        const suffix = imageUrl.slice(index+1);
        let timestamp = (new Date()).getTime();//获取当前时间戳
        let random = String(((Math.random() * 1000000) | 0))//六位随机数
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部⽂件，共享⽬录的绝对路径
        const downloadDest = `${dirs}/${timestamp + random}.${suffix}`;
        const formUrl = imageUrl;
        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            begin: (res:any) => {
                // console.log('begin', res);
                // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
        };

        try {
            

            // // 下载⽹络图⽚到本地
            // const response = await RNFetchBlob.config({
            //   fileCache: true,
            //   // appendExt: suffix, // 可以根据需要更改⽂件扩展名 
            // }).fetch('GET', imageUrl);
            // console.log('下载⽹络图⽚到本地--->>',imageUrl,response)
            
            // const imagePath = response.path();
            // console.log("imagePath========>>>",imagePath);
            // // 将本地图⽚保存到相册
            // const result:any = await CameraRoll.save(imagePath,{type: 'photo'});
            // console.log('result====>>111222',result)
            // if (result) {
            //     resolve({error: 0,data: result});
            //     // Toast.message('已成功保存到相册');
            // } else {
            //     resolve({error: 401});
            //     // Toast.fail('保存失败');
            // }

            console.log('downloadDest========>>>1',downloadDest)
            console.log('imageUrl========>>>2',imageUrl)
            const res = RNFS.downloadFile(options);
            res.promise.then(res => { 
                var promise = CameraRoll.save(downloadDest);
                promise.then(function (result) {
                    // console.log('保存成功！地址如下：',result)
                    // Toast.message('保存成功！地址如下：'+result);
                    resolve({error: 0,data: result});
                }).catch(function (error) {
                    console.log('error----保存', error);
                    // Toast.message('保存失败！'+error);
                    resolve({error: 401});
                });
                // resolve(res);
            }).catch(err => {
                // reject(new Error(err))
                resolve({error: 401});
            });
        } catch (error) {
            console.log('error====>>>',error)
            resolve({error: 401});
            // Toast.fail('保存失败');
        }
    })
    
  }
