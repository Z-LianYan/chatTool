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
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const MePage = ({ 
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })
  return <Text>MePage</Text>;
};

const styles = StyleSheet.create({
});

export default MePage;
