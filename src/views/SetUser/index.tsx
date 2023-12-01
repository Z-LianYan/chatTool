import React, { useState,useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react'
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
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
// import { View } from '../../component/customThemed';
import { FRIENDCIRCLE, QRCODE, RIGHT_ARROW, SETICON } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
import { SegmentedBar } from '../../component/teaset';
const SetUser = ({ 
  MyThemed,
  AppStore,
  navigation
}:any) => {
    
  const colorScheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft:'',
      // title: '聊天信息',
      headerStyle: { 
        backgroundColor: MyThemed[colorScheme||'light'].bg,
      },
    });
  });

  useEffect(()=>{
  })
  return <ScrollView style={styles.container}>
    <MyCell
    style={{marginTop:10}}
    title='消息免打扰' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={'未完成'}
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>
    <MyCell
    style={{marginTop:10}}
    title='置顶聊天' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={'未完成'}
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>
    <MyCell
    style={{marginTop:10}}
    title='提醒' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={'未完成'}
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>
  </ScrollView>
  
  ;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  headContainer:{
    paddingHorizontal:10,
    paddingBottom: 10,
  },
  avatarImg:{
    height: 60,
    width: 60,
    borderRadius: 10,

  },
  rightArrow:{
    width: 15,
    height: 15
  }
});

export default inject("AppStore","MyThemed")(observer(SetUser));
