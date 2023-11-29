import React, { useState,useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react'
import { observable, action, makeAutoObservable,runInAction } from 'mobx';

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
  Text as Tt,
  View as Vw,
  Alert,
  Dimensions,
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { View,Text } from '../../component/customThemed';

import NavigationBar from '../../component/NavigationBar';
import CustomListRow from '../../component/CustomListRow';
import MyCell from '../../component/MyCell';
import { ADD_CIR, ADD_USER, NEW_FIREND, RIGHT_UP_ARROW } from '../../assets/image';
import { Menu,Button, Label } from '../../component/teaset';
import SearchModal from '../AddFriend/SearchModal';
import { GET_NEW_FRIENDS_LIST, getFriendList, searchFriends } from '../../api/friends';
import { isIndexed } from 'immutable';
import dayjs from 'dayjs';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const NewFriendsList = ({ 
  AppStore,
  MyThemed,
  navigation,
  FriendsStore,
}:any) => {
  const search_modal_ref:{current:any} = useRef();
  
  const colorScheme = useColorScheme();
  // const [recentlyThreeDays,setRecentlyThreeDays] = useState([]);
  // const [threeDaysBefore,setThreeDaysBefore] = useState([]);

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
   
  });
  const login_user_id = AppStore.userInfo?.user_id;
  const addFriendChatLogs = FriendsStore.addFriendChatLogs[login_user_id]||{}
  useEffect(()=>{
    navigation.setOptions({
      // headerTitle: "聊天",
      headerRight: ()=>{
        return <Label text="添加朋友" style={{marginRight: 15}} size="md" onPress={()=>{
          search_modal_ref.current.open()
        }}></Label>;
      }
    });
    getAddressBookList();
    return ()=>{
      runInAction(()=>{
        for(let key in addFriendChatLogs){
          if(['userIdSort'].includes(key)) continue;
          addFriendChatLogs[key].newAddFriendReadMsg = true;
        }
        FriendsStore.addFriendChatLogs[login_user_id] = addFriendChatLogs;
        AppStore.tabBar.AddressBookPage.msgCnt =  0;
      });
    }
  },[]);

  const getAddressBookList = useCallback(async()=>{
    try{
      await FriendsStore.get_new_friends_list();
    }catch(err:any){
    }
    
  },[FriendsStore?.new_friends_list])

  const handerRightShow = useCallback((item:any)=>{
    if(![0].includes(item.status)) return <Text>已添加</Text>
    if(dayjs(item.expire).unix()<dayjs().unix() || !item.expire) return <Text>已过期</Text>
    
    if([0].includes(item.is_apply)) {
      return <Button 
        title='接受' 
        type="primary"
        onPress={async ()=>{
          const friends:any = await searchFriends({
            user_id: item.f_user_id
          });
          console.log('friends===>>',friends)
          AppStore.search_user_info = friends;
          navigation.navigate('SetRemarkLabel',{
            // search_user_info: friends,
            op_type: 'toVerify',
            user_id: friends.user_id,
          });
        }}
      ></Button>
    }else {
      return <Text>等待验证</Text>
    }

  },[]);
  return <ScrollView>

    <TouchableOpacity activeOpacity={0.6} style={styles.inputTO} onPress={()=>{
      search_modal_ref.current.open()
    }}>
      <View style={styles.inputWrapper}>
          <Text style={{
            ...styles.inputeText,
            color: MyThemed[colorScheme||'light'].ftCr2
          }}>账号/手机号</Text>
      </View>
    </TouchableOpacity>
    
    {
      FriendsStore?.new_friends_list?.recentlyThreeDays?.length?<Vw style={styles.labelWrapper}>
        <Text>近三天</Text>
      </Vw>:''
    }
    {
      FriendsStore?.new_friends_list?.recentlyThreeDays.map((item:any,index:number)=>{
        return <MyCell 
          key={'recentlyThreeDays'+index}
          time={<Text>
            {
              [1].includes(item.is_apply) && <Image style={{
                ...styles.right_up_arrow,
                tintColor: MyThemed[colorScheme||'light'].ftCr2
              }} source={RIGHT_UP_ARROW}/>
            }
            {
              handerRightShow(item)
            }
          </Text>}
          title={item.f_user_name}
          avatarStyle={{
            width: 44,
            height:44
          }}
          // showDisNotice={true}
          showRightArrow={false}
          // rightValue="12345"
          msg={addFriendChatLogs[item.f_user_id] && addFriendChatLogs[item.f_user_id].msg_contents?addFriendChatLogs[item.f_user_id].msg_contents.slice(-1)[0]?.msg_content:''}
          hasNewMsg={false}
          showBottomBorder={FriendsStore?.new_friends_list?.recentlyThreeDays.length==(index+1)?false:true}
          avatar={item.f_avatar}
          onPress={async()=>{
            const friends:any = await searchFriends({user_id: item.f_user_id});
            runInAction(()=>{
              AppStore.search_user_info = friends;
            });
            navigation.navigate({
              name: 'UserDetail',
              params: {
                // userInfo: friends,
              }
            });
          }}/>
      })
    }
    

    {
      FriendsStore?.new_friends_list?.threeDaysBefore.length?<Vw style={styles.labelWrapper}>
        <Text>三天前</Text>
      </Vw>:''
    }
    {
      FriendsStore?.new_friends_list?.threeDaysBefore.map((item:any,index:number)=>{
        return <MyCell 
          key={'threeDaysBefore'+index}
          time={<Text>
            {
              [1].includes(item.is_apply) && <Image style={{
                ...styles.right_up_arrow,
                tintColor: MyThemed[colorScheme||'light'].ftCr2
              }} source={RIGHT_UP_ARROW}/>
            }
            {
              handerRightShow(item)
            }
          </Text>}
          title={item.f_user_name}
          avatarStyle={{
            width: 44,
            height: 44
          }}
          // showDisNotice={true}
          showRightArrow={false}
          // rightValue="12345"
          msg={item.status+'-'+item.is_apply}
          hasNewMsg={false}
          showBottomBorder={FriendsStore?.new_friends_list?.threeDaysBefore.length==(index+1)?false:true}
          avatar={item.f_avatar}
          onPress={async ()=>{
            const friends:any = await searchFriends({user_id: item.f_user_id});
            runInAction(()=>{
              AppStore.search_user_info = friends;
            });
            navigation.navigate({
              name: 'UserDetail',
              params: {
                // userInfo: friends,
              }
            });
          }}/>
      })
    }

    <SearchModal navigation={navigation} ref={search_modal_ref}/>
  </ScrollView>;
};

const styles = StyleSheet.create({
  labelWrapper:{
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  inputTO:{
    paddingVertical: 20,
  },
  inputWrapper:{
    borderRadius: 10,
    marginHorizontal:20,
  },
  inputeText:{
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
  },
  right_up_arrow:{
    width: 18,
    height: 18
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(NewFriendsList));
