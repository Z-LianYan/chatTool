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
  View as Viw,
  Text as Txt,
  NativeModules
} from 'react-native';
const { StatusBarManager } = NativeModules;

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
// import { useHeaderHeight } from '@react-navigation/elements';

import { get_film_hot } from '../api/film';
type TypeProps = {
  title?:number|string|Element,
  style?:object,
  backgroundColor?:string,
  position?:string,
  leftView?: number|string|Element,
  rightView?: number|string|Element,
  onBack?:Function,
  headerHeight:number
}
const HeaderBar = ({
  title,
  style,
  backgroundColor='',
  position,
  leftView=true,
  rightView,
  onBack,
  headerHeight
}:TypeProps) => {
  
  const colorScheme = useColorScheme();
  let navigation:any = useNavigation();
  // const [groupValues, setGroupValues] = useState(['0']);

  useEffect(()=>{},[])

  let headerContainerObj = {
    ...styles.headerContainer,
    ...style,
    height:headerHeight,
    backgroundColor:colorScheme=='dark'?'#000':Theme.primaryColor,
    paddingTop:StatusBarManager.HEIGHT
  }
  if(backgroundColor){
    headerContainerObj['backgroundColor'] = backgroundColor;
  }

  return (<View style={{
    ...headerContainerObj
  }}>
    <Viw style={{
      ...styles.headerItem,
      justifyContent:'flex-start',
      minWidth:40
    }}>
      {
        <Ionicons 
        name={'chevron-back'} 
        size={30} 
        color={colorScheme === 'dark' ? '#fff' : '#fff'} 
        onPress={()=>{
          onBack ? onBack(): navigation.goBack();
        }}/>
      }
    </Viw>
    <Viw style={{
      ...styles.headerItem,
      justifyContent:'center',
      flex:1
    }}>
      {typeof title=='string'||'number'?<Text style={styles.title}>{title}</Text>:title}
    </Viw>
    <Viw style={{
      ...styles.headerItem,
      justifyContent:'flex-end',
      minWidth:40,
      paddingRight:8
    }}>
      {typeof rightView=='string'||'number'?<Text style={styles.rightView}>{rightView}</Text>:rightView}
    </Viw>
  </View>);
};

const styles = StyleSheet.create({
  headerContainer:{
    height:100,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  headerItem:{
    // flex:1,
    flexDirection:'row',
  },
  leftView:{

  },
  title:{
    fontSize:20,
    color:'#fff'
  },
  rightView:{
    fontSize:18
  }
});

export default inject("AppStore")(observer(HeaderBar));
