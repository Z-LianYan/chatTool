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
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Platform,
  ActivityIndicator,
  Image,
  TouchableOpacity
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
  Theme
} from '../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import { BACK_ICON } from './teaset/icons';


type TypeProps = {
  title?:number|string|Element,
  style?:object,
  backgroundColor?:string,
  position?:string,
  leftView?: number|string|Element,
  rightView?: number|string|Element,
  onBack?:Function,
  MyThemed?: any,
  AppStore?: any,
}
const _NavigationBar = ({
  title,
  style,
  backgroundColor,
  position,
  leftView,
  rightView,
  onBack,
  MyThemed,
  AppStore,
}:TypeProps) => {

  const colorScheme = useColorScheme();
  let navigation:any = useNavigation();

  const navigationState = navigation.getState();
  const routeName = navigationState.routeNames[navigationState.index]
  useEffect(()=>{

  },[title]);

  return (<View style={{...style}}>
    <NavigationBar 
    statusBarColor={'transparent'}
    statusBarInsets={Platform.OS === 'ios' ? false : true} 
    statusBarStyle={colorScheme=='dark'?'light-content':'dark-content'}
    title={title+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:'')}
    titleStyle={{
      fontSize:18,
      marginTop:8,
      color: MyThemed[colorScheme||'light'].ftCr,
      fontWeight: 'bold'
    }}
    style={{
      backgroundColor:backgroundColor?backgroundColor:MyThemed[colorScheme||'light'].hdBg,
      position:position?position:'relative',
      height: Platform.OS === "android"?90:50
    }}
    borderBottomColor={'transparent'}
    leftView={leftView?(typeof leftView === 'number'||'string'?<Text>{leftView}</Text>:leftView):<View 
      style={{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: backgroundColor?backgroundColor:MyThemed[colorScheme||'light'].hdBg,
      }}
      >
        <TouchableOpacity onPress={()=>{
           onBack ? onBack(): navigation.goBack();
        }}>
          <Image 
          style={{width:20,height:20,tintColor: MyThemed[colorScheme||'light'].ftCr}}
          source={BACK_ICON}/>
        </TouchableOpacity>
      </View>
    }
    rightView={typeof rightView == 'number'||'string'?<Text>{rightView}</Text>:rightView}
    type={'ios'}/>

  </View>);
};

const styles = StyleSheet.create({
  _text:{
  }
});

export default inject("AppStore","MyThemed")(observer(_NavigationBar));
