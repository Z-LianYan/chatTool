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
  TouchableHighlight,
  Text,
  View as Vw
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import MyCell from '../../component/MyCell';
import { NEW_FIREND } from '../../assets/image';
import { View } from '../../component/customThemed';
import { getFriendList, searchFriends } from '../../api/friends';
import { runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const AddressBookPage = ({
  MyThemed,
  navigation,
  AppStore,
  FriendsStore,
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
    getAddressBookList()
  },[]);

  const getAddressBookList = useCallback(async()=>{
    try{
      await FriendsStore.getFriendList();
    }catch(err:any){
      console.log('err------>>',err.message)
    }
  },[])
  type itemType = {
    user_name: string,
    f_user_name_remark: string,
    avatar: string,
    user_id: number,
  }
  const login_user_id = AppStore.userInfo?.user_id;
  
  const addFriendChatLogs = FriendsStore.addFriendChatLogs[login_user_id]||{}
  const userIdSort = FriendsStore.addFriendChatLogs[login_user_id]?.userIdSort||[];
  // const lastIndex = userIdSort.length-1;
  const beforeUser = addFriendChatLogs[userIdSort[0]];
  
  let newAddFriendNotReadMsgCount = 0;
  for(const key in addFriendChatLogs) {
    if(['userIdSort'].includes(key)) continue;
    if(!addFriendChatLogs[key]?.newAddFriendReadMsg) newAddFriendNotReadMsgCount += 1;
  }
  

  return <ScrollView>
    <MyCell
    title={newAddFriendNotReadMsgCount ? beforeUser?.user_name : '新的朋友'} 
    avatar={newAddFriendNotReadMsgCount? beforeUser?.avatar : NEW_FIREND}
    msg={newAddFriendNotReadMsgCount? (beforeUser?.msg_contents?.length && beforeUser?.msg_contents[beforeUser?.msg_contents?.length-1]?.msg_content):''}
    showBottomBorder={false}
    showRightArrow={false}
    isAvatarTintColor={false}
    rightValue={ newAddFriendNotReadMsgCount? <View style={{backgroundColor: MyThemed.mgDotCr,borderRadius: 9}}>
      <Text style={{width: 18,height: 18,lineHeight:18,color: '#fff',fontSize: 10,textAlign:'center'}}>{newAddFriendNotReadMsgCount}</Text>
    </View>:null }
    onPress={()=>{
      navigation.navigate('NewFriendsList')
      runInAction(async ()=>{
        for(let key in addFriendChatLogs){
          if(['userIdSort'].includes(key)) continue;
          addFriendChatLogs[key].newAddFriendReadMsg = true;
        }
        await AsyncStorage.setItem('addFriendChatLogs',JSON.stringify(FriendsStore.addFriendChatLogs));
      });
    }}/>
    {/* <MyCell
    title='仅聊天的朋友' 
    avatar={NEW_FIREND}
    showBottomBorder={false}
    showRightArrow={false}/>*/}
    <Vw style={styles.separator}></Vw> 

    {
      FriendsStore?.friendsData?.rows?.map((item:itemType,index:number)=>{
        return <MyCell
          key={index+item.user_name}
          title={item.f_user_name_remark||item.user_name}
          avatar={item.avatar}
          showBottomBorder={index!=FriendsStore?.friendsData.rows.length-1}
          onPress={async ()=>{
            const friends:any = await searchFriends({user_id: item.user_id});
            runInAction(()=>{
              AppStore.search_user_info = friends;
            });
            navigation.navigate({
              name: 'UserDetail',
              params: {
                // userInfo: friends,
              }
            });
          }}
          />
      })
    }
    
    <Text 
    onPress={()=>{
      FriendsStore.count++
    }}
    style={{
      ...styles.bottomText,
      color: MyThemed[colorScheme||'light'].ftcr2
    }}>{FriendsStore?.friendsData?.count} 个朋友</Text>
  </ScrollView>;
};

const styles = StyleSheet.create({
  separator:{
    height: 30
  },
  bottomText:{
    textAlign: 'center',
    height: 50,
    lineHeight: 50,
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(AddressBookPage));;
