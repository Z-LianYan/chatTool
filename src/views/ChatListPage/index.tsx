import React, { useState,useEffect, useLayoutEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react'
import { observable, action, makeAutoObservable,runInAction } from 'mobx';

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
import { ADD_CIR, ADD_USER, NEW_FIREND, SEND_FAIL } from '../../assets/image';
import SocketIoClient from '../../socketIo';
import { Menu } from '../../component/teaset';
import dayjs from 'dayjs';
import { isArray } from 'lodash';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const ChatListPage = ({ 
  AppStore,
  MyThemed,
  navigation,
  FriendsStore,
}:any) => {
  
  const colorScheme = useColorScheme();

  const [initPage,setInitPage] = useState<boolean>(true);

  const login_user_id = AppStore.userInfo?.user_id;
  const chatLogs = FriendsStore.chatLogs[login_user_id]||{};
  const userIdSort = chatLogs?.userIdSort||[];

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft:'',
      headerRight: ()=>{
        return <Vw style={{paddingRight: 10}}>
          <TouchableOpacity 
          activeOpacity={0.6}
          onPress={()=>{
            console.log('123456');
            // fromView.measureInWindow((x:number, y:number, width:number, height:number) => {
              
            // });
            const width = Dimensions.get('window').width;
            let items = [
              { title: '添加朋友', 
                icon: ADD_USER, 
                onPress: () => {
                  console.log('Search')
                  navigation.navigate('AddFriend')
                }
              },
            ];
            Menu.show({x: width-130, y: 0, width:100, height:100}, items);
          }}>
            <Image 
            style={{
              width: 25,height:25,
              tintColor: MyThemed[colorScheme||'light'].ftCr
            }} 
            source={ADD_CIR}/>
          </TouchableOpacity>
          
        </Vw>
      }
    });
  });
  // const navigationState = navigation.getState();
  // const routeName = navigationState.routeNames[navigationState.index]
  useEffect(()=>{
    runInAction(()=>{
      AppStore.curRouteName = 'ChatListPage';
    })

    setTimeout(() => {
      setInitPage(false)
    }, 2000);
    
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
  })

  const getFinalRowMsg = useCallback((msg_contents:any=[])=>{
    let len = msg_contents.length-1;
    if(len<0) return null;
    for(let i=len;i>=0;i--){
      if(msg_contents[i]?.msg_type) return msg_contents[i];
    }
    return null;
  },[]);

  const handerMsgShow = useCallback((finalRowMsg:any)=>{
    return ['img'].includes(finalRowMsg?.msg_type)?'[图片]'
      :['video'].includes(finalRowMsg?.msg_type)?"[视频]"
      :['emo'].includes(finalRowMsg?.msg_type)?"[表情]"
      :['audio'].includes(finalRowMsg?.msg_type)?"[语音]"
      :finalRowMsg?.msg_content;
  },[]);
  
  const renderCell = useCallback(()=>{
    const redArr = [];
    for(const key of userIdSort){
      const msg_contents = chatLogs[key]?.msg_contents||[];
      let len = msg_contents?.length;
      let msgCount = 0;

      for(const item of msg_contents) if(!item.readMsg && item?.msg_type) msgCount+=1;
      const finalRowMsg = getFinalRowMsg(msg_contents);
      redArr.push(<MyCell 
        msgCount={msgCount}
        time={finalRowMsg?.created_at && dayjs(finalRowMsg?.created_at).format("HH:mm")}
        title={FriendsStore.chatLogs[login_user_id][key]?.f_user_name_remark||FriendsStore.chatLogs[login_user_id][key]?.user_name} 
        avatarStyle={{
          width: 44,
          height: 44
        }}
        key={key+'chatList'}
        showDisNotice={false}
        showBottomBorder={!(key===userIdSort[userIdSort.length-1])}
        msg={handerMsgShow(finalRowMsg)}
        hasNewMsg={msgCount?true:false}
        avatar={FriendsStore.chatLogs[login_user_id][key]?.avatar} 
        onPress={()=>{
          runInAction(async ()=>{
            FriendsStore.chatLogs[login_user_id][key].newAddFriendReadMsg = true;
            setTimeout(() => {
              navigation.navigate('ChatPage',{
                user_id: key,
                user_name: FriendsStore.chatLogs[login_user_id][key]?.f_user_name_remark||FriendsStore.chatLogs[login_user_id][key]?.user_name,
                avatar: FriendsStore.chatLogs[login_user_id][key]?.avatar
              });
            });
          });
          
        }}
        curRouteName="ChatListPage"
      />)
    }
    return redArr;
  },[userIdSort,chatLogs]);
  return <ScrollView>
    {/* <MyCell 
    time='12:59'
    title='标题' 
    avatarStyle={{
      width: 44,
      height:44
    }}
    showDisNotice={true}
    showRightArrow={true}
    rightValue="12345"
    msg='1234567898765积分个懒人沙发就是浪费的时刻就放假睡懒觉饭都是废话lkl互粉啦放假啦大家福利都放假了就放辣椒来得及放辣椒的费拉达斯见风使舵了人家饿了人家了'
    hasNewMsg={true}
    showBottomBorder={true}
    avatar={'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}
    onPress={()=>{
      navigation.navigate('ChatPage',{});
    }}/> */}

    {
      !AppStore.connecting && !initPage && <Vw style={styles.netError}>
          <Image 
            style={{
              ...styles.netErrorImg,
            }} 
            source={SEND_FAIL}/>
        <Tt style={styles.netErrorTxt}>当前无法连接网络，可检查网络设置是否正常。</Tt>
      </Vw>
    }

    {
      renderCell()
    }

   
    {
      !userIdSort.length && <Text style={styles.emptyContent}>没有聊天记录</Text>
    }

    
  </ScrollView>;
};

const styles = StyleSheet.create({
  emptyContent:{
    textAlign: 'center',
    height: 200,
    lineHeight: 200
  },
  netError:{
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdeeeb'
  },
  netErrorImg:{
    width: 20,
    height: 20,
    marginRight: 15
  },
  netErrorTxt:{
    color: '#7a6a6a',
    fontSize: 12
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(ChatListPage));
