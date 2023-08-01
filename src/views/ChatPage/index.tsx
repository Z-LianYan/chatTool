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
  AppStore,
  MyThemed
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })
  return <View style={{
    height:500,
    borderWidth: 1,
    borderColor: 'red',
  }}>
    <Text onPress={()=>{
    runInAction(()=>{
      AppStore.tabBar['ChatPage'].badge += 12345678;
      MyThemed.light.bg ='#'+Math.floor(Math.random()*1000000);
      setTimeout(() => {
        console.log('MyThemed--->>',MyThemed);
      }, 100);
      
    });

  }}>ChatPage {MyThemed.light.bg}</Text>

  </View>;
  
  
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(ChatPage));
