



import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {Text, View, Image,useColorScheme,TouchableHighlight,TouchableOpacity,SafeAreaView} from 'react-native';
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
import { runInAction } from 'mobx';
import { chatListPageMsgCount } from '../utils/tool';


function NavigationContainerCom({MyThemed,AppStore,FriendsStore,children}:any) {
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

  const login_user_id = AppStore.userInfo?.user_id;

  (async function(){
    const msgCount = await chatListPageMsgCount(FriendsStore.chatLogs[login_user_id]||{});
    runInAction(async ()=>{
      AppStore.tabBar.ChatListPage.msgCnt =  msgCount;
    });
  })()
  

  return (<SafeAreaView
    style={{
      flex:1, 
      backgroundColor: MyThemed[colorScheme||'light'].safeAreaViewBg
    }}>
      <NavigationContainer //给react navigation 设置夜间模式和白天模式
        theme={colorScheme === 'dark' ? {
          ...DarkTheme,
          colors:{
            ...DarkTheme.colors,
            background: MyThemed[colorScheme||'light'].bg,
          }
        } : {
          ...DefaultTheme,
          colors:{
            ...DefaultTheme.colors,
            background: MyThemed[colorScheme||'light'].bg,
          }
        }}
        ref={navigationRef} 
        onReady={()=>{}}>
          {children}
      </NavigationContainer>
    </SafeAreaView>
  );
}
export default inject("MyThemed","AppStore","FriendsStore")(observer(NavigationContainerCom));