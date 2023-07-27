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

function App(): JSX.Element {
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`


  return (
    <Provider {...store}>
        <SafeAreaView style={{flex:1,backgroundColor: colorScheme === 'dark' ?'#000':'#fff'}}>
        
          <TopView style={{flex:1}}>
            <NavigationContainer //给react navigation 设置夜间模式和白天模式
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            ref={navigationRef} 
            onReady={()=>{
              console.log('onReady-----')
            }}>
              <StackNavigators/>
              {/* <Text>1234</Text> */}
            </NavigationContainer>
          </TopView>
        </SafeAreaView>
    </Provider>
  );
  // return <Text>1234</Text>
}

const styles = StyleSheet.create({
  
});

export default App;
