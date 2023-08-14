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
import { NEW_FIREND } from '../../assets/image';
import { View } from '../../component/customThemed';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const AddressBookPage = ({
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })
  return <ScrollView>
    <MyCell
    title='新的朋友' 
    avatar={NEW_FIREND}
    showBottomBorder={true}
    showRightArrow={false} />
    <MyCell
    title='仅聊天的朋友' 
    avatar={NEW_FIREND}
    showBottomBorder={false}
    showRightArrow={false}/>

    
    <MyCell
    style={{marginTop:30}}
    title='晓明' 
    avatar="https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png"
    showBottomBorder={true}
    showRightArrow/>
    <MyCell
    title='张三' 
    avatar="https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png"/>
  </ScrollView>;
};

const styles = StyleSheet.create({
});

export default AddressBookPage;
