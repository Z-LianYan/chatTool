/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState,useEffect, useCallback } from 'react';
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
  TouchableOpacity,
  TouchableHighlight,
  View as Viw,
  Text as Txt,
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
import { 
  FIlM_ICON,
  FIlM_ACTIVE_ICON, 
  CINEMA_ICON,
  CINEMA_ACTIVE_ICON,
  MINE_ICON,
  MINE_ACTIVE_ICON,
} from '../assets/image/index';

import { get_film_hot } from '../api/film';
type TypeProps = {
  size?:number,
  value?:number,
  maxValue?:number,
  // allowHalf?:boolean,
  readOnly?:boolean,
  style?: object,
  marginRight?:number,
  onChange?:(val:number)=> void
}
const Star = ({
  size = 13,
  value = 0,
  maxValue = 5,
  marginRight = 3,
  // allowHalf = false,
  readOnly = false,
  style,
  onChange
}:TypeProps) => {
  const colorScheme = useColorScheme();
  useEffect(()=>{
  })

  const renderStart = useCallback(()=>{
    let dom = []
    for(let i=0;i<maxValue;i++){
      let isHalf = i<value && value<(i+1)
      dom.push(<View 
        key={i+'star'} 
        style={{
          ...styles.starItem,
          marginRight:marginRight,
          height:size,
          width:size
        }}>
        <Ionicons
        name={isHalf?'star-half-sharp':(i+1)<=value?'star-sharp':'md-star-outline'} 
        size={isHalf?size:(i+1)<=value?size:size-3} 
        color={((i+1)<=value || isHalf)?Theme.primaryColor:Theme.primaryColor}
        style={{marginTop:isHalf?0:(i+1)<=value?0:1.5,marginLeft:isHalf?0:(i+1)<=value?0:-1.55}}/>
        <TouchableOpacity 
        style={styles.leftWrapper} 
        activeOpacity={0.9}
        onPress={()=>{
          let len = i+1
          onChange && onChange(((len - 0.5)=== value)?(value-0.5):(len - 0.5))
        }}></TouchableOpacity>
        <TouchableOpacity 
        style={styles.rightWrapper} 
        activeOpacity={0.9}
        onPress={()=>{
          let len = i+1
          onChange && onChange((len == value)?(value-0.5):len)
        }}></TouchableOpacity>
      </View>)
    }
    return dom;
  },[value])

  return <View style={{ 
    // height:size,
    // width:'100%',
    // flex:1,
    backgroundColor:'transparent',
    flexDirection:'row',
    ...style
  }}>
    { renderStart() }
</View>;
};

const styles = StyleSheet.create({
  starItem:{
    position:'relative',
    backgroundColor:'transparent',
    justifyContent:'center',
    alignItems:'center'
  },
  leftWrapper:{
    position:'absolute',
    left:0,
    width:'50%',
    height:'100%',
    backgroundColor:'transparent',
    zIndex:1,
    justifyContent:'center',
    opacity:0.5
  },
  rightWrapper:{
    position:'absolute',
    right:0,
    width:'50%',
    height:'100%',
    backgroundColor:'transparent',
    zIndex:1,
    justifyContent:'center',
    opacity:0.5
  },
});

export default Star;
