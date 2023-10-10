import socket_io_client from "socket.io-client";
import config from './config';
import store from './store/index';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runInAction } from "mobx";

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

        socket.on('addFirendsApply',(data)=>{//添加好友申请消息通知
            console.log('===========>>>>',data);
            runInAction(()=>{
                if(!data?.applyFriends?.user_id) return;
                // if(store.AppStore.addFirendsApply?.user_id != data.applyFriends.user_id) {
                //     store.AppStore.tabBar.AddressBookPage.msgCnt2 += 1;
                //     if(!['AddressBookPage'].includes(store.AppStore.curRouteName)) store.AppStore.tabBar.AddressBookPage.msgCnt += 1;
                // }else{
                //     if(!['AddressBookPage'].includes(store.AppStore.curRouteName) && store.AppStore.tabBar.AddressBookPage.msgCnt===0 && store.AppStore.addFirendsApply?.user_id == data.applyFriends.user_id) store.AppStore.tabBar.AddressBookPage.msgCnt = store.AppStore.tabBar.AddressBookPage.msgCnt2;
                // }
                const idx = store.AppStore.addFirendsApply.findIndex(item=>item.user_id==data.applyFriends.user_id);
                console.log('===========>>>>idx',idx);
                if(idx!=-1){
                    store.AppStore.addFirendsApply.splice(idx,1);
                    store.AppStore.addFirendsApply.push(data.applyFriends);
                }else{
                    store.AppStore.addFirendsApply.push(data.applyFriends);
                }
                store.AppStore.tabBar.AddressBookPage.msgCnt =  store.AppStore.addFirendsApply.length;
                store.AppStore.tabBar.AddressBookPage.msgCnt2 =  store.AppStore.addFirendsApply.length;
            });
        })


    }

    getSocketIo(){
        return SocketIoClient.socketIo;
    }
}





