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
  TouchableHighlight
} from 'react-native';

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
import { 
  CHAT_ICON,
  CHAT_ACTIVATE_ICON, 
  ADDRESS_BOOK_ICON,
  ADDRESS_BOOK_ACTIVATE_ICON,
  FIND_ICON,
  FIND_ACTIVATE_ICON,
  MINE_ICON,
  MINE_ACTIVATE_ICON,
} from '../assets/image/index';
import { runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

// type TypeProps = {
//   index?: number
// }
const TabBar = ({
   state, descriptors, navigation,AppStore,MyThemed,FriendsStore
}:any) => {
  const colorScheme = useColorScheme();
  useEffect(()=>{
  })
  return <View style={{ 
    flexDirection: 'row',
    height:50,
    borderTopWidth:1,
    borderTopColor: MyThemed[colorScheme||'light'].tbBg,
    backgroundColor: MyThemed[colorScheme||'light'].tbBg
  }}>
   
  {state.routes.map((route:any, index:any) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    let iconName; 
    if (route.name === 'ChatListPage') {
      iconName = isFocused ? CHAT_ACTIVATE_ICON : CHAT_ICON;
    } else if (route.name === 'AddressBookPage') {
      iconName = isFocused ? ADDRESS_BOOK_ACTIVATE_ICON : ADDRESS_BOOK_ICON;
    }else if (route.name === 'FindPage') {
      iconName = isFocused ? FIND_ACTIVATE_ICON : FIND_ICON;
    }else if (route.name === 'MePage') {
      iconName = isFocused ? MINE_ACTIVATE_ICON : MINE_ICON;
    }

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate({ name: route.name, merge: true });
        AppStore.curRouteName = route.name;
        if(route.name=='AddressBookPage'){
          runInAction(async ()=>{
            AppStore.tabBar.AddressBookPage.msgCnt = 0;
            await AsyncStorage.setItem('addFriendChatLogs',JSON.stringify(FriendsStore.addFriendChatLogs));
          });
        }
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        key={route.name}
        style={{ flex: 1,alignItems:'center',justifyContent:'center' }}
      >
        <View style={{ 
          alignItems:'center',
          justifyContent:'center', 
          position:'relative',
          backgroundColor: MyThemed[colorScheme||'light'].tbBg 
        }}>
          <Image
            style={{width:20,height:20,tintColor: MyThemed[colorScheme||'light'][isFocused?'primaryColor':'ftCr']}}
            source={iconName}
          />
          <Text style={{ 
            color: MyThemed[colorScheme||'light'][isFocused?'primaryColor':'ftCr']
          }}>
            {label}
          </Text>
          {
            AppStore.tabBar[route.name].isShowDot ? <View style={{
              width: 10,
              height: 10,
              position: 'absolute',
              top:0,
              right: -5,
              backgroundColor: MyThemed.mgDotCr,
              borderRadius: 5,
            }}></View>: options.tabBarBadge>0 &&  <View style={{
              minWidth: 15,
              position: 'absolute',
              top:0,
              left: 20,
              fontSize: 10,
              backgroundColor: MyThemed.mgDotCr,
              borderRadius: 10,
              textAlign: 'center',
              paddingHorizontal: 5,
              paddingVertical: 1,
            }}>
              {/* 这里需要套一个View组件 因为直接用Text组件在ios端设置 borderRadius 不成功 */}
              <Text style={{
                fontSize: 10,
                color: MyThemed.mgDotFtCr,
                // paddingHorizontal: 3,
                // paddingVertical: 1,
              }}>{String(options.tabBarBadge).length>3?(String(options.tabBarBadge).substring(0,3)+'...'):options.tabBarBadge}</Text>
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  })}
</View>;
};

const styles = StyleSheet.create({
  // container:{
  //   flexDirection:'row',
  // },
  // tabItem:{
  //   flex:1
  // },
  // tabItemContent:{

  // }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(TabBar));
