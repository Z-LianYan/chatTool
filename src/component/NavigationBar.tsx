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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
} from '../component/Themed';
import { 
  Button,
  Carousel,
  NavigationBar,
  Theme
} from '../component/teaset/index';
import PropTypes, { number } from 'prop-types';


import { get_film_hot } from '../api/film';
type TypeProps = {
  title?:number|string|Element,
  style?:object,
  backgroundColor?:string,
  position?:string,
  leftView?: number|string|Element,
  rightView?: number|string|Element,
  onBack?:Function
}
const _NavigationBar = ({
  title,
  style,
  backgroundColor,
  position,
  leftView,
  rightView,
  onBack,
}:TypeProps) => {
    
  const colorScheme = useColorScheme();
  let navigation:any = useNavigation();
  // const [groupValues, setGroupValues] = useState(['0']);

  useEffect(()=>{},[title])

  return (<View style={{...style}}>
    <NavigationBar 
    statusBarColor={'transparent'}
    statusBarInsets={Platform.OS === 'ios' ? false : true} 
    statusBarStyle={'default'}
    title={title?(typeof title === 'number'||'string'?<Text style={{fontSize:20,color:'#fff'}}>{title}</Text>:title):''}
    titleStyle={{
      // fontSize:30
    }}
    style={{
      backgroundColor:backgroundColor?backgroundColor:colorScheme === 'dark' ? Theme.primaryColor : Theme.primaryColor,
      position:position?position:'relative'
    }}
    borderBottomColor={backgroundColor=='transparent'?'transparent':colorScheme=='dark'?Theme.navSeparatorDarkColor:Theme.primaryColor}
    leftView={leftView?(typeof leftView === 'number'||'string'?<Text>{leftView}</Text>:leftView):<View 
      style={{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:Theme.primaryColor
      }}>
        <Ionicons 
        name={'chevron-back'} 
        size={25} 
        color={colorScheme === 'dark' ? '#fff' : '#fff'} 
        onPress={()=>{
          onBack ? onBack(): navigation.goBack();
        }}/>
        {/* <Ionicons 
        name={'home'} 
        size={25} 
        color={colorScheme === 'dark' ? '#fff' : '#000'} 
        onPress={()=>{
            navigation.goBack()
        }}/> */}
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

export default _NavigationBar;
