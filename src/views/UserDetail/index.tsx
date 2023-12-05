import React, { useState,useEffect, useCallback, useRef } from 'react';
import { useNavigation,StackActions } from '@react-navigation/core';
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
  View as Vw,
  Alert
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
import { Button, Label, Toast } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchFriends } from '../../api/friends';
import dayjs from 'dayjs';
import { runInAction } from 'mobx';
import ReplyMsg from './ReplyMsg';
import SocketIoClient from '../../socketIo';
import { handlerChatLog } from '../../utils/tool';
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


  const login_user_id = AppStore.userInfo?.user_id;
  const addFriendChatLogs = FriendsStore.addFriendChatLogs[login_user_id]||{};
  const add_msg_contents = addFriendChatLogs[search_user_info.user_id]?.msg_contents||[];

  const footerShowBtn = useCallback(()=>{
    console.log('search_user_info=====>>>>999',search_user_info)
    // !search_user_info.expire || (dayjs(search_user_info.expire).unix() < dayjs().unix()) && 
    if((search_user_info.f_status===0 && [1].includes(search_user_info.f_is_apply))) return <Button
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
      return <Vw>
        <Button
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
            navigation.navigate('ChatPage',{
              user_id: search_user_info.user_id,
              user_name: search_user_info?.f_user_name_remark||search_user_info?.user_name,
              avatar: search_user_info.avatar
            });
          }}
        />
        <Button
          title={'删除'}
          type="danger"
          disabled={false}
          titleStyle={{
            // color: MyThemed[colorScheme||'light'].ftCr3
          }}
          style={{
            marginTop:10,
            height: 55,
            borderWidth:0,
            backgroundColor: MyThemed[colorScheme||'light'].ctBg,
          }}
          onPress={() => {
            Alert.alert(
              "删除联系人",
              `将联系人 ”${search_user_info?.f_user_name_remark||search_user_info?.user_name}“ 删除，将同时删除与该联系人的聊天记录`,
              [
                { 
                  text: "取消", 
                  onPress: async () => {},
                  style: "cancel"
                },
                { 
                  text: "删除", 
                  onPress: async () => {
                    runInAction(async ()=>{
                      try{
                        const res = await FriendsStore.del_friends({
                          f_user_id: search_user_info.user_id,
                        });

                        delete addFriendChatLogs[search_user_info.user_id];
                        const addUserIdSort = addFriendChatLogs?.userIdSort||[];
                        const addIdx = addUserIdSort.indexOf(search_user_info.user_id);
                        runInAction(()=>{
                          addUserIdSort.splice(addIdx,1);
                        })
                        

                        const chatLogs = FriendsStore.chatLogs[login_user_id] || {}
                        delete chatLogs[search_user_info.user_id];
                        const userIdSort = chatLogs?.userIdSort||[];
                        const idx = userIdSort.indexOf(search_user_info.user_id);
                        runInAction(()=>{
                          userIdSort.splice(idx,1);
                        })
                        

                        await FriendsStore.getFriendList();
                        await FriendsStore.get_new_friends_list();
                        
                        navigation.dispatch(StackActions.popToTop());//清除内部导航堆栈
                        navigation.navigate('ChatListPage');
                      }catch(err:any){
                        console.log('err----->>>',err.message)
                      }
                    })
                  },
                  style: "destructive"
                }
              ]
            );
          }}
        />
      </Vw>
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

  const showReplyBtn = useCallback(()=>{
    let hasReply = false;
    for(const item of add_msg_contents) {
      if(item.from_user_id==search_user_info.user_id) hasReply =  true;
    }
    if(hasReply && [1].includes(search_user_info.f_is_apply)) return true;
    if([0].includes(search_user_info.f_is_apply) && add_msg_contents.length) return true;
    return false
  },[add_msg_contents])

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
              ([1].includes(search_user_info?.f_status) || search_user_info?.user_id===userInfo?.user_id) &&  <Text style={{flex:1,marginTop:5}}>聊天号：{search_user_info?.chat_no}</Text>
            }
            
            <Text style={{flex:1,marginTop:5}}>地区：{search_user_info?.area}</Text>
            
            
          </View>
        </View>
      </View>
    </View>

    {
      ([0].includes(search_user_info?.f_status) && add_msg_contents.length) ? <View style={{
        ...styles.applyMsgWrapper,
      }}>

        <Vw style={{
          ...styles.applyMsgContentWrapper,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          // borderColor: MyThemed[colorScheme||'light'].ftcr2
        }}>
          {
            add_msg_contents.length? add_msg_contents.slice(-3).map((item:any,index:number)=>{
              return <Text style={styles.msgContent} key={'msg'+index}>{item?.from_user_id==AppStore.userInfo?.user_id?'我':item?.from_user_name}: {item?.msg_content}</Text>
            }):null
          }
          {
            showReplyBtn() && <TouchableOpacity 
            activeOpacity={0.5}
            style={styles.replyBtnWrapper}
            onPress={()=>{
              
              replyMsgRef?.current.open(async (response:any)=>{
                if(['success'].includes(response.status)){
                  runInAction(async ()=>{
                    await handlerChatLog({
                      chatLogs: FriendsStore.addFriendChatLogs,
                      login_user_id: login_user_id,
                      data:response.data,
                    });
                  })
                }else{
                  // Toast.fail(response.msg);

                  const friends:any = await searchFriends({
                    user_id: search_user_info.user_id
                  });
                  runInAction(async ()=>{
                    AppStore.search_user_info = friends;
                  });
                }
                
                
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
          }
        </Vw>
      </View>:null
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
    {
      search_user_info?.sourceName && <MyCell
        rightWrapperStyle={{paddingVertical: 20}}
        style={{marginTop:10,}}
        title='来源' 
        showBottomBorder={false}
        showRightArrow={false}
        rightValue={search_user_info.sourceName}//来自手机号搜索,来自账号搜索
        onPress={()=>{
          // navigation.navigate('Set')
      }}/>
    }

    

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
