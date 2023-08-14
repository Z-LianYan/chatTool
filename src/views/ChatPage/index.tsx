import React, { useState,useEffect } from 'react';
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
  View as Vw
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
import { NEW_FIREND } from '../../assets/image';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const ChatPage = ({ 
  AppStore,
  MyThemed,
  navigation,
}:any) => {
  const colorScheme = useColorScheme();
  // const navigationState = navigation.getState();
  // const routeName = navigationState.routeNames[navigationState.index]
  useEffect(()=>{
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
  })
  return <ScrollView>
    <MyCell 
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
      console.log('123456')
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
    avatar="https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png"/>
  </ScrollView>;
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(ChatPage));
