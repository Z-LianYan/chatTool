import socket_io_client from "socket.io-client";
import config from './config';
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
        const socket = socket_io_client(`${config.HOST}/test`,{
            transports: ['websocket'],
        });
        SocketIoClient.SocketIo = socket;
        socket.on('connect', () => {
            const id = socket.id;
          
            console.log('#connect,', id);
          
            // 监听自身 id 以实现 p2p 通讯
            socket.on(id, (msg) => {
              console.log('#receive,', msg);
            });
        });
          
        // // 接收在线用户信息
        // socket.on('online', (msg) => {
        //     console.log('#online,', msg);
        // });
          
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
}





