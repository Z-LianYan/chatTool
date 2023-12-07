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
  Switch,
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
const SetChatMsg = ({ 
  MyThemed,
  AppStore,
  navigation
}:any) => {
    
  const colorScheme = useColorScheme();
  const [remind,setRemind] = useState<boolean>(false);
  const [notDisturb,setNotDisturb] = useState<boolean>(false);
  const [msgTop,setMsgTop] = useState<boolean>(false);

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
    rightValue={<Switch
      trackColor={{ false: "#767577", true: MyThemed[colorScheme||'light'].primaryColor }}
      onValueChange={(val)=>{
        setNotDisturb(val);
      }}
      value={notDisturb}
    />}
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>
    <MyCell
    style={{marginTop:10}}
    title='置顶聊天' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={<Switch
      trackColor={{ false: "#767577", true: MyThemed[colorScheme||'light'].primaryColor }}
      onValueChange={(val)=>{
        setMsgTop(val);
      }}
      value={msgTop}
    />}
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>
    <MyCell
    style={{marginTop:10}}
    title='提醒' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={<Switch
      trackColor={{ false: "#767577", true: MyThemed[colorScheme||'light'].primaryColor }}
      onValueChange={(val)=>{
        setRemind(val);
      }}
      value={remind}
    />}
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

export default inject("AppStore","MyThemed")(observer(SetChatMsg));
