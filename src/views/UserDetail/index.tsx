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
  // const [remarkLabel,setRemarkLabel] = useState({
  //   f_user_name_remark: '',
  //   labels: [],
  //   des: ''
  // });
  console.log('params.userInfo========>>123',params.userInfo)

  const [search_user_info,set_search_user_info] = useState<any>({});
  useEffect(()=>{

    

    // (async function(){
    // })()

    const unsubscribe = navigation.addListener('state', async() => {
      // 处理路由变化的逻辑
      let info:any = await AsyncStorage.getItem('remarkLabel');
      info = info?JSON.parse(info):{};
      const user_info = {
        ...params.userInfo,
        f_user_name_remark:(info[params?.userInfo?.user_id] && info[params?.userInfo?.user_id]?.f_user_name_remark) ? info[params?.userInfo?.user_id]?.f_user_name_remark: params?.userInfo?.f_user_name_remark,
        labels: info[params?.userInfo?.user_id]?.labels ? (info[params?.userInfo?.user_id]?.labels||[]): (params?.userInfo?.labels||[]),
        des: info[params?.userInfo?.user_id]?.des? info[params?.userInfo?.user_id]?.des:params?.userInfo?.des
      }
      set_search_user_info({
        ...user_info
      });
    });
    return unsubscribe;
  },[params.userInfo]);

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
        {
          search_user_info?.avatar && <Image style={{
            ...styles.avatarImg,
          }} source={{uri:search_user_info?.avatar}}/>
        }
        <View style={{flex:1,paddingLeft:30}}>
          <Text style={{marginTop:5,color: MyThemed[colorScheme||'light'].ftCr,fontWeight:'bold',fontSize: 20}}>
            <Text style={{paddingRight: 10}}>{search_user_info?.f_user_name_remark||search_user_info?.user_name}</Text>
            <View style={{width:10}}></View>
            {
              <Image style={{
                ...styles.manWomanAvatar,
              }} source={search_user_info?.sex==1?MAN_AVATAR:WOMAN_AVATAR}/>
            }
          </Text>
          <View style={{flexDirection:'column'}}>
            {search_user_info?.f_user_name_remark && search_user_info?.user_name!=search_user_info?.f_user_name_remark && <Text style={{flex:1,marginTop:5}}>昵称：{search_user_info?.user_name}</Text>}
            {
              (search_user_info?.isFriends || search_user_info?.user_id===userInfo?.user_id) &&  <Text style={{flex:1,marginTop:5}}>微信号：{search_user_info?.chat_no}</Text>
            }
            
            <Text style={{flex:1,marginTop:5}}>地区：{search_user_info?.area}</Text>
            
            
          </View>
        </View>
      </View>
    </View>

    {
      (search_user_info?.user_id!=userInfo?.user_id) && <MyCell
      rightWrapperStyle={{paddingVertical: 20}}
      title='设置备注和标签' 
      showBottomBorder={search_user_info?.isFriends?true:false}
      showRightArrow={true}
      onPress={()=>{
        navigation.navigate('SetRemarkLabel',{
          search_user_info: search_user_info
        });
      }}/>
    }
    {
      search_user_info?.labels?.length ? <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='标签' 
        showBottomBorder={search_user_info?.des?true:false}
        showRightArrow={true}
        rightValue={Array.isArray(search_user_info?.labels) && search_user_info?.labels.map((item:any)=>item.label_name).join('，')}
        onPress={()=>{
          navigation.navigate('SetRemarkLabel',{
            search_user_info: search_user_info
          })
      }}/>: null
    }
    {
      search_user_info?.des && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        title='描述' 
        showBottomBorder={false}
        showRightArrow={true}
        rightValue={search_user_info?.des}
        onPress={()=>{
          navigation.navigate('SetRemarkLabel',{
            search_user_info: search_user_info
          });
      }}/>
    }
    <MyCell
    rightWrapperStyle={{paddingVertical: 20}}
    style={{marginTop:10,}}
    title='来源' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={search_user_info.searchSource}//来自手机号搜索,来自账号搜索
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>

    

    {
      search_user_info?.isFriends || search_user_info.user_id===userInfo?.user_id ?<Button
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
        navigation.navigate('SetRemarkLabel',{
          search_user_info: search_user_info,
          op_type: 'addUser'
        });
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
