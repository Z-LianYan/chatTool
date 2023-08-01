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
} from '../component/Themed';
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

import { get_film_hot } from '../api/film';
// type TypeProps = {
//   index?: number
// }
const TabBar = ({
   state, descriptors, navigation,AppStore,MyThemed
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
    if (route.name === 'ChatPage') {
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
        // if(route.name=='MinePage' && !AppStore.userInfo){
        //   navigation.navigate({ name: 'LoginPage', params:{
        //     toUrl:'MinePage'
        //   }});
        //   return;
        // }
        navigation.navigate({ name: route.name, merge: true });
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
            style={{width:20,height:20,tintColor: MyThemed[colorScheme||'light'][isFocused?'actColor':'ftCr']}}
            source={iconName}
          />
          <Text style={{ 
            color: MyThemed[colorScheme||'light'][isFocused?'actColor':'ftCr']
          }}>
            {label}
          </Text>
          {
            AppStore.tabBar[route.name].isShowDot ? <Text style={{
              width: 10,
              height: 10,
              position: 'absolute',
              top:0,
              right: -5,
              backgroundColor: MyThemed.mgDotCr,
              borderRadius: 5,
            }}></Text>: options.tabBarBadge>0 &&  <Text style={{
              minWidth: 15,
              position: 'absolute',
              top:0,
              left: 20,
              fontSize: 10,
              backgroundColor: MyThemed.mgDotCr,
              color: MyThemed.mgDotFtCr,
              borderRadius: 10,
              textAlign: 'center',
              paddingHorizontal: 6,
              paddingVertical: 1,
            }}>{String(options.tabBarBadge).length>3?(String(options.tabBarBadge).substring(0,3)+'...'):options.tabBarBadge}</Text>
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

export default inject("AppStore","MyThemed")(observer(TabBar));
