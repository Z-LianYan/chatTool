import React, { useState,useEffect, useLayoutEffect } from 'react';
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
  
  const colorScheme = useColorScheme();
  const [msgContent,setMsgContent] = useState<string>();

  

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft:'',
      headerRight: '',
      title:'张三'
    });
  });
  // const navigationState = navigation.getState();
  // const routeName = navigationState.routeNames[navigationState.index]
  useEffect(()=>{
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
  })
  return <View style={styles.container}>
    <ScrollView style={styles.scroll_view}>
      {
        FriendsStore.chatLogs[params?.user_id]?.msg_contents?.map((item:any,index:number)=>{
          return <View key={index+'chatPage'} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
            <Image 
            style={{
              width: 25,height:25,
              // tintColor: MyThemed[colorScheme||'light'].ftCr
            }} 
            source={{uri:item.from_avatar}}/>
            <Text>{item.msg_content}</Text>
          </View>
        })
      }
    </ScrollView>
    <View style={{
      ...styles.bottomInputWrapper,
      borderTopColor: MyThemed[colorScheme||'light'].ftCr2
    }}>
      <TextInput 
      multiline={true}
      clearButtonMode={'always'}
      style={{
        ...styles.msgContentInput,
        flex:1,
        // backgroundColor: MyThemed[colorScheme||'light'].ctBg,borderWidth: 0,height: 50,borderRadius: 10,color:MyThemed[colorScheme||'light'].ftCr
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
      <TouchableOpacity 
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
    </View>
  </View>;
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    position: 'relative',
    
  },
  scroll_view:{
    flex:1,
  },
  bottomInputWrapper:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  msgContentInput:{
    backgroundColor: '#cccccc',
    borderRadius: 10,
    height: 40
  },
  add_cir_icon:{
    marginLeft: 20,
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(ChatPage));
