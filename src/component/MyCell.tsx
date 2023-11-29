/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState,useEffect, useCallback } from 'react';
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
  Theme,
  ListRow
} from './teaset/index';
import { BAN_LD,RIGHT_ARROW } from '../assets/image';
import { runInAction } from 'mobx';
import { CALLBACK_TYPE } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

const MyCell = ({ 
  avatar='',//头像
  title,
  msg,
  hasNewMsg=false,//有新消息来显示的点
  time,
  showDisNotice=false,//通知图标（免打扰模式图标）
  showBottomBorder=false,//显示底部边框
  showRightArrow=false,//是否显示右边箭头
  rightValue,
  onPress,
  MyThemed,
  isAvatarTintColor=true,
  style,
  avatarStyle={
    width: 34,
    height: 34
  },
  rightWrapperStyle = {},
  // AppStore,
  // FriendsStore,
  // curRouteName='',
  // user_id
  msgCount = 0,
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
    
    
  })

  // const notReadMsgCount = useCallback(()=>{
  //   if(['ChatListPage'].includes(curRouteName) && user_id){
  //     runInAction(()=>{
  //       const login_user_id = AppStore?.userInfo?.user_id;
  //       const chatLogs = FriendsStore.chatLogs[login_user_id]||{}
  //       const user = chatLogs[user_id]||{};
  //       const msg_contents = user.msg_contents||[];
  //       for(const item of msg_contents){
  //         item.readMsg = true;
  //       }
  //     })
  //   }
  // },[]);

  let rightWrapper = {
    ...rightWrapperStyle
  }
  // if(showBottomBorder) rightWrapper = {
  //   // ...rightWrapper,
  //   // borderBottomWidth: 0.5,
  //   // borderColor: MyThemed[colorScheme||'light'].ftCr2,
  //   // ...rightWrapperStyle
  // }
  
  return <View style={style}>
    <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={()=>{
      onPress && onPress();
    }}>
      {
        avatar && <View
        style={styles.avatarContainer}
        >
          <View style={styles.avatarWrapper}>
            <Image style={{
              ...styles.avatarImg,
              tintColor: isAvatarTintColor && (typeof avatar == 'number' && MyThemed[colorScheme||'light'].primaryColor),
              ...avatarStyle,
            }} source={typeof avatar == 'number'?avatar:{uri:avatar}}/>
            {
              hasNewMsg && <View style={{
                ...styles.msgDot,
                minWidth: msgCount?17:8,
                minHeight: msgCount?10:8,
                borderRadius: msgCount?10:4,
                padding: msgCount?3:0,
                backgroundColor: MyThemed.mgDotCr,
              }}>{msgCount ? <Text style={{color:'#fff',fontSize: 10,textAlign:'center',fontWeight:'bold'}}>{msgCount>99?'99+':msgCount}</Text>: null}</View>
            }
          </View>
        </View>
      }
      
      <View style={{
        ...styles.rightWrapper,
        ...rightWrapper,
        position: 'relative'
      }}>
        <View style={{
          ...styles.titleMsgWrapper,
          marginRight: (time || showDisNotice) && 20,
        }}>
          <Text
          numberOfLines={1}
          style={styles.titleTxt}
          >{title}</Text>
          {
            msg && <Text 
            numberOfLines={1}
            style={{
              ...styles.msgTxt,
              color: MyThemed[colorScheme||'light'].ftCr2
            }}>{msg}</Text>
          }
        </View>
        {
          (time || showDisNotice) && <View style={styles.timeLdWrapper}>
            <Text style={{
              ...styles.ldTime,
              color: MyThemed[colorScheme||'light'].ftCr2
            }}>{time}</Text>
            {
              showDisNotice && <Image style={{
                ...styles.ldImg,
                tintColor: MyThemed[colorScheme||'light'].ftCr2,
              }} source={BAN_LD}/>
            }
          </View>
        }
        {
          rightValue && (typeof rightValue == 'string' ? <Text style={{
            ...styles.rightValue,
            color: MyThemed[colorScheme||'light'].ftCr2,
          }}>{rightValue}</Text>: rightValue)
        }
        {
          showRightArrow && <Image 
          style={{
            ...styles.rightArrow,
            tintColor: MyThemed[colorScheme||'light'].ftCr2,
          }} 
          source={RIGHT_ARROW}/>
        }


        {
          showBottomBorder && <View style={{
            position: "absolute",left:0,right:0,bottom:0.5,height:0.6,backgroundColor: MyThemed[colorScheme||'light'].ftCr2,zIndex:1000,
          }}></View>
        }
      </View>
    </TouchableOpacity>
  </View>;
};

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row', 
    paddingLeft:10,
  },
  rightWrapper:{
    flexDirection: 'row', 
    flex:1,
    paddingVertical:10,
    paddingRight: 10,
    alignItems: 'center'
  },
  avatarContainer:{
    paddingVertical: 10,
    paddingRight: 10,
    justifyContent:'center'
  },
  avatarWrapper:{
    // width: 46,
    // height: 46,
    position:'relative',
    // borderWidth:1,
    // borderColor:'red'
  },
  avatarImg:{
    // height:44,
    // width:44,
    borderRadius: 5
  },
  msgDot:{
    // width: 8,
    // height: 8,
    position:'absolute',
    right:-2,
    top:-2,
    // borderRadius: 4,
  },
  titleMsgWrapper:{
    flex:1,
    justifyContent: 'center',
  },
  titleTxt: {
    fontWeight:'bold'
  },
  msgTxt: {
    marginTop:8,
    // fontSize: 6
  },
  timeLdWrapper:{
    alignItems: 'center',
  },
  ldTime:{
    fontSize: 12
  },
  ldImg:{
    width: 15,
    height: 15,
    marginTop: 10,
  },
  rightArrow:{
    width: 15,
    height: 15
  },
  rightValue:{
    paddingHorizontal:15
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(MyCell));
