/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState,useEffect } from 'react';
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
  TouchableHighlight
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { 
  View,
  Text
} from './customThemed';
import { 
  Button,
  Carousel,
  NavigationBar,
  Theme,
  ListRow
} from './teaset/index';

const MyCell = ({ 
  avatar,
  title,
  msg,
  time,
  noticeIcon,
  onPress,
  MyThemed,
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })

  const obj = {
    // style:{
    //   backgroundColor:backgroundColor?backgroundColor:MyThemed[colorScheme||'light'].ctBg
    // },
    // titleStyle:{
    //   color:MyThemed[colorScheme||'light'].ftCr,
    //   ...titleStyle
    // },
    // bottomSeparator:bottomSeparator,
    // title:title,
    // accessory:accessory,
    // detail:detail,
    // activeOpacity,
    // onPress:()=>{
    //   onPress && onPress()
    // }
  }
  return <TouchableOpacity style={styles.container}>
    <Image style={{height:50,width:50}} source={{uri:'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}}/>

    <Text>125</Text>
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  container:{
    padding:10,
    flexDirection: 'row', 
  }
});

export default inject("AppStore","MyThemed")(observer(MyCell));
