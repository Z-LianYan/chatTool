import React, { useState,useEffect, useCallback, useRef } from 'react';
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
  View as Vw
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
import { Button, Label } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchFriends } from '../../api/friends';
import dayjs from 'dayjs';
import { runInAction } from 'mobx';
import ReplyMsg from './ReplyMsg';
import SocketIoClient from '../../socketIo';
const UserDetail = ({ 
  MyThemed,
  AppStore,
  navigation,
  route,
  FriendsStore,
}:any) => {
  // console.log('AppStore.search_user_info=======>>',AppStore.search_user_info);
  const { params } = route;
  const sockitIo = SocketIoClient.getInstance()
  
  
    
  const colorScheme = useColorScheme();
  const { userInfo } = AppStore;
  const replyMsgRef:{current:any} = useRef();

  const [search_user_info,set_search_user_info] = useState<any>({});
  
  useEffect(()=>{
    // const unsubscribe = navigation.addListener('state', async() => {
    //   // 处理路由变化的逻辑
    //   handerSearchUserInfo();
    // });
    // return unsubscribe;
    handerSearchUserInfo();
  },[AppStore?.search_user_info,params.user_id]);
  const handerSearchUserInfo = useCallback(async ()=>{
    let info:any = await AsyncStorage.getItem('remarkLabel');
    info = info?JSON.parse(info):{};

    if(params.user_id && !AppStore.search_user_info){
      const friends = await searchFriends({user_id: params.user_id});
      runInAction(()=>{
        AppStore.search_user_info = friends;
      });
    }
    let user_info = {
      ...AppStore.search_user_info,
      f_user_name_remark: info[AppStore?.search_user_info?.user_id]?.f_user_name_remark ? info[AppStore?.search_user_info?.user_id]?.f_user_name_remark: AppStore?.search_user_info?.f_user_name_remark,
      labels: info[AppStore?.search_user_info?.user_id]?.labels ? (info[AppStore?.search_user_info?.user_id]?.labels||[]): (AppStore?.search_user_info?.labels||[]),
      des: info[AppStore?.search_user_info?.user_id]?.des? info[AppStore?.search_user_info?.user_id]?.des:AppStore?.search_user_info?.des
    }
    set_search_user_info({
      ...user_info
    });
  },[AppStore?.search_user_info,params.user_id]);


  const login_user_id = AppStore.userInfo.user_id;
  const addFriendchatLogs = FriendsStore.addFriendchatLogs[login_user_id]||{};
  const chatLogs = addFriendchatLogs[search_user_info.user_id]?.msg_contents||[];

  const footerShowBtn = useCallback(()=>{
    // !search_user_info.expire || (dayjs(search_user_info.expire).unix() < dayjs().unix()) && 
    if(search_user_info.f_status==0 && [1].includes(search_user_info.f_is_apply)) return <Button
      title={'添加到通讯录'}
      type="default"
      disabled={false}
      titleStyle={{color: search_user_info.f_is_apply?MyThemed[colorScheme||'light'].ftCr3:MyThemed[colorScheme||'light'].ftCr3}}
      style={{marginTop:10,height: 55,borderWidth:0,backgroundColor: MyThemed[colorScheme||'light'].ctBg}}
      onPress={() => {
        navigation.navigate('SetRemarkLabel',{
          search_user_info: search_user_info,
          op_type: 'addUser'
        });
      }}
    />
    if(search_user_info.f_status===0) return <Button
      title={'前往验证'}
      type="default"
      disabled={search_user_info.f_is_apply?true:false}
      titleStyle={{color: search_user_info.f_is_apply?MyThemed[colorScheme||'light'].ftCr2:MyThemed[colorScheme||'light'].ftCr3}}
      style={{marginTop:10,height: 55,borderWidth:0,backgroundColor: MyThemed[colorScheme||'light'].ctBg}}
      onPress={() => {
        navigation.navigate('SetRemarkLabel',{
          // search_user_info: search_user_info,
          op_type: 'toVerify',
          user_id: search_user_info.user_id,
        });
      }}
    />
    if([1].includes(search_user_info?.f_status) || search_user_info.user_id===userInfo?.user_id){
      return <Button
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
          
          // let index = FriendsStore.chatLogs.findIndex((item:any)=>item.from_user_id===search_user_info.user_id);
          // const params = {
          //   title: search_user_info.user_name
          // }
          // if(index!=-1) params['index'] = index;
          navigation.navigate('ChatPage',{
            user_id: search_user_info.user_id,
            user_name: search_user_info.user_name
          });
        }}
      />
    }else{
      return <Button
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

  },[search_user_info]);

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
              ([1].includes(search_user_info?.f_status) || search_user_info?.user_id===userInfo?.user_id) &&  <Text style={{flex:1,marginTop:5}}>微信号：{search_user_info?.chat_no}</Text>
            }
            
            <Text style={{flex:1,marginTop:5}}>地区：{search_user_info?.area}</Text>
            
            
          </View>
        </View>
      </View>
    </View>

    {
      [0].includes(search_user_info?.f_status) &&<View style={{
        ...styles.applyMsgWrapper,
      }}>

        <Vw style={{
          ...styles.applyMsgContentWrapper,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          // borderColor: MyThemed[colorScheme||'light'].ftcr2
        }}>
          {
            chatLogs.length? chatLogs.map((item:any,index:number)=>{
              return <Text style={styles.msgContent} key={'msg'+index}>{item?.from_user_id==AppStore.userInfo.user_id?'我':item?.from_user_name}: {item?.msg_content}</Text>
            }):null
          }
          <TouchableOpacity 
            activeOpacity={0.5}
            style={styles.replyBtnWrapper}
            onPress={()=>{
              
              replyMsgRef?.current.open((msg:any)=>{
                runInAction(()=>{
                  if(search_user_info?.msgs?.length){
                    search_user_info?.msgs.splice(0,1)
                  }else{
                    search_user_info.msgs = []
                  }
                  set_search_user_info({
                    ...search_user_info,
                    msgs: [
                      ...search_user_info?.msgs,
                      msg,
                    ]
                  });
                  
                  if(AppStore?.search_user_info?.msgs?.length){
                    // params.userInfo.msgs.splice(0,1)
                  }else{
                    AppStore.search_user_info.msgs = [];
                  }
                  AppStore.search_user_info.msgs = [...AppStore?.search_user_info?.msgs,msg];
                });
              })
              
            }}
            >
              <Label
              style={{
                ...styles.replyBtn,
                color: MyThemed[colorScheme||'light'].ftCr3
              }}
              >回 复</Label>
            </TouchableOpacity>
        </Vw>
      </View>
    }
    {
      (search_user_info?.user_id!=userInfo?.user_id) && <MyCell
      rightWrapperStyle={{paddingVertical: 20}}
      title='设置备注和标签' 
      showBottomBorder={(search_user_info?.labels && search_user_info?.labels.length)||search_user_info?.des}
      showRightArrow={true}
      onPress={()=>{
        navigation.navigate('SetRemarkLabel',{
          search_user_info: search_user_info,
          op_type: 'editUser'
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
            search_user_info: search_user_info,
            op_type: 'editUser'
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
            search_user_info: search_user_info,
            op_type: 'editUser'
          });
      }}/>
    }
    <MyCell
    rightWrapperStyle={{paddingVertical: 20}}
    style={{marginTop:10,}}
    title='来源' 
    showBottomBorder={false}
    showRightArrow={false}
    rightValue={search_user_info.sourceName}//来自手机号搜索,来自账号搜索
    onPress={()=>{
      // navigation.navigate('Set')
    }}/>

    

    {
      footerShowBtn()
    }

    
    <ReplyMsg ref={replyMsgRef} AppStorez={AppStore} to_user_id={search_user_info.user_id}/>

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
  },
  applyMsgWrapper:{
    // margin: 10,
    padding: 10,
    // borderRadius: 10,
    
  },
  applyMsgContentWrapper:{
    padding: 10,
    borderRadius: 10,
    // borderWidth: 0.5,
  },
  msgRow:{
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  msgUserName:{

  },
  msgContent:{
    flexDirection: "row",
    // marginLeft: 10,
    flexWrap: 'wrap',
    padding: 0,
  },
  replyBtnWrapper:{
    width: 35,
    height: 25,
    alignItems:'center',
    justifyContent:'center',
    // backgroundColor:'red',

  },
  replyBtn:{
    // marginTop: 10,
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(UserDetail));
