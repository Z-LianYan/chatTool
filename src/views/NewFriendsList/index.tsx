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
import { ADD_CIR, ADD_USER, NEW_FIREND } from '../../assets/image';
import SocketIoClient from '../../socketIo';
import { Menu,Button } from '../../component/teaset';
import SearchModal from '../AddFriend/SearchModal';
import { GET_NEW_FRIENDS_LIST, getFriendList, searchFriends } from '../../api/friends';
import { isIndexed } from 'immutable';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const NewFriendsList = ({ 
  AppStore,
  MyThemed,
  navigation,
}:any) => {
  const search_modal_ref:{current:any} = useRef();
  const sockitIo = SocketIoClient.getInstance();
  
  const colorScheme = useColorScheme();
  const [recentlyThreeDays,setRecentlyThreeDays] = useState([]);
  const [threeDaysBefore,setThreeDaysBefore] = useState([]);

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
   
  });
  // const navigationState = navigation.getState();
  // const routeName = navigationState.routeNames[navigationState.index]
  useEffect(()=>{
    // navigation.setOptions({
    //   headerTitle: "聊天"+(AppStore.tabBar[routeName||'']?.msgCnt?`(${AppStore.tabBar[routeName||''].msgCnt})`:''),
    // });
    getAddressBookList();
  },[]);

  const getAddressBookList = useCallback(async()=>{
    try{
      const result:any = await GET_NEW_FRIENDS_LIST({});
      setRecentlyThreeDays(result.recentlyThreeDays);
      setThreeDaysBefore(result.threeDaysBefore);
    }catch(err:any){
    }
    
  },[])
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
    
    <Vw style={styles.labelWrapper}>
      <Text>近三天</Text>
    </Vw>
    {
      recentlyThreeDays.map((item:any,index)=>{
        return <MyCell 
          key={'recentlyThreeDays'+index}
          time={[0].includes(item.status)?([0].includes(item.is_apply)?<Button title='接受'></Button>:'等待验证'):'已添加'}
          title={item.f_user_name}
          avatarStyle={{
            width: 44,
            height:44
          }}
          // showDisNotice={true}
          showRightArrow={false}
          // rightValue="12345"
          msg={item.status+'-'+item.is_apply}
          hasNewMsg={false}
          showBottomBorder={recentlyThreeDays.length==(index+1)?false:true}
          avatar={item.f_avatar}
          onPress={async()=>{
            const friends:any = await searchFriends({user_id: item.f_user_id});
            navigation.navigate({
              name: 'UserDetail',
              params: {
                userInfo: friends,
              }
            });
          }}/>
      })
    }
    

    <Vw style={styles.labelWrapper}>
      <Text>三天前</Text>
    </Vw>
    {
      threeDaysBefore.map((item:any,index)=>{
        return <MyCell 
          key={'threeDaysBefore'+index}
          time={[0].includes(item.status)?([0].includes(item.is_apply)?<Button 
            title='接受' 
            type="primary"
            onPress={async ()=>{
              const friends:any = await searchFriends({user_id: item.f_user_id});
              console.log('friends===>>',friends)
              navigation.navigate('SetRemarkLabel',{
                search_user_info: friends,
                op_type: 'addUser'
              });
            }}
          ></Button>:'等待验证'):'已添加'}
          title={item.f_user_name}
          avatarStyle={{
            width: 44,
            height:44
          }}
          // showDisNotice={true}
          showRightArrow={false}
          // rightValue="12345"
          msg={item.status+'-'+item.is_apply}
          hasNewMsg={false}
          showBottomBorder={threeDaysBefore.length==(index+1)?false:true}
          avatar={item.f_avatar}
          onPress={async ()=>{
            const friends:any = await searchFriends({user_id: item.f_user_id});
            console.log('friends===>>',friends)
            navigation.navigate({
              name: 'UserDetail',
              params: {
                userInfo: friends,
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
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
  },
});

export default inject("AppStore","MyThemed")(observer(NewFriendsList));
