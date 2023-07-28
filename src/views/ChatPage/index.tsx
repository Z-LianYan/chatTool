import React, { useState,useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react'
import { observable, action, makeAutoObservable,runInAction } from 'mobx';

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
  Text as Tt,
  View as Vw
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { View,Text } from '../../component/Themed';
// import { 
//   View,
//   Text
// } from '../component/Themed';
const ChatPage = ({ 
  AppStore
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })
  return <Vw style={{
    height:500,
    borderWidth: 1,
    borderColor: 'red',
  }}>
    <Text onPress={()=>{
    runInAction(()=>{
      AppStore.tabBar['ChatPage'].badge += 12345678
    });
  }}>ChatPage</Text>

  </Vw>;
  
  
};

const styles = StyleSheet.create({
});

export default inject("AppStore")(observer(ChatPage));
