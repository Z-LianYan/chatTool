/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Provider,observer, inject } from 'mobx-react';

import { TopView, Toast,Theme } from './component/teaset/index';//使用 ./component/teaset/index ui库需要安装依赖 prop-types,rebound,immutable,react-timer-mixin,create-react-class,fbjs  
import store from './store/index';
import StackNavigators from './navigators/StackNavigators';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigationContainerRef 
} from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/core';


// console.log('DefaultTheme--->>',DefaultTheme)

import NavigationContainerCom from './navigators/NavigationContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketIoClient from './socketIo';
import { get_user_info } from './api/user';

function App(): JSX.Element {
  const colorScheme = useColorScheme();
  // const navigation:any = useNavigation();
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

  const [token,setToken] = useState<string>();
  const [tokenComplete,setTokenComplete] = useState<boolean>(false);
  useEffect(()=>{
      (async ()=>{
          const _token:any = await AsyncStorage.getItem('token');
          if(_token){
            setToken(_token);
            await getUserInfo();
            const sockitIo = SocketIoClient.getInstance(()=>{});
          }
          setTokenComplete(true);
      })();
  },[]);

  const  getUserInfo = useCallback(async ()=>{
    try{
      const result:any = await get_user_info();
      if(result) {
        store.AppStore.setUserInfo(result);
      }else{
        setToken('');
      }
    }catch(err:any){
      console.log('----error',err.message);
      setToken('');
    }
  },[]);

  
  Theme.set({
    primaryColor: store.MyThemed[colorScheme||'light'].primaryColor,

    btnPrimaryBorderColor: store.MyThemed[colorScheme||'light'].btnPrimaryBorderColor,// button组件 type=‘primary’ 边框颜色
    btnPrimaryColor: store.MyThemed[colorScheme||'light'].btnPrimaryColor,// button组件 type=‘primary’ 背景颜色
    btnPrimaryTitleColor: store.MyThemed[colorScheme||'light'].btnPrimaryTitleColor,// type=‘primary’ title颜色

    btnColor: store.MyThemed[colorScheme||'light'].btnColor, // button组件 type=‘default’ 背景颜色
    btnBorderColor: store.MyThemed[colorScheme||'light'].btnBorderColor,// button组件  type=‘default’ 边框颜色
    btnTitleColor: store.MyThemed[colorScheme||'light'].btnTitleColor,// button组件  type=‘default’ title字体颜色

    btnSecondaryColor: store.MyThemed[colorScheme||'light'].btnSecondaryColor,// type='secondary' 背景颜色
    btnSecondaryBorderColor: store.MyThemed[colorScheme||'light'].btnSecondaryBorderColor,//type='secondary' 边框颜色
    btnSecondaryTitleColor: store.MyThemed[colorScheme||'light'].btnSecondaryTitleColor,// type='secondary' title颜色


    btnDangerColor: store.MyThemed[colorScheme||'light'].btnDangerColor,//type='danger' 背景颜色
    btnDangerBorderColor: store.MyThemed[colorScheme||'light'].btnDangerBorderColor,//type='danger' 边框颜色
    btnDangerTitleColor: store.MyThemed[colorScheme||'light'].btnDangerTitleColor,//type='danger' title颜色

    btnLinkColor: store.MyThemed[colorScheme||'light'].btnLinkColor,//type='link' 背景颜色
    btnLinkBorderColor: store.MyThemed[colorScheme||'light'].btnLinkBorderColor,//type='link' 边框颜色
    btnLinkTitleColor: store.MyThemed[colorScheme||'light'].btnLinkTitleColor,// type='link' title颜色

    labelTextColor: store.MyThemed[colorScheme||'light'].labelTextColor,
    labelTextTitleColor: store.MyThemed[colorScheme||'light'].labelTextTitleColor,
    labelTextDetailColor: store.MyThemed[colorScheme||'light'].labelTextDetailColor,
    labelTextDangerColor: store.MyThemed[colorScheme||'light'].labelTextDangerColor,


    cbTitleColor: store.MyThemed[colorScheme||'light'].ftCr,
    cbCheckedTintColor: store.MyThemed[colorScheme||'light'].primaryColor,
    cbUncheckedTintColor: store.MyThemed[colorScheme||'light'].ftCr,
  });

  return <Provider {...store}>
      <SafeAreaView style={{
        flex:1, 
        backgroundColor: store.MyThemed[colorScheme||'light'].bg
        }}>
        <TopView style={{flex:1}}>
          <StatusBar 
          hidden={false} 
          translucent={true}//指定状态栏是否透明
          backgroundColor={"transparent"} //状态栏的背景色  
          barStyle={colorScheme=='dark'?'light-content':'dark-content'}
          />
          <NavigationContainerCom>
            {tokenComplete && <StackNavigators token={token}/>}
          </NavigationContainerCom>
        </TopView>
      </SafeAreaView>
  </Provider>;
}

const styles = StyleSheet.create({
  
});

export default App;
