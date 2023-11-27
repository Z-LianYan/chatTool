import socket_io_client from "socket.io-client";
import config from './config';
import store from './store/index';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runInAction } from "mobx";
import { useNavigation } from '@react-navigation/core';
import _ from 'lodash';
import { handlerChatLog } from "./utils/tool";
export default class SocketIoClient {
    static getInstance(callBack){   /*单例 （无论调用getInstance静态方法多少次，只实例化一次Db，constructor也只执行一次）*/
        if(!SocketIoClient.instance){
            SocketIoClient.instance = new SocketIoClient();
            SocketIoClient.callBack = callBack;
        }else{
            callBack && callBack();
        }
        return SocketIoClient.instance;
    }

    constructor(){
        console.log('实例化会触发构造函数');
        this.connect();
    }
    
    async connect(){
        const { userInfo } = store?.AppStore;
        console.log('连接socket服务',userInfo);
        const socket = socket_io_client(`${config.HOST}/chat`,{
            // 实际使用中可以在这里传递参数
            query: {
                token: await AsyncStorage.getItem('token')
            },
            transports: ['websocket'],
        });
        SocketIoClient.socketIo = socket;
        socket.on('connect', (res) => {
            const id = socket.id;
            console.log('#connect,', id,res);
            SocketIoClient.callBack && SocketIoClient.callBack();
            // 监听自身 id 以实现 p2p 通讯
            socket.on(id, (msg) => {
              console.log('#receive,', msg);
            });
        });
        
        socket.on('res',(res)=>{
            console.log('连接成功-----》〉》',res)
        })
        // 系统事件
        socket.on('disconnect', (msg) => {
            console.log('#disconnect', msg);
            delete SocketIoClient.instance;
        });
          
        socket.on('disconnecting', () => {
            console.log('#disconnecting');
        });
          
        socket.on('error', () => {
            console.log('#error');
        });

        

        // socket.on('emitEventError', (res) => {
        //     console.log('#emitEventError',res);
        // });

        /**
         * data?.fromFriends?.type  addFirendsApply: 添加朋友申请   acceptAddFriends：接受添加好友   addFriendApplyReply： 添加好友申请回复消息
        */
        // socket.on('addFirendsApply',(data,callBack)=>{//添加好友申请消息通知
        //     console.log('===========>>>>有添加好友消息通知',store.AppStore.userInfo.user_name,data,callBack);
        //     runInAction(async ()=>{
        //         if(!data?.fromFriends?.user_id) return;
        //         if(['acceptAddFriends'].includes(data?.fromFriends?.type)) {
        //             // store.FriendsStore.chatLogs.unshift(data?.fromFriends);

        //             if(data?.fromFriends?.msg_contents){
        //                 const login_user_id = store.AppStore.userInfo?.user_id;
        //                 const from_user_id = data?.fromFriends?.user_id
        //                 if(!store.FriendsStore.chatLogs[login_user_id]){
        //                   store.FriendsStore.chatLogs[login_user_id] = {};
        //                   store.FriendsStore.chatLogs[login_user_id][from_user_id]={
        //                     user_id:  from_user_id,
        //                     user_name:  data?.fromFriends?.user_name,
        //                     avatar:  data?.fromFriends?.avatar, 
        //                     hasNewMsg: true,
        //                     msg_contents: [...data?.fromFriends?.msg_contents],
        //                   }
        //                 }else if(!store.FriendsStore.chatLogs[login_user_id][from_user_id]){
        //                   store.FriendsStore.chatLogs[login_user_id][from_user_id]={
        //                     user_id:  from_user_id,
        //                     user_name:  data?.fromFriends?.user_name,
        //                     avatar:  data?.fromFriends?.avatar, 
        //                     hasNewMsg: true,
        //                     msg_contents: [...data?.fromFriends?.msg_contents],
        //                   }
        //                 }else if(store.FriendsStore.chatLogs[login_user_id][from_user_id]){
        //                   const obj = _.cloneDeep(store.FriendsStore.chatLogs[login_user_id][from_user_id]);
        //                   delete store.FriendsStore.chatLogs[login_user_id][from_user_id];
        //                   obj.msg_contents = (obj.msg_contents && obj.msg_contents.length)? [...obj.msg_contents,...data?.fromFriends?.msg_contents]:[...data?.fromFriends3?.msg_contents]
        //                   let _obj = {};
        //                   obj.hasNewMsg = true;
        //                   _obj[from_user_id] = obj;
        //                   _obj =  {
        //                     ..._obj,
        //                     ...store.FriendsStore.chatLogs[login_user_id]
        //                   }
        //                   store.FriendsStore.chatLogs[login_user_id] = _obj;
        //                 }
        //             }
                    
        //             await store.FriendsStore.getFriendList();
        //             await store.FriendsStore.get_new_friends_list();

        //             return;
        //         };
        //         console.log('addFriendApplyReply---->>>000')
        //         if(['addFriendApplyReply'].includes(data?.fromFriends?.type) && store.AppStore.search_user_info && store.AppStore.search_user_info?.user_id == data?.fromFriends?.user_id) {
        //             console.log('addFriendApplyReply---->>>')
        //             store.AppStore.search_user_info.msgs.splice(0,1);
        //             store.AppStore.search_user_info.msgs.push(data?.fromFriends);
        //             store.AppStore.search_user_info = {
        //                 ...store.AppStore.search_user_info
        //             };
        //         };
                
        //         const idx = store.AppStore.addFirendsApply.findIndex(item=>item.user_id==data.fromFriends.user_id);
        //         if(idx!=-1){
        //             store.AppStore.addFirendsApply.splice(idx,1);
        //             store.AppStore.addFirendsApply.push(data.fromFriends);
        //         }else{
        //             store.AppStore.addFirendsApply.push(data.fromFriends);
        //         }
        //         if(!['AddressBookPage'].includes(store.AppStore.curRouteName)) store.AppStore.tabBar.AddressBookPage.msgCnt =  store.AppStore.addFirendsApply.length;


        //         callBack && callBack();
        //     });
        // })

        // data ====>>> {
        //     "avatar": "http://zly.imgresource.com.cn/public/chat/commonAvatar.png", 
        //     "msg_content": {
        //         "created_at": "2023-11-27T10:35:42.000Z", 
        //         "from_avatar": "http://zly.imgresource.com.cn/public/chat/commonAvatar.png", 
        //         "from_user_id": 13, 
        //         "from_user_name": "1618", "msg_content": 
        //         "我是1618", "msg_unique_id": "1320231127183541744958", 
        //         "to_user_id": 15
        //     }, 
        //     "type": "addFirendsApply", 
        //     "user_id": 13, 
        //     "user_name": "1618"
        // }
        socket.on('sendClientMsg',(data,callBack)=>{//服务端发送过来的消息
            // data.type 
            console.log('===========>>>>有消息---',store.AppStore.userInfo.user_name,data?.msg_content?.msg_unique_id);
            console.log('===========>>>>有消息---data', data);

            const login_user_id = store.AppStore.userInfo.user_id;
            const from_user_id = data.user_id;
            runInAction(async ()=>{
                const isAddFriend = ['addFirendsApply','addFriendApplyReply','acceptAddFriends'].includes(data?.type);
                const target_obj = {
                    chatLogs: isAddFriend ? store.FriendsStore.addFriendchatLogs : store.FriendsStore.chatLogs,
                    login_user_id: login_user_id,
                    data: data,
                    hasNewMsg: store.AppStore.curRouteName=='ChatPage'?false:true
                }
                
                if(isAddFriend){
                    //处理添加好友时消息逻辑
                    if(['addFirendsApply','addFriendApplyReply'].includes(data?.type)) target_obj.isNewAddFriendNotRedMsg = true;

                    if(['addFirendsApply'].includes(data?.type)){
                        
                    }
                    if(['addFriendApplyReply'].includes(data?.type) && store.AppStore.search_user_info && store.AppStore.search_user_info?.user_id == data?.fromFriends?.user_id) {
                        
                    };
                    
                }else{

                }

                await handlerChatLog(target_obj);

                if(!['AddressBookPage'].includes(store.AppStore.curRouteName) && isAddFriend) {
                    runInAction(()=>{
                        let addressBookPageMsgCount = 0;
                        const addFriendchatLogs = store.FriendsStore.addFriendchatLogs[login_user_id]||{}
                        for(const key in addFriendchatLogs) {
                            if(addFriendchatLogs[key].hasNewMsg) addressBookPageMsgCount += 1;
                        }
                        store.AppStore.tabBar.AddressBookPage.msgCnt =  addressBookPageMsgCount;
                    });
                }
                callBack && callBack({
                    msg_unique_id: data.msg_content?.msg_unique_id
                });
            });
        })


    }

    getSocketIo(){
        return SocketIoClient.socketIo;
    }
}





