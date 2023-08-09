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
  return <View style={{}}>
    <CustomListRow
    bottomSeparator="none" 
    title={<Image style={{height:50,width:50}} source={{uri:'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}}/>} detail={'detail'} />
    <MyCell 
    title='title' 
    avatar="https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png"/>
  </View>;
  
  
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(ChatPage));
