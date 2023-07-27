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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  FIlM_ICON,
  FIlM_ACTIVE_ICON, 
  CINEMA_ICON,
  CINEMA_ACTIVE_ICON,
  MINE_ICON,
  MINE_ACTIVE_ICON,
} from '../assets/image/index';

import { get_film_hot } from '../api/film';
// type TypeProps = {
//   index?: number
// }
const TabBar = ({
   state, descriptors, navigation,AppStore
}:any) => {
  const colorScheme = useColorScheme();
  useEffect(()=>{
  })

  return <View style={{ 
    flexDirection: 'row',
    height:50,
    borderTopWidth:1,
    borderTopColor:colorScheme=='dark'?'#1a1b1c':Theme.primaryColor,
    backgroundColor:colorScheme=='dark'?'#000':Theme.primaryColor
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
    if (route.name === 'HomePage') {
      iconName = isFocused
        ? FIlM_ACTIVE_ICON
        : FIlM_ICON;
    } else if (route.name === 'CinemaPage') {
      iconName = isFocused ? CINEMA_ACTIVE_ICON : CINEMA_ICON;
    }else if (route.name === 'MinePage') {
      iconName = isFocused ? MINE_ACTIVE_ICON : MINE_ICON;
    }

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {

        console.log('userinfo ----===>',AppStore.userInfo);

        if(route.name=='MinePage' && !AppStore.userInfo){
          navigation.navigate({ name: 'LoginPage', params:{
            toUrl:'MinePage'
          }});
          return;
        }
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
        <Image
          style={{width:20,height:20,tintColor:isFocused? (colorScheme=='dark'?Theme.primaryColor:'#fff'):(colorScheme=='dark'?'#fff':'#000')}}
          source={iconName}
        />
        <Text style={{ 
          color: isFocused? (colorScheme=='dark'?Theme.primaryColor:'#fff'):(colorScheme=='dark'?'#fff':'#000') 
        }}>
          {label}
        </Text>
        
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

export default inject("AppStore")(observer(TabBar));
