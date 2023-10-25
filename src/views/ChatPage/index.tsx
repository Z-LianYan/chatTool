import React, { useState,useEffect, useLayoutEffect, useCallback } from 'react';
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
  Dimensions
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
import { ADD_CIR, ADD_USER, NEW_FIREND } from '../../assets/image';
import SocketIoClient from '../../socketIo';
import { Menu } from '../../component/teaset';
import { TextInput } from 'react-native-gesture-handler';
import _ from 'lodash';
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
  const sockitIo = SocketIoClient.getInstance();
  const { params } = route;
  console.log('参数======》〉》',params,FriendsStore.chatLogs);
  
  const colorScheme:any = useColorScheme();
  const [msgContent,setMsgContent] = useState<string>();

  const login_user_id = AppStore?.userInfo?.user_id
  console.log('login_user_id=====>>>',login_user_id)
  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft:'',
      headerRight: '',
      title: params?.title||'',
      headerStyle: { 
        backgroundColor: MyThemed[colorScheme||'light'].bg,
      }
    });
  });
  // const navigationState = navigation.getState();
  // const routeName = navigationState.routeNames[navigationState.index]
  useEffect(()=>{
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
  })

  const sendMsg = useCallback(async ()=>{
    console.log('response---->>sendMsg')
    
    sockitIo?.getSocketIo()?.emit('sendServerMsg',{ 
      msg_type: 'text', 
      msg_content: msgContent,
      to_user_id: AppStore.search_user_info?.user_id,
    },function(response:any) {
      console.log('response---->>12345========',login_user_id,params?.user_id);
      if(!login_user_id || !params?.user_id) return;
      console.log('response---->>12345');

      if (response && response.status === 'success') {
        if(!response.msg_content) return;
        runInAction(()=>{
          // FriendsStore.chatLogs[login_user_id] = {

          //   ...FriendsStore.chatLogs[login_user_id],
          // }
          if(!FriendsStore.chatLogs[login_user_id]){
            FriendsStore.chatLogs[login_user_id] = {};
            FriendsStore.chatLogs[login_user_id][params?.user_id]={
              user_id:  AppStore.search_user_info?.user_id,
              user_name:  AppStore.search_user_info?.user_name,
              avatar:  AppStore.search_user_info?.avatar, 
              msg_contents: [response.msg_content],
            }
          }else if(!FriendsStore.chatLogs[login_user_id][params?.user_id]){
            FriendsStore.chatLogs[login_user_id][params?.user_id]={
              user_id:  AppStore.search_user_info?.user_id,
              user_name:  AppStore.search_user_info?.user_name,
              avatar:  AppStore.search_user_info?.avatar, 
              msg_contents: [response.msg_content],
            }
          }else if(FriendsStore.chatLogs[login_user_id][params?.user_id]){
            const obj = _.cloneDeep(FriendsStore.chatLogs[login_user_id][params?.user_id]);
            delete FriendsStore.chatLogs[login_user_id][params?.user_id];
            obj.msg_contents = (obj.msg_contents && obj.msg_contents.length)? [...obj.msg_contents,response.msg_content]:[response.msg_content]
            let _obj = {}
            _obj[params?.user_id] = obj;
            _obj =  {
              ..._obj,
              ...FriendsStore.chatLogs[login_user_id]
            }
            FriendsStore.chatLogs[login_user_id] = _obj;
          }
        })
      } else {
        console.log('Failed to send message!');
      }
      
    });
  },[msgContent]);
  return <Vw style={styles.container}>
    <ScrollView style={styles.scroll_view}>
      {
        FriendsStore.chatLogs[login_user_id] && FriendsStore.chatLogs[login_user_id][params?.user_id]?.msg_contents?.map((item:any,index:number)=>{
          return <Vw key={index+'chatPage'} style={{
            ...styles.msgCell,
            justifyContent: item.from_user_id === AppStore.userInfo.user_id? 'flex-end':'flex-start',
          }}>
            {
              item.from_user_id === AppStore.userInfo.user_id && <Vw style={styles.msgTextContainer}>
                <Vw style={styles.msgTextWrapper}>
                  <Text
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
    </ScrollView>
    <Vw style={{
      ...styles.bottomInputWrapper,
      borderTopColor: ['light'].includes(colorScheme)?'#d3d3d3':'#292929',
    }}>
      <TextInput 
      multiline={true}
      clearButtonMode={'always'}
      style={{
        ...styles.msgContentInput,
        flex:1,
        backgroundColor: ['light'].includes(colorScheme)?'#ffffff':'#292929',
      }}
      placeholder='' 
      value={msgContent} 
      // animated={true}
      autoFocus={false}//只聚焦，没有自动弹出键盘
      keyboardType="default"
      onChangeText={(val:string)=>{
        console.log('val===',val)
        setMsgContent(val)
      }}
      onSubmitEditing={async ()=>{}}/>
      
      {
        msgContent ? <TouchableOpacity 
        style={{
          ...styles.sen_btn,
          backgroundColor: MyThemed[colorScheme||'light'].primaryColor,
        }}
        onPress={async ()=>{
          console.log('123456');
          await sendMsg()
        }}>
          <Text style={styles.sen_btn_txt}>发送</Text>
        </TouchableOpacity>:<TouchableOpacity 
        style={styles.add_cir_icon}
        onPress={()=>{
          console.log('123456');
          
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
  </Vw>;
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    position: 'relative',
    
  },
  scroll_view:{
    flex:1,
    paddingTop: 30,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  msgCell:{
    flexDirection:'row',
    // alignItems:'center',
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
    // maxWidth: '70%',
    padding: 8,
    lineHeight: 20,
    // borderRadius: 5,
  },
  bottomInputWrapper:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  msgContentInput:{
    // backgroundColor: '#cccccc',
    borderRadius: 10,
    height: 40,
    // padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  add_cir_icon:{
    marginLeft: 20,
  },
  sen_btn:{
    marginLeft: 20,
    // borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sen_btn_txt:{
    color: '#ffffff'
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(ChatPage));
