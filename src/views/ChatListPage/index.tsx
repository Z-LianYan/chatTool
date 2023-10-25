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
import { ADD_CIR, ADD_USER, NEW_FIREND } from '../../assets/image';
import SocketIoClient from '../../socketIo';
import { Menu } from '../../component/teaset';
import dayjs from 'dayjs';
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
  const sockitIo = SocketIoClient.getInstance();
  
  const colorScheme = useColorScheme();

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft:'',
      headerRight: ()=>{
        return <Vw style={{paddingRight: 10}}>
          <TouchableOpacity 
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
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
  })
  const renderCell = useCallback(()=>{
    const redArr = [];
    const user_id = AppStore.userInfo?.user_id;
    for(const key in FriendsStore.chatLogs[user_id]){
      let len = FriendsStore.chatLogs[user_id][key]?.msg_contents?.length;
      redArr.push(<MyCell 
      time={FriendsStore.chatLogs[user_id][key]?.msg_contents[len-1]?.created_at && dayjs(FriendsStore.chatLogs[user_id][key]?.msg_contents[len-1]?.created_at).format("HH:mm")}
      title={FriendsStore.chatLogs[user_id][key]?.user_name} 
      avatarStyle={{
        width: 44,
        height: 44
      }}
      key={key+'chatList'}
      showDisNotice={false}
      msg={FriendsStore.chatLogs[user_id][key]?.msg_contents[len-1]?.msg_content}
      hasNewMsg={true}
      avatar={FriendsStore.chatLogs[user_id][key]?.avatar} 
      onPress={()=>{
        navigation.navigate('ChatPage',{
          user_id: key
        });
      }}/>)
    }
    return redArr;
  },[FriendsStore.chatLogs]);
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
    }}/>
    <MyCell 
    time='12:59'
    title='标题' 
    avatarStyle={{
      width: 44,
      height: 44
    }}
    showDisNotice={true}
    msg='1234567898765积分个懒人沙发就是浪费的时刻就放假睡懒觉饭都是废话lkl互粉啦放假啦大家福利都放假了就放辣椒来得及放辣椒的费拉达斯见风使舵了人家饿了人家了'
    hasNewMsg={true}
    avatar="http://zly.imgresource.com.cn/public/chat/commonAvatar.png"
    onPress={()=>{
      navigation.navigate('ChatPage',{});
    }}/> */}

    {
      renderCell()
    }

    {/* {
      FriendsStore.chatLogs.map((item:any,index:number)=>{
        let len = item.msg_contents.length;
        return <MyCell 
        time={item?.msg_contents[len-1]?.created_at && dayjs(item?.msg_contents[len-1]?.created_at).format("HH:mm")}
        title={item?.user_name} 
        avatarStyle={{
          width: 44,
          height: 44
        }}
        key={index+'chatListPageCell'}
        showDisNotice={false}
        msg={item?.msg_contents[len-1]?.msg_content}
        hasNewMsg={true}
        avatar={item?.avatar} 
        onPress={()=>{
          navigation.navigate('ChatPage',{
            index
          });
        }}/>
      })
    } */}

    {
      !FriendsStore.chatLogs.length && <Text style={styles.emptyContent}>没有聊天记录</Text>
    }

    {/* <Text onPress={()=>{
      sockitIo.getSocketIo().emit('server',{ a: AppStore?.userInfo?.user_name, c: [] });
      // console.dir(sockitIo.getSocketIo());
    }}>
      {
        AppStore?.userInfo?.user_name
      }
    </Text> */}
    
  </ScrollView>;
};

const styles = StyleSheet.create({
  emptyContent:{
    textAlign: 'center',
    height: 200,
    lineHeight: 200
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(ChatListPage));
