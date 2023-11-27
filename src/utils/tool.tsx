import dayjs from 'dayjs';
import store from '../store/index';
import _ from 'lodash';

export function uniqueMsgId(user_id:string){
    return (user_id?String(user_id):'') + dayjs().format('YYYYMMDDHHmmssSSS')+String(Math.floor(Math.random()*1000))
}
type handlerChatLogType = {
    chatLogs:any,
    login_user_id: number,
    data: any,
    hasNewMsg?: boolean,
    isNewAddFriendNotRedMsg?: boolean //添加朋友时用来统计未读消息人数
};
export async function handlerChatLog({
    chatLogs = {},
    login_user_id,
    data,
    hasNewMsg,
    isNewAddFriendNotRedMsg,
}:handlerChatLogType){
    const from_user_id = data.user_id;
    if(!chatLogs[login_user_id]){
        chatLogs[login_user_id] = {
            userIdSort: [from_user_id]
        };
        chatLogs[login_user_id][from_user_id] = {
            user_id:  data?.user_id,
            user_name:  data?.user_name,
            avatar:  data?.avatar, 
            hasNewMsg: hasNewMsg,
            msg_contents: [data.msg_content],
        }
    }else{
        const idx = chatLogs[login_user_id].userIdSort.indexOf(from_user_id);
        if(idx!=-1) chatLogs[login_user_id].userIdSort.splice(idx,1);
        chatLogs[login_user_id].userIdSort.unshift(from_user_id);

        if(!chatLogs[login_user_id][from_user_id]){
            chatLogs[login_user_id][from_user_id]={
                user_id:  data?.user_id,
                user_name:  data?.user_name,
                avatar:  data?.avatar,
                hasNewMsg: hasNewMsg,
                msg_contents: [data.msg_content],
            }
        }else if(chatLogs[login_user_id][from_user_id]){
            chatLogs[login_user_id][from_user_id] = {
                ...chatLogs[login_user_id][from_user_id],
                hasNewMsg,
                msg_contents: [...chatLogs[login_user_id][from_user_id].msg_contents,data.msg_content]
            }
        }
    }
    
    
    if(isNewAddFriendNotRedMsg) chatLogs[login_user_id][from_user_id].isNewAddFriendNotRedMsg = isNewAddFriendNotRedMsg;
}