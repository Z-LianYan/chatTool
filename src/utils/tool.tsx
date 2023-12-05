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
};
export async function handlerChatLog({
    chatLogs = {},
    login_user_id,
    data,
}:handlerChatLogType){
    console.log('chatLogs====>>>',chatLogs)
    const from_user_id = data.user_id;
    if(!chatLogs[login_user_id]){
        chatLogs[login_user_id] = {
            userIdSort: [from_user_id]
        };
        chatLogs[login_user_id][from_user_id] = {
            user_id:  data?.user_id,
            user_name:  data?.user_name,
            f_user_name_remark: data?.f_user_name_remark,
            avatar:  data?.avatar, 
            msg_contents: [data.msg_content],
        }
    }else{
        if(!Array.isArray(chatLogs[login_user_id].userIdSort)){
            chatLogs[login_user_id].userIdSort = [];
        }
        const idx = chatLogs[login_user_id].userIdSort.indexOf(from_user_id);
        if(idx!=-1) chatLogs[login_user_id].userIdSort.splice(idx,1);
        chatLogs[login_user_id].userIdSort.unshift(from_user_id);

        if(!chatLogs[login_user_id][from_user_id]){
            chatLogs[login_user_id][from_user_id]={
                user_id:  data?.user_id,
                user_name:  data?.user_name,
                f_user_name_remark: data?.f_user_name_remark,
                avatar:  data?.avatar,
                msg_contents: [data.msg_content],
            }
        }else if(chatLogs[login_user_id][from_user_id]){
            chatLogs[login_user_id][from_user_id] = {
                ...chatLogs[login_user_id][from_user_id],
                msg_contents: [...chatLogs[login_user_id][from_user_id].msg_contents,data.msg_content],
                user_id:  data?.user_id,
                user_name:  data?.user_name,
                f_user_name_remark: data?.f_user_name_remark,
                avatar:  data?.avatar,
            }
            if(['addFirendsApply','addFriendApplyReply'].includes(data?.type)){
                delete chatLogs[login_user_id][from_user_id]?.newAddFriendReadMsg;
            }
        }
    }
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