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
import { ADD_CIR, ADD_USER, ALBUM_ICON, CAPTURE_ICON, NEW_FIREND, VIDEO_ICON } from '../../assets/image';
import SocketIoClient from '../../socketIo';
import { Label, Menu, Overlay } from '../../component/teaset';
import { TextInput } from 'react-native-gesture-handler';
import { LOADING_ICON } from '../../assets/image/index';
import dayjs from 'dayjs';
import BottomOperationBtn from './BottomOperationBtn';
import { uniqueMsgId } from '../../utils/tool';
const _ = require('lodash');
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
  
  const sockitIo = SocketIoClient.getInstance();
  const { params } = route;
  
  const colorScheme:any = useColorScheme();
  const [msgContent,setMsgContent] = useState<string>();
  const [showSkeleton,setShowSkeleton] = useState<boolean>(true);
  const [textInputHeight,setTextInputHeight] = useState<number>(40);
  const [showBottomOperationBtn,setShowBottomOperationBtn] = useState<boolean>(false);
  
  const login_user_id = AppStore?.userInfo?.user_id;
  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft:'',
      headerRight: '',
      title: params?.user_name||'',
      headerStyle: { 
        backgroundColor: MyThemed[colorScheme||'light'].bg,
      }
    });
    
  });
  useEffect(()=>{
    setTimeout(() => {
      scrollRef.current.scrollToEnd();
      setTimeout(()=>{
        setShowSkeleton(false);
      },300);
    });
    return ()=>{
      runInAction(()=>{
        if(FriendsStore.chatLogs[login_user_id] && FriendsStore.chatLogs[login_user_id][params?.user_id]){
          FriendsStore.chatLogs[login_user_id][params?.user_id].hasNewMsg = false;
        }
      });
    }
  })
  
  const sendMsg = useCallback(async ()=>{
    console.log('FriendsStore.chatLogs[login_user_id]====>>>23',FriendsStore.chatLogs[login_user_id]);
    const _msgContent = msgContent?.trim();
    if(!_msgContent){
      Alert.alert(
        "提示",
        "不能发送空白消息",
        [
          // {
          //   text: "",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          { text: "确定", onPress: async () => {}}
        ]
      );
      return;
    }
    
    // return;
    if(!msgContent) return;
    const msg_row = {
      from_user_id: AppStore.userInfo?.user_id,
      to_user_id: params?.user_id,
      msg_content: msgContent,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      from_user_name: AppStore?.userInfo?.user_name,
      from_avatar: AppStore?.userInfo?.avatar,
      msg_type: 'text',
      sendIng: true,
      msg_unique_id: uniqueMsgId(AppStore.userInfo?.user_id)
    }
    setMsgContent('');
    runInAction(()=>{
      if(!FriendsStore.chatLogs[login_user_id]){
        FriendsStore.chatLogs[login_user_id] = {};
        FriendsStore.chatLogs[login_user_id][params?.user_id]={
          user_id:  AppStore.search_user_info?.user_id,
          user_name:  AppStore.search_user_info?.user_name,
          avatar:  AppStore.search_user_info?.avatar, 
          msg_contents: [msg_row],
        }
      }else if(!FriendsStore.chatLogs[login_user_id][params?.user_id]){
        FriendsStore.chatLogs[login_user_id][params?.user_id]={
          user_id:  AppStore.search_user_info?.user_id,
          user_name:  AppStore.search_user_info?.user_name,
          avatar:  AppStore.search_user_info?.avatar, 
          msg_contents: [msg_row],
        }
      }else if(FriendsStore.chatLogs[login_user_id][params?.user_id]){
        const obj = _.cloneDeep(FriendsStore.chatLogs[login_user_id][params?.user_id]);
        delete FriendsStore.chatLogs[login_user_id][params?.user_id];
        obj.msg_contents = (obj.msg_contents && obj.msg_contents.length)? [...obj.msg_contents,msg_row]:[msg_row]
        let _obj = {}
        _obj[params?.user_id] = obj;
        _obj =  {
          ..._obj,
          ...FriendsStore.chatLogs[login_user_id]
        }
        FriendsStore.chatLogs[login_user_id] = _obj;
      }
      // scrollRef.current.scrollTo({x: 0, y: scrollHeight+50, animated: false});
      setTimeout(() => {
        scrollRef.current.scrollToEnd()
      }, 200);
      sockitIo?.getSocketIo()?.emit('sendServerMsg',{ 
        msg_type: msg_row.msg_type, 
        msg_content: msg_row.msg_content,
        to_user_id: msg_row.to_user_id,
        msg_unique_id: msg_row.msg_unique_id
      },function(response:any) {
        console.log('服务端回调事件---------》〉》',response)
        if(!login_user_id || !params?.user_id) return;
        if (response && response.status === 'success' && response.msg_content) {
          runInAction(()=>{
            const len = FriendsStore.chatLogs[login_user_id][params?.user_id].msg_contents.length;
            const msg_contents = FriendsStore.chatLogs[login_user_id][params?.user_id].msg_contents;
            for(const item of msg_contents){
              if(response.msg_content.msg_unique_id == item.msg_unique_id) item.sendIng = false;
            }
          })
        } else {
          console.log('Failed to send message!');
        }
        
      });
    });
  },[msgContent]);


  const overlayView =  <Overlay.View
      style={{alignItems: 'center', justifyContent: 'center'}}
      modal={false}
      overlayOpacity={0}
      >
      <View style={{backgroundColor: '#fff', padding: 40, borderRadius: 15, alignItems: 'center'}}>
        <Label style={{color: '#000'}} size='xl' text='Overlay' />
      </View>
    </Overlay.View>
  
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
            {
              FriendsStore.chatLogs[login_user_id] && FriendsStore.chatLogs[login_user_id][params?.user_id]?.msg_contents?.map((item:any,index:number)=>{
                return <Vw key={index+'chatPage'} style={{
                  ...styles.msgCell,
                  justifyContent: item.from_user_id === AppStore.userInfo.user_id? 'flex-end':'flex-start',
                }}>
                  {
                    item.from_user_id === AppStore.userInfo.user_id && <Vw style={styles.msgTextContainer}>
                      {
                        // item.sendIng && <Text style={styles.leftLoadingIcon}>发送中...</Text>
                        item.sendIng && <Image 
                        style={{
                          ...styles.leftLoadingIcon,
                        }} 
                        source={LOADING_ICON}/>
                      }
                      <Vw style={styles.msgTextWrapper}>
                        <Text
                          selectable={true}
                          style={{
                            ...styles.msgText,
                            backgroundColor:  MyThemed[colorScheme||'light'].fromMsgBg,
                            color: MyThemed['light'].ftCr
                          }}
                        >{item.msg_content}</Text>
                      </Vw>
                      <Vw style={{
                        borderWidth: 8,
                        // borderColor: 'transparent',
                        borderLeftColor: MyThemed[colorScheme||'light'].fromMsgBg,
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        position: 'absolute',
                        right: -16,
                        top: 10,
                        // marginTop: -8,
                      }}></Vw>
                    </Vw>
                    
                  }
                  <Image 
                  style={{
                    ...styles.msgCellAvatar,
                    marginLeft: item.from_user_id === AppStore.userInfo.user_id? 10:0,
                    marginRight: item.from_user_id !== AppStore.userInfo.user_id? 10:0,
                  }} 
                  source={{uri: item.from_avatar}}/>
                  {
                    item.from_user_id !== AppStore.userInfo.user_id && <Vw style={styles.msgTextContainer}>
                      <Vw style={styles.msgTextWrapper}>
                        <Text
                          selectable={true}
                          style={{
                            ...styles.msgText,
                            // textAlign: 'center',
                            backgroundColor:  MyThemed[colorScheme||'light'].ctBg
                          }}
                        >{item.msg_content}</Text>
                      </Vw>
                      <Vw style={{
                        borderWidth: 8,
                        // borderColor: 'transparent',
                        borderLeftColor: 'transparent',
                        borderTopColor: 'transparent',
                        borderRightColor: MyThemed[colorScheme||'light'].ctBg,
                        borderBottomColor: 'transparent',
                        position: 'absolute',
                        left: -16,
                        top: 10,
                        // marginTop: -8,
                      }}></Vw>
                    </Vw>
                  }
                </Vw>
              })
            }
            
          </TouchableOpacity>
        </ScrollView>
        <Vw style={{
          ...styles.bottomInputWrapper,
          borderTopColor: ['light'].includes(colorScheme)?'#d3d3d3':'#292929',
          backgroundColor: MyThemed[colorScheme||'light'].bg
        }}>
          <TextInput 
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
            // console.log('val===',val)
            setMsgContent(val)
          }}
          onContentSizeChange={(event:any)=>{
            const { contentSize } = event.nativeEvent;
            if(contentSize.height>300) return;
            setTextInputHeight(['android'].includes(Platform.OS)?contentSize.height:contentSize.height+20)
          }}
          onFocus={async ()=>{
            setShowBottomOperationBtn(false);
            setTimeout(() => {
              scrollRef.current.scrollToEnd()
            },200);
          }}
          onSubmitEditing={async ()=>{}}/>
          {
            msgContent ? <TouchableOpacity 
            style={{
              ...styles.sen_btn,
              backgroundColor: MyThemed[colorScheme||'light'].primaryColor,
            }}
            onPress={async ()=>{
              await sendMsg()
            }}>
              <Text style={styles.sen_btn_txt}>发送</Text>
            </TouchableOpacity>:<TouchableOpacity 
            style={styles.add_cir_icon}
            onPress={()=>{

              // Overlay.show(overlayView);
              // return;
              
              console.log('inputRef.current.==>>',inputRef.current.isFocused())
              if(inputRef.current.isFocused()){
                inputRef.current.blur();
                setTimeout(()=>{
                  setShowBottomOperationBtn(true);
                });
              }else{
                
                if(showBottomOperationBtn){
                  setTimeout(()=>{
                    inputRef.current.focus();
                  });
                }else{
                  setTimeout(()=>{
                    setShowBottomOperationBtn(true);
                  })
                }
              }
            }}>
              <Image 
              style={{
                width: 25,height:25,
                tintColor: MyThemed[colorScheme||'light'].ftCr
              }} 
              source={ADD_CIR}/>
            </TouchableOpacity>
          }
        </Vw>

      </Vw>
      

    </Vw>
    {
      showBottomOperationBtn && <BottomOperationBtn/>
    }
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
  msgCell:{
    flexDirection:'row',
    marginVertical:10,
  },
  
  msgTextContainer:{
    maxWidth: '70%',
    position: 'relative',
  },
  msgTextWrapper:{
    borderRadius: 8,
    overflow: 'hidden'
  },
  msgCellAvatar:{
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  msgText:{
    padding: 8,
    lineHeight: 20,
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
    fontSize: 20
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
  leftLoadingIcon:{
    position: 'absolute',
    top: 3,
    left: -30,
    width: 30,
    height: 30,
    // fontSize: 10,
  },
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(ChatPage));
