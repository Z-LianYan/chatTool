import React, { useState,useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react';
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
  Alert,
  Dimensions
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { 
  View,
  Text
} from '../component/customThemed';
import { 
  Button,
  Carousel,
  // NavigationBar,
  Theme,
  ListRow,
  Toast,
  Input
} from '../component/teaset/index';
import PropTypes, { number, string } from 'prop-types';
import NavigationBar from '../component/NavigationBar';
import { login_out } from "../api/user";
var ScreenObj = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INIT_PAGE } from '../assets/image';

const InitPage = ({AppStore,navigation,route}:any) => {
  let [time,setTime] = useState(3);
  let [userInfo,setUserInfo] = useState(null);
  const colorScheme = useColorScheme();
  useEffect(()=>{
    
    let timer = setInterval(async () => {
      if(time<=0) {
        clearInterval(timer);
        // getUserInfo();
        navigation.replace('LoginPage',{
          // hidBackBtn:true
        })
      };
      time -= 1;
      setTime(time);
    }, 1000);
    return ()=>{
      clearInterval(timer);
    }
  },[]);
  
  return <View style={styles.container}>
    <Image style={{ 
      width:'100%',
      flex:1
    }} source={INIT_PAGE}/>
  </View>;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  headContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 40,
    paddingTop:50,
  }
  
});

export default inject("AppStore")(observer(InitPage));
