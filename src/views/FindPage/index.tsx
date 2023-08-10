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
  TouchableHighlight,
  Text
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import MyCell from '../../component/MyCell';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const FindPage = (props:any) => {
    console.log('props====>>>',props)
  const colorScheme = useColorScheme();

  useEffect(()=>{});
{/* <Image 
      style={{width:30,height:30}} 
      source={{uri:'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}}
      resizeMode="cover"/> */}
  return <>
    <MyCell
    title='朋友圈' 
    avatar="https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png"
    showBottomBorder={false}
    showRightArrow={true}
    rightValue={<Image 
      style={{width:30,height:30}} 
      source={{uri:'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}}
      resizeMode="cover"/>}/>
  </>;
};

const styles = StyleSheet.create({
});

export default FindPage;
