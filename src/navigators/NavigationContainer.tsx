



import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {Text, View, Image,useColorScheme,TouchableHighlight,TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { 
  Button,
  Carousel,
  NavigationBar,
  Theme
} from '../component/teaset/index';
import StackNavigators from './StackNavigators';


import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigationContainerRef 
} from '@react-navigation/native';


function NavigationContainerCom(props:any) {//AppStore
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

  return (
    <NavigationContainer //给react navigation 设置夜间模式和白天模式
      theme={colorScheme === 'dark' ? {
        ...DarkTheme,
        colors:{
          ...DarkTheme.colors,
          background: props.MyThemed[colorScheme||'light'].bg,
        }
      } : {
        ...DefaultTheme,
        colors:{
          ...DefaultTheme.colors,
          background: props.MyThemed[colorScheme||'light'].bg,
        }
      }}
      ref={navigationRef} 
      onReady={()=>{}}>
        {props.children}
    </NavigationContainer>
  );
}
export default inject("AppStore","MyThemed")(observer(NavigationContainerCom));