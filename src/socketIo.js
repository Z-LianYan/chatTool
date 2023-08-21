import socket_io_client from "socket.io-client";
import config from './config';
import store from './store/index';

export default class SocketIoClient {
    static getInstance(){   /*单例 （无论调用getInstance静态方法多少次，只实例化一次Db，constructor也只执行一次）*/
        if(!SocketIoClient.instance){
            SocketIoClient.instance = new SocketIoClient();
        }
        return SocketIoClient.instance;
    }

    constructor(){
        console.log('实例化会触发构造函数');
        this.connect();
    }

    connect(){
        console.log('连接socket服务');
        const { userInfo } = store?.AppStore
        const socket = socket_io_client(`${config.HOST}/test`,{
            // 实际使用中可以在这里传递参数
            query: {
                token: userInfo.token
            },
            transports: ['websocket'],
        });
        SocketIoClient.socketIo = socket;
        socket.on('connect', () => {
            const id = socket.id;
          
            console.log('#connect,', id);
            console.log('#AppStore-----store', store.AppStore);


          
            // 监听自身 id 以实现 p2p 通讯
            socket.on(id, (msg) => {
              console.log('#receive,', msg);
            });
        });
          
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
    }

    static getSocketIo(){
        return SocketIoClient.socketIo;
    }
}





