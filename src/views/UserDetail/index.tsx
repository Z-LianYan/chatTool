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
import { searchFriends } from '../../api/friends';
const UserDetail = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { userInfo } = AppStore;
  const [remarkLabel,setRemarkLabel] = useState({
    f_user_name_remark: '',
    labels: [],
    des: ''
  });

  const [user_info,set_user_info] = useState<any>({});
  useEffect(()=>{
    const unsubscribe = navigation.addListener('state', async() => {
      // 处理路由变化的逻辑
      // const info:any = await AsyncStorage.getItem('remarkLabel');
      // const _info = JSON.parse(info);
      // console.log('处理路由变化的逻辑');
      // if(_info){
      //   setRemarkLabel({
      //     f_user_name_remark: _info?.f_user_name_remark,
      //     labels: _info?.labels?_info?.labels:[],
      //     des: _info.des
      //   });
      // }

      const info:any = await searchFriends({keywords:params.keywords});
      set_user_info({
        ...info
      });
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
        }} source={{uri:user_info?.avatar}}/>
        <View style={{flex:1,paddingLeft:30}}>
          <Text style={{marginTop:5,color: MyThemed[colorScheme||'light'].ftCr,fontWeight:'bold',fontSize: 20}}>
            <Text style={{paddingRight: 10}}>{user_info?.f_user_name_remar||user_info?.user_name}</Text>
            <View style={{width:10}}></View>
            {
              <Image style={{
                ...styles.manWomanAvatar,
              }} source={user_info?.sex==1?MAN_AVATAR:WOMAN_AVATAR}/>
            }
          </Text>
          <View style={{flexDirection:'column'}}>
            {user_info?.isFriends && user_info?.user_name!=user_info?.f_user_name_remark && <Text style={{flex:1,marginTop:5}}>昵称：{user_info?.user_name}</Text>}
            {
              (user_info?.isFriends || user_info?.user_id===userInfo?.user_id) &&  <Text style={{flex:1,marginTop:5}}>微信号：{user_info?.chat_no}</Text>
            }
            
            <Text style={{flex:1,marginTop:5}}>地区：{user_info?.area}</Text>
            
            
          </View>
        </View>
      </View>
    </View>

    {
      (!user_info?.isFriends && user_info.user_id!=userInfo.user_id) && <MyCell
      rightWrapperStyle={{paddingVertical: 20}}
      title='设置备注和标签' 
      showBottomBorder={user_info?.isFriends?true:false}
      showRightArrow={true}
      onPress={()=>{
        navigation.navigate('SetRemarkLabel')
      }}/>
    }
    {
      user_info?.labels?.length ? <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='标签' 
        showBottomBorder={true}
        showRightArrow={true}
        rightValue={Array.isArray(user_info?.labels) && user_info?.labels.map((item:any)=>item.label_name).join('，')}
        onPress={()=>{
          navigation.navigate('SetRemarkLabel')
      }}/>: null
    }
    {
      user_info?.des && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='描述' 
        showBottomBorder={false}
        showRightArrow={true}
        rightValue={user_info?.des}
        onPress={()=>{
          navigation.navigate('SetRemarkLabel')
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
      user_info?.isFriends || user_info.user_id===userInfo?.user_id ?<Button
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
