import socket_io_client from "socket.io-client";
import config from './config';
import store from './store/index';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runInAction } from "mobx";
import _ from 'lodash';
import { chatListPageMsgCount, handlerChatLog } from "./utils/tool";
import { login_out } from "./api/user";
import { useNavigation,StackActions } from '@react-navigation/core';
export default class SocketIoClient {
    static getInstance({
        callBack,
        navigation = ''
    }){   /*单例 （无论调用getInstance静态方法多少次，只实例化一次Db，constructor也只执行一次）*/
        if(!SocketIoClient.instance){
            SocketIoClient.instance = new SocketIoClient();
            SocketIoClient.callBack = callBack;
            SocketIoClient.navigation = navigation;
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
                token: await AsyncStorage.getItem('token'),
                versionCode: store.AppVersions.versionCode,
                versionName: store.AppVersions.versionName,
                unique_id: store.AppVersions.unique_id,
            },
            transports: ['websocket'],
        });
        SocketIoClient.socketIo = socket;
        socket.on('connect', (res) => {
            const id = socket.id;
            console.log('#connect,', id,res,userInfo?.user_name);
            SocketIoClient.callBack && SocketIoClient.callBack();
            // 监听自身 id 以实现 p2p 通讯
            // socket.on(id, (msg) => {
            //   console.log('#receive,', msg);
            // });

            runInAction(async ()=>{
                store.AppStore.connecting = true;
            });
        });
        
        socket.on('res',(res)=>{
            console.log('连接成功-----》〉》',res)
        })
        // 系统事件
        socket.on('disconnect', (msg) => {
            console.log('#disconnect--->>', msg);
            delete SocketIoClient?.instance;
            runInAction(async ()=>{
                store.AppStore.connecting = false;
            });
        });
        
        /**
         * 1.低级连接无法建立
         * 2.服务器在中间件功能中拒绝连接
         */
        socket.on("connect_error", (msg) => {
            console.log('#connect_error', msg);
            setTimeout(() => {
              socket.connect();
            }, 1000);
        });
          
        socket.on('disconnecting', () => {
            console.log('#disconnecting');
        });
          
        socket.on('error', () => {
            console.log('#error');
        });
      

        /**
         * data?.type  addFriendsApply: 添加朋友申请   acceptAddFriends：接受添加好友   addFriendApplyReply： 添加好友申请回复消息
         * 
         *   data ====>>> {
                "avatar": "http://zly.imgresource.com.cn/public/chat/commonAvatar.png", 
                "msg_content": {
                    "created_at": "2023-11-27T10:35:42.000Z", 
                    "from_avatar": "http://zly.imgresource.com.cn/public/chat/commonAvatar.png", 
                    "from_user_id": 13, 
                    "from_user_name": "1618", 
                    "msg_content": "我是1618", 
                    "msg_unique_id": "1320231127183541744958", 
                    "to_user_id": 15,
                    "msg_type": "text"
                }, 
                "type": "addFriendsApply", 
                "user_id": 13, 
                "user_name": "1618",
                "f_user_name_remark":""
            }
         * 
        */
        socket.on('sendClientMsg',(data,callBack)=>{//服务端发送过来的消息
            console.log('===========>>>>有消息---data', data);

            const login_user_id = store.AppStore.userInfo?.user_id;
            const from_user_id = data.user_id;
            runInAction(async ()=>{// acceptAddFriends
                const isAddFriend = ['addFriendsApply','addFriendApplyReply'].includes(data?.type);
                if(['acceptAddFriends','notAddFriendVerifyAcceptAddFriends'].includes(data?.type)){
                    runInAction(async ()=>{
                        const addFriendChatLogs = store.FriendsStore.addFriendChatLogs[login_user_id]||{};
                        const addUser = addFriendChatLogs[from_user_id];
                        if(addUser) {
                            if(!store.FriendsStore.chatLogs[login_user_id]){
                                store.FriendsStore.chatLogs[login_user_id] = {
                                    userIdSort: [from_user_id]
                                };
                                store.FriendsStore.chatLogs[login_user_id][from_user_id] = _.cloneDeep(addUser);
                            }else if(!store.FriendsStore.chatLogs[login_user_id][from_user_id]){
                                store.FriendsStore.chatLogs[login_user_id][from_user_id] = _.cloneDeep(addUser);
                                const idx = store.FriendsStore.chatLogs[login_user_id].userIdSort.indexOf(from_user_id);
                                if(idx!=-1) store.FriendsStore.chatLogs[login_user_id].userIdSort.splice(idx,1);
                                store.FriendsStore.chatLogs[login_user_id].userIdSort.unshift(from_user_id);
                            }
                        };

                        await handlerChatLog({
                            chatLogs: store.FriendsStore.chatLogs,
                            login_user_id: login_user_id,
                            data: data,
                            type: data?.type
                        });
                        runInAction(async ()=>{
                            if(['acceptAddFriends'].includes(data?.type)) store.FriendsStore.addFriendChatLogs[login_user_id][from_user_id].newAddFriendReadMsg = true;
                        });
                    });
                    await store.FriendsStore.getFriendList();
                    await store.FriendsStore.get_new_friends_list();

                    
                }else{
                    const target_obj = {
                        chatLogs: isAddFriend ? store.FriendsStore.addFriendChatLogs : store.FriendsStore.chatLogs,
                        login_user_id: login_user_id,
                        data: data,
                        type: data?.type
                    }
                    await handlerChatLog(target_obj);
                    if(['refreshAddressBookPage'].includes(data.flag)){
                        await store.FriendsStore.getFriendList();
                    }
                }


                if(!['AddressBookPage'].includes(store.AppStore.curRouteName) && isAddFriend) {
                    runInAction(()=>{
                        let addressBookPageNotreadMsgCount = 0;
                        const addFriendChatLogs = store.FriendsStore.addFriendChatLogs[login_user_id]||{};
                        addFriendChatLogs[data.user_id].newAddFriendReadMsg = false;
                        for(const key in addFriendChatLogs) {
                            if(['userIdSort'].includes(key)) continue;
                            if(!addFriendChatLogs[key].newAddFriendReadMsg) addressBookPageNotreadMsgCount += 1;
                        }
                        store.AppStore.tabBar.AddressBookPage.msgCnt =  addressBookPageNotreadMsgCount;
                    });
                }
                callBack && callBack({
                    msg_unique_id: data.msg_content?.msg_unique_id
                });

                await AsyncStorage.setItem('chatLogs',JSON.stringify(store.FriendsStore.chatLogs));
                await AsyncStorage.setItem('addFriendChatLogs',JSON.stringify(store.FriendsStore.addFriendChatLogs));
            });
        });


        socket.on('outLogin',async (data,callBack)=>{
            // await login_out();
            store.AppStore.setUserInfo(null);
            SocketIoClient?.navigation?.dispatch(StackActions.popToTop());//清除内部导航堆栈
            if(SocketIoClient.navigation.replace){
                SocketIoClient.navigation.replace('LoginPage',{
                    hidBackBtn: true
                })
            }else{
                SocketIoClient.navigation.navigate('LoginPage',{
                    hidBackBtn: true
                })
            }
            
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userInfo');
            callBack && callBack();
            // socket?.disconnect(); //服务端执行断开
            this.removeInstance();
        })


    }

    getSocketIo(){
        return SocketIoClient.socketIo;
    }

    removeInstance(){
        delete SocketIoClient.socketIo;
    }
}





