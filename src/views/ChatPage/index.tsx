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

  useEffect(()=>{
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
  })
  return <View style={{
  }}>
    <NavigationBar title={'聊天'} leftView=" "/>
    <Text onPress={()=>{
    runInAction(()=>{
      AppStore.tabBar['ChatPage'].msgCnt += 12345678;
      MyThemed[colorScheme||'light'].ctBg ='#'+Math.floor(Math.random()*1000000);
      setTimeout(() => {
        console.log('MyThemed--->>',MyThemed);
      }, 100);
      
    });
    }}>ChatPage </Text>

  </View>;
  
  
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(ChatPage));
