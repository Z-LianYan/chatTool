import React, { useState,useEffect, useCallback } from 'react';
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
import { View } from '../../component/customThemed';
import { FRIENDCIRCLE } from '../../assets/image';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const FindPage = (props:any) => {
    console.log('props====>>>',props)
  const colorScheme = useColorScheme();
  const { MyThemed } = props;

  const hasNewFirendMsg = useCallback(()=>{
    return <View style={{
      width:30,
      height:30,
      marginHorizontal: 10,
      position:'relative'
    }}>
      <Image 
      style={{width:30,height:30,borderRadius:3}} 
      source={{uri:'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}}
      resizeMode="cover"/>
      <View style={{width: 8,
        height: 8,
        position:'absolute',
        right:-6,
        top:-4,
        borderRadius: 4,
        backgroundColor: MyThemed.mgDotCr,

      }}></View>
    </View>
  },[]);

  useEffect(()=>{});
  return <ScrollView>
    <MyCell
    title='朋友圈' 
    avatar={FRIENDCIRCLE}
    showBottomBorder={false}
    showRightArrow={true}
    isAvatarTintColor={false}
    rightValue={hasNewFirendMsg()}/>
  </ScrollView>;
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(FindPage));
