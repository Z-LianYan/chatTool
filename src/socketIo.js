import socket_io_client from "socket.io-client";
import config from './config';
import store from './store/index';

export default class SocketIoClient {
    abc(){
        console.log('我是abc')
    }
    static getInstance(callBack){   /*单例 （无论调用getInstance静态方法多少次，只实例化一次Db，constructor也只执行一次）*/
    console.log('callBack===>>',callBack)
        if(!SocketIoClient.instance){
            SocketIoClient.instance = new SocketIoClient();
        }
        SocketIoClient.callBack = callBack;
        return SocketIoClient.instance;
    }

    constructor(){
        console.log('实例化会触发构造函数');
        this.connect();
    }
    
    connect(){
        const { userInfo } = store?.AppStore;
        console.log('连接socket服务',userInfo);
        const socket = socket_io_client(`${config.HOST}/chat`,{
            // 实际使用中可以在这里传递参数
            query: {
                token: userInfo?.token
            },
            transports: ['websocket'],
        });
        SocketIoClient.socketIo = socket;
        socket.on('connect', (res) => {
            const id = socket.id;
          
            console.log('#connect,', id,res);
            // console.log('#AppStore-----store', store.AppStore);

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
        });
          
        socket.on('disconnecting', () => {
            console.log('#disconnecting');
        });
          
        socket.on('error', () => {
            console.log('#error');
        });

        

        socket.on('emitEventError', (res) => {
            console.log('#emitEventError',res);
        });
    }

    getSocketIo(){
        return SocketIoClient.socketIo;
    }
}





