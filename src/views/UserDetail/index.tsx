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
  TouchableHighlight,
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
// import { View } from '../../component/customThemed';
import { FRIENDCIRCLE, MAN_AVATAR, QRCODE, RIGHT_ARROW, SETICON, WOMAN_AVATAR } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
import { Button } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UserDetail = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { userInfo } = AppStore;

  useEffect(()=>{
    const unsubscribe = navigation.addListener('state', async() => {
      // 处理路由变化的逻辑
      const info = await AsyncStorage.getItem('remarkLabel');
      console.log('处理路由变化的逻辑',info)
    });
    return unsubscribe;
  },[]);
  return <ScrollView style={styles.container}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].ctBg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={''}/>
    <View style={{
      ...styles.headContainer,
      paddingTop: 30,
      paddingBottom: 30,
    }}>
      <View style={{flexDirection:'row',alignItems:'flex-start'}}>
        <Image style={{
          ...styles.avatarImg,
        }} source={{uri:params?.avatar}}/>
        <View style={{flex:1,paddingLeft:30}}>
          <Text style={{marginTop:5,color: MyThemed[colorScheme||'light'].ftCr,fontWeight:'bold',fontSize: 20}}>
            <Text style={{paddingRight: 10}}>{params?.isFriends?params?.f_user_name_remark:params?.user_name}</Text>
            <View style={{width:10}}></View>
            {
              <Image style={{
                ...styles.manWomanAvatar,
              }} source={params?.sex==1?MAN_AVATAR:WOMAN_AVATAR}/>
            }
          </Text>
          <View style={{flexDirection:'column'}}>
            {params?.isFriends && params?.user_name!=params?.f_user_name_remark && <Text style={{flex:1,marginTop:5}}>昵称：{params?.user_name}</Text>}
            {
              (params?.isFriends || params.user_id===userInfo.user_id) &&  <Text style={{flex:1,marginTop:5}}>微信号：{params?.chat_no}</Text>
            }
            
            <Text style={{flex:1,marginTop:5}}>地区：{params?.area}</Text>
            
            
          </View>
        </View>
      </View>
    </View>

    <MyCell
    rightWrapperStyle={{paddingVertical: 20}}
    title='设置备注和标签' 
    showBottomBorder={params?.isFriends?true:false}
    showRightArrow={true}
    onPress={()=>{
      navigation.navigate('SetRemarkLabel')
    }}/>
    {
      params?.labels && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='标签' 
        showBottomBorder={true}
        showRightArrow={true}
        rightValue={params?.labels?.join('，')}
        onPress={()=>{
          // navigation.navigate('Set')
      }}/>
    }
    {
      params?.des && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='描述' 
        showBottomBorder={false}
        showRightArrow={true}
        rightValue={params?.des}
        onPress={()=>{
          // navigation.navigate('Set')
      }}/>
    }
    <MyCell
    rightWrapperStyle={{paddingVertical: 20}}
    style={{marginTop:10,}}
    title='来源' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue="来自手机号搜索"//来自账号搜索
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>

    

    {
      params?.isFriends || params.user_id===userInfo?.user_id ?<Button
        title={'发送消息'}
        type="default"
        disabled={false}
        titleStyle={{color: MyThemed[colorScheme||'light'].ftCr3}}
        style={{
          marginTop:10,
          height: 55,
          borderWidth:0,
          backgroundColor: MyThemed[colorScheme||'light'].ctBg,
        }}
        onPress={() => {
        }}
      />:<Button
      title={'添加到通讯录'}
      type="default"
      disabled={false}
      titleStyle={{color: MyThemed[colorScheme||'light'].ftCr3}}
      style={{marginTop:10,height: 55,borderWidth:0,backgroundColor: MyThemed[colorScheme||'light'].ctBg}}
      onPress={() => {
      }}
    />
    }

  </ScrollView>
  
  ;
};

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  headContainer:{
    paddingHorizontal:10,
    paddingBottom: 10,
  },
  avatarImg:{
    height: 60,
    width: 60,
    borderRadius: 10,
  },
  manWomanAvatar:{
    width: 16,
    height: 16,
  },
  rightArrow:{
    width: 15,
    height: 15
  }
});

export default inject("AppStore","MyThemed")(observer(UserDetail));
