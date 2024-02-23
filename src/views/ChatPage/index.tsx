import React, { useState,useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react'
import { observable, action, makeAutoObservable,runInAction, keys } from 'mobx';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Platform,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Text as Tt,
  View as Vw,
  Alert,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { View,Text } from '../../component/customThemed';

import NavigationBar from '../../component/NavigationBar';
import CustomListRow from '../../component/CustomListRow';
import MyCell from '../../component/MyCell';
import { ADD_CIR, ADD_USER, ALBUM_ICON, AUDIO_ICON, CAPTURE_ICON, MORE_ICON, NEW_FIREND, SEND_FAIL, VIDEO_ICON } from '../../assets/image';
import SocketIoClient from '../../socketIo';
import { Label, Menu, Overlay, Toast } from '../../component/teaset';
import { TextInput } from 'react-native-gesture-handler';
import { LOADING_ICON } from '../../assets/image/index';
import dayjs from 'dayjs';
import BottomOperationBtn from './BottomOperationBtn';
import { formatTime, handlerChatLog, uniqueMsgId } from '../../utils/tool';
import { searchFriends } from '../../api/friends';
import { result } from 'lodash';
import { get_upload_qiuniu_config } from '../../api/common';
const _ = require('lodash');
import * as qiniu from 'qiniu-js';
import { element } from 'prop-types';
import ShowMsg from './ShowMsg';
import AudioModal from '../../component/AudioModal';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { 
//   View,
//   Text
// } from '../component/customThemed';
const ChatPage = ({ 
  AppStore,
  MyThemed,
  navigation,
  FriendsStore,
  route
}:any) => {
  const scrollRef:{current:any} = useRef();
  const inputRef:{current:any} = useRef();
  const audioModalRef:{current:any} = useRef();
  
  const sockitIo = SocketIoClient.getInstance({
    callBack: ()=>{},
    navigation
  });
  const { params } = route;
  
  const colorScheme:any = useColorScheme();
  const [msgContent,setMsgContent] = useState<string>();
  const [showSkeleton,setShowSkeleton] = useState<boolean>(true);
  const [textInputHeight,setTextInputHeight] = useState<number>(40);
  // const [keyboardHeight,setkeyboardHeight] = useState<number>(0);
  const [showBottomOperationBtn,setShowBottomOperationBtn] = useState<boolean>(false);
  const [showAudioBtn,setShowAudioBtn] = useState<boolean>(false);
  const [audioRecording,setAudioRecording] = useState<boolean>(false);
  
  const login_user_id = AppStore?.userInfo?.user_id;

  const chatLogs = FriendsStore.chatLogs[login_user_id]||{};
  const user = chatLogs[params?.user_id]||{}
  const msg_contents = user.msg_contents||[];

  // const audioRecorderPlayer = new AudioRecorderPlayer();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft:'',
      title: params?.user_name||'',
      headerStyle: { 
        backgroundColor: MyThemed[colorScheme||'light'].bg,
      },
      // headerRight: ()=>{
      //   return <Vw style={{paddingRight: 10}}>
      //     <TouchableOpacity 
      //     activeOpacity={0.6}
      //     onPress={()=>{
      //       navigation.navigate({
      //         name: 'SetChatMsg',
      //         params: {
      //         }
      //       });
      //     }}>
      //       <Image 
      //       style={{
      //         width: 25,height:25,
      //         tintColor: MyThemed[colorScheme||'light'].ftCr
      //       }} 
      //       source={MORE_ICON}/>
      //     </TouchableOpacity>
          
      //   </Vw>
      // }
    });
    
  });
  useEffect(()=>{

    // Keyboard.addListener('keyboardDidShow', (e)=>{
    //   console.log('keyboardDidShow===>>>',e.endCoordinates.height)
    //   setkeyboardHeight(e.endCoordinates.height||300)
    // })
    runInAction(()=>{
      AppStore.curRouteName = 'ChatListPage';
    });
    setTimeout(() => {
      scrollRef.current?.scrollToEnd();
      setTimeout(()=>{
        setShowSkeleton(false);
      },300);
    });

    runInAction(async ()=>{
      for(const item of msg_contents){
        item.readMsg = true;
      }
      await AsyncStorage.setItem('chatLogs',JSON.stringify(FriendsStore.chatLogs));
    })
    
    return ()=>{
      runInAction(()=>{
        if(FriendsStore.chatLogs[login_user_id] && FriendsStore.chatLogs[login_user_id][params?.user_id]){
          FriendsStore.chatLogs[login_user_id][params?.user_id].newAddFriendReadMsg = true;
        }
      });
    }
  });
  function getExtName(str:string) {
    var index = str.lastIndexOf(".");
    return str.slice(index);
  }
  const uploadImage = useCallback(async (file:any)=>{
    return new Promise(async (resolve,reject)=>{
      try{
        const tokenConfig:any = await get_upload_qiuniu_config();
        const key = `public/chatTool/chatLogs/${dayjs().format('YYYYMMDD')}/${dayjs().format('HHmmssSSS')+String(Math.floor(Math.random() * 10000)) + getExtName(file.uri)}`; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。
        let config = {
          useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
          region: qiniu.region.z2, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
        };
       
        let putExtra = {
          // fname: file.fileName, //文件原文件名
          // params: {}, //用来放置自定义变量
          // mimeType: ["image/png", "image/jpeg", "image/gif"], //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
        };
        const idx1 = file.uri.lastIndexOf('/')
        const str = file.uri.slice(idx1+1);
        const idx2 = str.lastIndexOf('.');
        const name = str.slice(0,idx2);
        let observable = qiniu.upload(
          {
            uri: file.uri, 
            type: file.type, 
            name: name + Math.random()
          } as any,//文件格式需要这样子否则上传会失败
          key,
          tokenConfig.upload_token,
          putExtra,
          config
        );
        observable.subscribe({
          next: (res) => {
            console.log('res----next',res);
            // 主要用来展示进度
            let total:any = res.total;
            // setPercent(total.percent.toFixed(0))
          },
          error: (err:any) => {
            // 失败报错信息
            // Toast.fail(err.message);
            console.log('上传七牛======err',err);
            resolve({
              error: 401,
            })
          },
          complete: (res) => {
            console.log('res======成功',res);
            resolve({
              error: 0,
              uri: tokenConfig.static_host+res.key
            })
          },
        });
      }catch(err:any){
        console.log('err=====>>>',err)
        resolve({
          error: 401,
          msg: err.messgae
        });
      }finally{

      }
    });
  },[]);
  
  const sendMsg = useCallback(async ({
    msgRows = [],
  }:any)=>{
    console.log('msgRows===>>>',msgRows);
    const tip = Toast.show({
      text: '',
      icon: <ActivityIndicator size='large' color={MyThemed[colorScheme||'light'].ctBg} />,
      position: 'center',
      duration: 200000,
      modal: true
    });
    runInAction(async()=>{
      let msg_rows = []
      for(const item of msgRows){
        const _msgContent = (item as any).msg_content?.trim();
        if(!_msgContent && !_msgContent){
          Alert.alert(
            "提示",
            "不能发送空白消息",
            [
              { text: "确定", onPress: async () => {}}
            ]
          );
          return;
        }

        const msg_row = {
          from_user_id: AppStore.userInfo?.user_id,
          to_user_id: params?.user_id,
          msg_content: (item as any).msg_content,
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          from_user_name: AppStore?.userInfo?.user_name,
          from_avatar: AppStore?.userInfo?.avatar,
          msg_type: (item as any)?.msg_type||'text',
          sendIng: true,
          msg_unique_id: item.msg_unique_id||uniqueMsgId(AppStore.userInfo?.user_id),
          file: item?.file
        }
        msg_rows.push(msg_row);
        await handlerChatLog({
          chatLogs: FriendsStore.chatLogs,
          login_user_id: login_user_id,
          data: {
            user_id:  params?.user_id,
            user_name:  params?.user_name,
            avatar:  params?.avatar,
            msg_content: msg_row,
          },
        });
        setTimeout(() => {
          scrollRef.current?.scrollToEnd()
        });
        
      }
      
      setTimeout(() => {
        scrollRef.current?.scrollToEnd();
      }, 200);
      Toast.hide(tip);

      const chatLogs =  FriendsStore.chatLogs[login_user_id]||{};
      const msg_contents = chatLogs[params?.user_id].msg_contents||[];
      console.log('1234567890--==666',msg_rows)
      for(const _item of msg_rows){
        if(['img','video','audio'].includes(_item?.msg_type)){
          const upload_res:any = await uploadImage(_item.file);
          console.log('upload_res===>>>',upload_res)
          if(upload_res.error===0) {
            _item.msg_content = upload_res.uri
          }else{
            runInAction(()=>{
              for(const item of msg_contents){
                if(_item?.msg_unique_id == item.msg_unique_id) {
                  item.sendIng = false;
                  item.sendStatus = 'serverNotCallBack';
                  // if(['img'].includes(item?.msg_type)) delete item.file;
                }
              }
            });
            return;
          }
        }
        console.log('_item====>>>',_item);
        sockitIo?.getSocketIo()?.timeout(15000).emit('sendServerMsg',{ // 15 秒后 服务端没有回应 会返回错误 err
          msg_type: _item?.msg_type, 
          msg_content: _item.msg_content,
          to_user_id: _item.to_user_id,
          msg_unique_id: _item.msg_unique_id
        },function(err:any,response:any) {
          console.log('err====>>',err);
          runInAction(async ()=>{
            for(const item of msg_contents){
              if(_item?.msg_unique_id == item.msg_unique_id) {
                item.sendIng = false;
                item.sendStatus = err?'serverNotCallBack':response?.status;
                if(['img'].includes(item?.msg_type)) delete item.file;
              }
            }
            if(!err) {
              if(!login_user_id || !params?.user_id) return;
              if (["success"].includes(response?.status) && response.msg_content) {
                
              } else if(['addFriendVerify'].includes(response?.status)){
                FriendsStore.chatLogs[login_user_id][params?.user_id].msg_contents.push({
                  type: 'addFriendVerify',
                })
              }
            };

            await AsyncStorage.setItem('chatLogs',JSON.stringify(FriendsStore.chatLogs));
          });
        });
      }

      msg_rows = [];

    });
  },[msgContent]);

  const onUseMicrophonePermission = useCallback(async ()=>{
    return new Promise(async (resolve, reject) => {
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
      
          console.log('write external stroage', grants);
      
          if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Permissions granted');
            resolve({error:0})
          } else {
            console.log('All required permissions not granted');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }else{
        resolve({error:0})
      }
    })
  },[]);

  const onStopRecord = async () => {
    const audio_rul = await audioRecorderPlayer.stopRecorder();
    console.log('audio_rul====>>>',audio_rul,audioRecording)
    audioRecorderPlayer.removeRecordBackListener();

    if(audio_rul.indexOf('file://')==-1 || !audioRecording) return;
    // if(audio_rul.indexOf('file://')==-1) return;
    console.log("哈哈哈哈哈哈😂")
    setAudioRecording(false);
    const msgRow = {
      msg_type: "audio",
      msg_content: audio_rul,

      file:{
        type: "video/mp4",//audio/mpeg
        uri: audio_rul
      }
    }
    
    await sendMsg({
      msgRows: [msgRow]
    });
  };

  return <Vw style={styles.container}>
    {
      showSkeleton && <View style={{
        ...styles.skeletonWrapper,
        backgroundColor: MyThemed[colorScheme||'light'].bg
      }}></View>
    }
    <Vw style={{
      flex:1,
      position: 'relative'
    }}>
      <Vw style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}>

        <ScrollView 
        style={styles.scroll_view} 
        ref={scrollRef}>
          <TouchableOpacity 
          style={{flex:1}}
          activeOpacity={1}
          onPress={()=>{
            setShowBottomOperationBtn(false);
          }}>
            <Vw style={{height: 30}}></Vw>
            <ShowMsg params={params} navigation={navigation} onSendMsg={(msgRows:any)=>{
              sendMsg({
                msgRows: msgRows
              });
            }}/>
          </TouchableOpacity>
        </ScrollView>


        <Vw style={{
          ...styles.bottomInputWrapper,
          borderTopColor: ['light'].includes(colorScheme)?'#d3d3d3':'#292929',
          backgroundColor: MyThemed[colorScheme||'light'].bg
        }}>
          <TouchableOpacity 
          activeOpacity={0.6}
          onPress={()=>{
            inputRef.current?.blur();
            setShowBottomOperationBtn(false);
            setShowAudioBtn(!showAudioBtn)
          }}>
            <Image 
            style={{
              width: 35,height:35,
              tintColor: MyThemed[colorScheme||'light'].ftCr,
              marginRight: 10
            }} 
            source={AUDIO_ICON}/>
          </TouchableOpacity>
          {
            showAudioBtn ?<TouchableWithoutFeedback>
              <TouchableOpacity style={{
                ...styles.msgContentInput,
                  flex:1,
                  backgroundColor: ['light'].includes(colorScheme)?'#ffffff':'#292929',
                  height: textInputHeight,
              }}
              onLongPress={async ()=>{
                const res:any = await onUseMicrophonePermission();
                if(res?.error===0) {
                  const fileName = dayjs().format("YYYYMMDDHHmmssSSS")+String(Math.random()*100000000000).slice(0,6)
                  const path = Platform.select({
                    ios: `${RNFS.CachesDirectoryPath}/${fileName}.m4a`,
                    android: `${RNFS.CachesDirectoryPath}/${fileName}.mp3`,
                  });
                  const result = await audioRecorderPlayer.startRecorder(path);// android 正常  ios 模拟器上不行，真机未测试过
                  audioRecorderPlayer.addRecordBackListener((e) => {
                    setAudioRecording(true)
                  });
                };
              }}
              onPressOut={()=>{
                onStopRecord()
              }}>
                <Text style={{
                  textAlign: "center"
                }}>按住 说话</Text>
              </TouchableOpacity>
            </TouchableWithoutFeedback>:<TextInput 
            ref={inputRef}
            multiline={true}
            clearButtonMode={'always'}
            style={{
              ...styles.msgContentInput,
              flex:1,
              backgroundColor: ['light'].includes(colorScheme)?'#ffffff':'#292929',
              height: textInputHeight,
            }}
            placeholder='' 
            value={msgContent} 
            // animated={true}
            autoFocus={false}//只聚焦，没有自动弹出键盘
            keyboardType="default"
            onChangeText={(val:string)=>{
              setMsgContent(val)
            }}
            onContentSizeChange={(event:any)=>{
              const { contentSize } = event.nativeEvent;
              if(contentSize.height>300) return;
              setTextInputHeight(['android'].includes(Platform.OS)?contentSize.height:contentSize.height+20)
            }}
            onFocus={async (val)=>{
              setShowBottomOperationBtn(false);
              setTimeout(() => {
                scrollRef.current?.scrollToEnd()
              },200);
            }}
            onSubmitEditing={async ()=>{}}/>
          }
          
          {
            msgContent ? <TouchableOpacity 
            style={{
              ...styles.sen_btn,
              backgroundColor: MyThemed[colorScheme||'light'].primaryColor,
            }}
            onPress={async ()=>{
              await sendMsg({
                msgRows: [
                  {
                    msg_type: 'text',
                    msg_content: msgContent,
                  }
                ]
              });
              setMsgContent('');
            }}>
              <Text style={styles.sen_btn_txt}>发送</Text>
            </TouchableOpacity>:<TouchableOpacity 
            style={styles.add_cir_icon}
            onPress={()=>{
              if(inputRef.current?.isFocused()){
                inputRef.current?.blur();
                setTimeout(()=>{
                  setShowBottomOperationBtn(true);
                },200);
              }else{
                
                if(showBottomOperationBtn){
                  setTimeout(()=>{
                    inputRef.current?.focus();
                  });
                }else{
                  setTimeout(()=>{
                    setShowBottomOperationBtn(true);
                  })
                }
              }
              setShowAudioBtn(false)
            }}>
              <Image 
              style={{
                width: 35,height: 35,
                tintColor: MyThemed[colorScheme||'light'].ftCr
              }} 
              source={ADD_CIR}/>
            </TouchableOpacity>
          }
        </Vw>
      </Vw>
      

    </Vw>
    {
      showBottomOperationBtn && <BottomOperationBtn onSendMsg={async (result:any,type:string)=>{
        console.log('type----->result',result,type,result.uri)
        const msgRows = [];
        if(['camera'].includes(type)){
          // result.uri = `file://${result.path}`;
          
          const index = result.uri.lastIndexOf('.');
          const suffix = result.uri.slice(index);
          msgRows.push({
            msg_type: ['.mov','.mp4'].includes(suffix)?'video':'img',
            msg_content: result.uri,
            file: result
          })
          
          console.log('type----->result----',msgRows)

          if(msgRows.length)  await sendMsg({
            msgRows: msgRows
          });

          return;
        }


        console.log('result====>>>',result);
        const assets = result.assets||[];
       
        for(const item of assets){
          const index = item.uri.lastIndexOf('.');
          const suffix = item.uri.slice(index);
          msgRows.push({
            msg_type: ['.mov','.mp4'].includes(suffix)?'video':'img',
            msg_content: item.uri,
            file: item
          })
        }

        if(msgRows.length)  await sendMsg({
          msgRows: msgRows
        })

        
      }}/>
    }

    <AudioModal ref={audioModalRef}/>
  </Vw>;
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    position: 'relative',
  },
  skeletonWrapper:{
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1
  },
  scroll_view:{
    flex:1,
    paddingHorizontal: 15,
  },
 
  bottomInputWrapper:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  msgContentInput:{
    borderRadius: 10,
    // height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlignVertical: "top",
    fontSize: 15
  },
  add_cir_icon:{
    marginLeft: 20,
  },
  sen_btn:{
    marginLeft: 20,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sen_btn_txt:{
    color: '#ffffff'
  },
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(ChatPage));
