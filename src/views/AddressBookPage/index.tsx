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
    avatar: string,
    user_id: number,
  }
  const login_user_id = AppStore.userInfo.user_id;
  
  const addFriendchatLogs = FriendsStore.addFriendchatLogs[login_user_id]||{}
  const userIdSort = FriendsStore.addFriendchatLogs[login_user_id]?.userIdSort||[];
  const lastIndex = userIdSort.length-1;
  const lastUser = addFriendchatLogs[userIdSort[lastIndex]]||{};
  
  let newAddFriendNotRedMsgCount = 0;
  for(const key in addFriendchatLogs) if(addFriendchatLogs[key].isNewAddFriendNotRedMsg) newAddFriendNotRedMsgCount += 1;

  return <ScrollView>
    <MyCell
    title={lastUser?.isNewAddFriendNotRedMsg? lastUser?.user_name : '新的朋友'} 
    avatar={lastUser?.isNewAddFriendNotRedMsg? lastUser?.avatar : NEW_FIREND}
    msg={lastUser?.isNewAddFriendNotRedMsg? (lastUser?.msg_contents?.length && lastUser?.msg_contents[lastUser?.msg_contents?.length-1]?.msg_content):''}
    showBottomBorder={false}
    showRightArrow={false}
    isAvatarTintColor={false}
    rightValue={lastUser?.isNewAddFriendNotRedMsg? <View style={{backgroundColor: MyThemed.mgDotCr,borderRadius: 9}}>
      <Text style={{width: 18,height: 18,lineHeight:18,color: '#fff',fontSize: 10,textAlign:'center'}}>{newAddFriendNotRedMsgCount}</Text>
    </View>:null}
    onPress={()=>{
      navigation.navigate('NewFriendsList')
      runInAction(()=>{
        // AppStore.addFirendsApply = [];
        // AppStore.tabBar.AddressBookPage.msgCnt = 0;
        for(let key in addFriendchatLogs){
          delete addFriendchatLogs[key].isNewAddFriendNotRedMsg,
          addFriendchatLogs[key].hasNewMsg = false;
        }
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
          title={item.user_name}
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
