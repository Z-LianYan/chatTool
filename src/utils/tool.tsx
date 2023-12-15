import dayjs from 'dayjs';
import store from '../store/index';
import _ from 'lodash';
import { runInAction } from 'mobx';
import { Toast } from '../component/teaset';

import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
const getFinalRowMsg =  function(msg_contents:any[]){
    let len = msg_contents.length-1;
    if(len<0) return null;
    for(let i=len;i>=0;i--){
      if(msg_contents[i].msg_type || msg_contents[i].type=='time') return msg_contents[i];
    }
    return null;
}
export function uniqueMsgId(user_id:string){
    return (user_id?String(user_id):'') + dayjs().format('YYYYMMDDHHmmssSSS')+String(Math.floor(Math.random()*1000))
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
        runInAction(()=>{
            const from_user_id = data.user_id;
    
            if(!data.msg_content) return;
            const addTypes = ['addFriendsApply','addFriendApplyReply'];
            const time = {
                type: 'time',
                created_at: data?.msg_content?.created_at,
            }
            if(!chatLogs[login_user_id]){
                chatLogs[login_user_id] = {
                    userIdSort: [from_user_id]
                };
                const msg_contents = [data.msg_content];
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
                    const msg_contents = [data.msg_content];
                    if(!addTypes.includes(type)) msg_contents.unshift(time) 
                    chatLogs[login_user_id][from_user_id]={
                        user_id:  data?.user_id,
                        user_name:  data?.user_name,
                        f_user_name_remark: data?.f_user_name_remark,
                        avatar:  data?.avatar,
                        msg_contents: msg_contents,
                    }
                }else if(chatLogs[login_user_id][from_user_id]){
                    const msg_contents = [...chatLogs[login_user_id][from_user_id].msg_contents];
                    if(!addTypes.includes(type)){
                        const finalRowMsg = getFinalRowMsg(msg_contents);
                        const minute = dayjs(data?.msg_content?.created_at).diff(finalRowMsg.created_at,'minute');
                        if(['acceptAddFriends'].includes(type)){
                            msg_contents.unshift(time); 
                            msg_contents.push({
                                type: 'des',
                                des: '以上是打招呼的内容'
                            })
                        }else if(minute>3) {
                            msg_contents.push(time); 
                        }
                    }
                    msg_contents.push(data.msg_content);
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
    if(isLocalFile(imageUrl)) {
      console.log('哈哈哈哈😂',imageUrl)
      // 使⽤ CameraRoll 保存图⽚到相册
      // CameraRoll.saveToCameraRoll(imageUrl, 'photo')
      const result:any = CameraRoll.save(imageUrl, { type: "auto" });
      console.log('1111111---->>',result);
      if(result){
        console.log('1111111')
        Toast.message('已成功保存到相册');
      }else{
        Toast.fail('保存失败');
      }
      return
    }
    try {
      // const index = imageUrl.lastIndexOf('.');
      // const suffix = imageUrl.slice(index+1);
      // 下载⽹络图⽚到本地
      const response = await RNFetchBlob.config({
        fileCache: true,
        // appendExt: suffix, // 可以根据需要更改⽂件扩展名 
      }).fetch('GET', imageUrl);
      const imagePath = response.path();
      console.log("imagePath========>>>",imagePath);
      // 将本地图⽚保存到相册
      const result:any = CameraRoll.save(imagePath, { type: "auto" });
      if (result) {
        Toast.message('已成功保存到相册');
      } else {
        Toast.fail('保存失败');
      }
    } catch (error) {
      Toast.fail('保存失败');
    }
  }
