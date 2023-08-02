/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
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


console.log('DefaultTheme--->>',DefaultTheme)

import NavigationContainerCom from './navigators/NavigationContainer';



function App(): JSX.Element {
  const colorScheme = useColorScheme();
  // const navigation:any = useNavigation();
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

  Theme.set({
    primaryColor:'blue',
    btnPrimaryBorderColor: store.MyThemed[colorScheme||'light'].btnPrimaryColor,
    btnPrimaryColor: store.MyThemed[colorScheme||'light'].btnPrimaryColor
  })
  return <Provider {...store}>
      <SafeAreaView style={{flex:1, backgroundColor: store.MyThemed[colorScheme||'light'].bg}}>
        <TopView style={{flex:1}}>
          <StatusBar 
          hidden={false} 
          translucent={true}//指定状态栏是否透明
          backgroundColor={"transparent"} //状态栏的背景色  
          barStyle={colorScheme=='dark'?'light-content':'dark-content'}
          />
          <NavigationContainerCom>
            <StackNavigators/>
          </NavigationContainerCom>
        </TopView>
      </SafeAreaView>
  </Provider>;
}

const styles = StyleSheet.create({
  
});

export default App;
