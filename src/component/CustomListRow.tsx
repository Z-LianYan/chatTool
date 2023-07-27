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
} from '../component/Themed';
import { 
  Button,
  Carousel,
  NavigationBar,
  Theme,
  ListRow
} from '../component/teaset/index';
/**
 * accessory 如设置则显示在列表行右侧。
  - none: 无
  - auto: 自动, 当设置了 onPress 属性时为'indicator', 否则为'none'
  - empty: 空, 不显示指示图标, 但占用'check'或'indicator'大小的位置
  - check: 小勾图标, 一般用于表示该行已被选中
  - indicator: 大于号图标, 一般用于表示点击此行打开新页面
*/
const CustomListRow = ({ 
  title,
  detail,
  bottomSeparator,
  accessory='none',
  onPress,
  activeOpacity=1,
  titleStyle={} ,
  backgroundColor,
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })

  const obj = {
    style:{
      backgroundColor:backgroundColor?backgroundColor:colorScheme=='dark'?'#000':'#fff'
    },
    titleStyle:{
      color:colorScheme=='dark'?'#fff':'#000',
      ...titleStyle
    },
    bottomSeparator:bottomSeparator,
    title:title,
    accessory:accessory,
    detail:detail,
    activeOpacity,
    onPress:()=>{
      onPress && onPress()
    }
  }
  return <ListRow
    {...obj} />;
};

const styles = StyleSheet.create({
});

export default CustomListRow;
