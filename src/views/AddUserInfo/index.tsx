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
import { FRIENDCIRCLE, QRCODE, RIGHT_ARROW, SETICON } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
import { Button } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
const AddUserInfo = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })
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
        }} source={{uri:route?.params?.avatar}}/>
        <View style={{flex:1,paddingLeft:30}}>
          <Text style={{color: MyThemed[colorScheme||'light'].ftCr,fontWeight:'bold',fontSize: 20}}>{route?.params?.isFriends?route?.params?.f_user_name_remark:route?.params?.user_name}</Text>
          <View style={{flexDirection:'column'}}>
            {route?.params?.user_name!=route?.params?.f_user_name_remark && <Text style={{flex:1,marginTop:5}}>昵称：{route?.params?.user_name}</Text>}
            <Text style={{flex:1,marginTop:5}}>微信号：{route?.params?.chat_no}</Text>
            <Text style={{flex:1,marginTop:5}}>地区：{route?.params?.area}</Text>
            
          </View>
        </View>
      </View>
    </View>

    <MyCell
    rightWrapperStyle={{paddingVertical: 20}}
    title='设置备注和标签' 
    showBottomBorder={true}
    showRightArrow={true}
    onPress={()=>{}}
    />
    {
      route?.params?.labels && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='标签' 
        showBottomBorder={true}
        showRightArrow={true}
        rightValue={route?.params?.labels?.join('，')}
        onPress={()=>{
          // navigation.navigate('Set')
      }}/>
    }
    {
      route?.params?.des && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='描述' 
        showBottomBorder={false}
        showRightArrow={true}
        rightValue={route?.params?.des}
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
    rightValue="来自手机号搜索"
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>

    

    {
      route?.params?.isFriends ?<Button
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
  rightArrow:{
    width: 15,
    height: 15
  }
});

export default inject("AppStore","MyThemed")(observer(AddUserInfo));
