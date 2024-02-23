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
  Alert,
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
import { Button, Input } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runInAction } from 'mobx';
import { ACCEPT_ADD_FRIENDS, ADD_FRIENDS_APPLY, editFriends, searchFriends } from '../../api/friends';
import { StackActions } from '@react-navigation/core';
import dayjs from 'dayjs';
import { handlerChatLog, uniqueMsgId } from '../../utils/tool';
const _ = require('lodash')

const SetRemarkLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
  route,
  FriendsStore
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { op_type } = params;
  const { search_user_info } = AppStore;
  const search_user_id = search_user_info?.user_id;
  const { userInfo } = AppStore;
  let [formData,setFormData] = useState<any>({});
  let [initPage,setInitPage] = useState<boolean>(true);
  // const [isAlready,setIsAlready] = useState(false)
  // {
  //   f_user_name_remark: '',
  //   labels: [{label_id:'',label_name:''}],
  //   des: '描述'
  // }
  useEffect(()=>{
    (async function(){
      let info:any = await AsyncStorage.getItem('remarkLabel');
      info = info? JSON.parse(info) : {};
      // formData = {
      //   f_user_name_remark: search_user_info?.f_user_name_remark||(info && info[search_user_id]?.f_user_name_remark),
      //   labels: search_user_info?.labels||((info && info[search_user_id]?.labels)?info[search_user_id]?.labels:[]),
      //   des: search_user_info?.des || (info && info[search_user_id]?.des),
      // };
      if(initPage) {
        formData = {
          f_user_name_remark: (info && info[search_user_id]?.f_user_name_remark)||search_user_info?.f_user_name_remark||search_user_info?.user_name,
          labels: ((info && info[search_user_id]?.labels)?info[search_user_id]?.labels:[])||search_user_info?.labels,
          des:  (info && info[search_user_id]?.des)||search_user_info?.des,
        }
        if(['addUser'].includes(op_type)){
          formData.msg = `我是${AppStore?.userInfo?.user_name}`
        }
        setInitPage(false);
      }else{
        formData = {
          ...formData,
          labels: search_user_info?.labels||((info && info[search_user_id]?.labels)?info[search_user_id]?.labels:[]),
        }
      }
      setFormData({
        ...formData
      });

    })()
  },[AppStore.search_user_info]);

  // const navigationBeforeRemove = useCallback(()=>{
  //   navigation.addListener('beforeRemove', (e:any) => {
  //     if (search_user_info.f_user_name_remark===formData?.f_user_name_remark && search_user_info.des===formData?.des) {
  //       // If we don't have unsaved changes, then we don't need to do anything
  //       return;
  //     }
  //     // setIsAlready(true);
  
  //     // Prevent default behavior of leaving the screen
  //     e.preventDefault();
  
  //     // Prompt the user before leaving the screen
  //     Alert.alert(
  //       '保存本次编辑？',
  //       '',
  //       [
  //         { text: "不保存", style: 'cancel', onPress: () => navigation.dispatch(e.data.action) },
  //         {
  //           text: '保存',
  //           style: 'destructive',
  //           // If the user confirmed, then we dispatch the action we blocked earlier
  //           // This will continue the action that had triggered the removal of the screen
  //           onPress: () => {

  //           },
  //         },
  //       ]
  //     );
  //   })
  // },[formData])

  const addFriendApply = useCallback(async ()=>{
    const login_user_id = AppStore.userInfo?.user_id;
    try{
      const msg_unique_id = uniqueMsgId(AppStore.userInfo?.user_id);
      const msg_type = 'text';
      const res:any = await ADD_FRIENDS_APPLY({
        ...formData,
        label_ids: (formData.labels && formData.labels.length)?formData.labels.map((it:any)=>it.label_id).join(','):null,
        f_user_id: search_user_info.user_id,
        source: search_user_info.source,
        msg_unique_id: msg_unique_id,
        msg_type: msg_type
      });
      console.log('res=======>>>申请-',res);
      runInAction(async ()=>{
        await handlerChatLog({
          chatLogs: FriendsStore.addFriendChatLogs,
          login_user_id: login_user_id,
          data: res.data,
          type: 'addFriendsApply'
        });

        runInAction(()=>{
          FriendsStore.addFriendChatLogs[login_user_id][search_user_info?.user_id].newAddFriendReadMsg = true;
        });


        if(['alreadyFriend','notAddFriendVerify'].includes(res?.status)) {
          await handlerChatLog({
            chatLogs: FriendsStore.chatLogs,
            login_user_id: login_user_id,
            data: res.data,
            type: res?.status,
          });
          if(['notAddFriendVerify'].includes(res?.status)){
            await handlerChatLog({
              chatLogs: FriendsStore.chatLogs,
              login_user_id: login_user_id,
              data: {
                avatar: search_user_info?.avatar,
                f_user_name_remark: formData.f_user_name_remark,
                msg_content: {
                    created_at: new Date(),
                    from_avatar: search_user_info?.avatar,
                    from_user_id: search_user_info?.user_id,
                    from_user_name: search_user_info?.user_name,
                    msg_content: "我通过了你的朋友验证请求，现在我们可以开始聊天了",
                    msg_type: "text",
                    msg_unique_id: uniqueMsgId(search_user_info.user_id),
                    to_user_id: res?.data?.user_id
                },
                user_id: search_user_info?.user_id,
                user_name: search_user_info?.user_name
              },
            });
          }
          await FriendsStore.getFriendList();
          await FriendsStore.get_new_friends_list();
          navigation.navigate({
            name: 'ChatListPage',
            params: {
              // userInfo: friends,
              // user_id: search_user_info.user_id
            }
          });
        }
      });

      //清除缓存
      let infoObj:any = await AsyncStorage.getItem('remarkLabel');
      
      infoObj = infoObj? JSON.parse(infoObj) : {};
      if(infoObj[search_user_id]){
        delete infoObj[search_user_id];
        await AsyncStorage.setItem('remarkLabel',JSON.stringify(infoObj));
      }
      
      // navigation.dispatch(navigation.pop(2));//清除内部导航堆栈

      const friends:any = await searchFriends({user_id: search_user_info.user_id});
      
      runInAction(()=>{
        AppStore.search_user_info = friends;
        if(!['alreadyFriend','notAddFriendVerify'].includes(res?.status)) navigation.goBack()
      });
    }catch(err:any){
      console.log('err======>>>',err.message);
    };
  },[formData])

  const expireHander = useCallback(()=>{
    Alert.alert(
      "提示",
      "朋友请求已过期，请主动添加对方",
      [
        {
          text: "取消",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "添加", onPress: async () => {

          navigation.pop();
          navigation.navigate({
            name: 'SetRemarkLabel',
            params:{
              // search_user_info,
              op_type: 'addUser'
            }
          })
        } }
      ]
    );
  },[]);

  const getAddressBookList = useCallback(async()=>{
    try{
      await FriendsStore.getFriendList();
    }catch(err:any){
      console.log('err------>>',err.message)
    }
  },[])
  

  return <ScrollView style={{
    ...styles.container,
    backgroundColor: MyThemed[colorScheme||'light'].ctBg
  }}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].ctBg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={['addUser'].includes(op_type) ? '申请添加朋友': ''}
    rightView={['editUser'].includes(op_type) && <View  style={{paddingRight:10}}>
      <Button title="保存" type="primary" onPress={async ()=>{
        let infoObj:any = await AsyncStorage.getItem('remarkLabel');
        infoObj = infoObj?JSON.parse(infoObj):{};
        if([1].includes(search_user_info?.f_status)){//f_status  是friends 表的status 1:已添加为好友
          await editFriends({
            ...formData,
            label_ids: formData?.labels?.map((item:any)=>item.label_id),
            friends_id: search_user_info?.friends_id
          });
          if(infoObj[search_user_id]){
            delete infoObj[search_user_id];
            await AsyncStorage.setItem('remarkLabel',JSON.stringify(infoObj));
          }
        }else{
          infoObj[search_user_id] = formData;
          await AsyncStorage.setItem('remarkLabel',JSON.stringify(infoObj));
        }

        runInAction(()=>{
          AppStore.search_user_info = {
            ...search_user_info,
            ...formData
          };
        });
        getAddressBookList();
        // navigation.navigate({
        //   name: 'UserDetail',
        //   params:{
        //     // userInfo: {
        //     //   ...search_user_info,
        //     //   ...formData
        //     // },
        //   },
        //   merge: true,
        // })
        navigation.goBack()
      }}>保存</Button>
    </View>}/>
    <View style={styles.contenWrapper}>
      {['editUser'].includes(op_type) && <Text style={styles.titleTxt}>设置备注和标签</Text>}
      {
        ['addUser'].includes(op_type) && <View style={styles.forWwrapper}>
          <Text style={styles.labelTxt}>发送添加朋友申请</Text>
          <Input 
          multiline={true}
          numberOfLines={5}
          value={formData?.msg}
          placeholder="请输入内容"
          style={{
            ...styles.valueTxt,
            height: 100,
            textAlignVertical: 'top',
            backgroundColor: MyThemed[colorScheme||'light'].bg,
            color: MyThemed[colorScheme||'light'].ftCr
          }}
          maxLength={16}
          type='default' 
          onChangeText={(val:string)=>{
            setFormData({
              ...formData,
              msg:val
            });
          }}
          onSubmitEditing={()=>{

          }}></Input>
        </View>
      }

      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>备注</Text>
        <Input 
        value={formData?.f_user_name_remark}
        placeholder="备注名"
        style={{
          ...styles.valueTxt,
          height: 50,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          color: MyThemed[colorScheme||'light'].ftCr
        }}
        maxLength={16}
        type='default' 
        onChangeText={(val:string)=>{
          formData =  {
            ...formData,
            f_user_name_remark:val
          }
          setFormData({
            ...formData,
          });
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>标签</Text>
        <TouchableOpacity 
        style={{
          ...styles.valueTxt,
          height: 50,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          alignItems:'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 12
        }}
        onPress={()=>{
          navigation.navigate('SetLabel',{
            // search_user_info:{
            //   ...search_user_info,
            //   ...formData
            // }
          })
        }}>
          <Text 
          style={{
            // paddingLeft: 12
          }}>{formData?.labels?.length?formData?.labels?.map((item:any)=>item.label_name).join('，'):"添加标签"}</Text>
          <Image style={styles.rightArrow} source={RIGHT_ARROW}/>
        </TouchableOpacity>
      </View>
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>描述</Text>
        <Input 
        multiline={true}
        maxLength={255}
        value={formData?.des}
        placeholder="添加文字"
        style={{
          ...styles.valueTxt,
          height: 50,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          color: MyThemed[colorScheme||'light'].ftCr,
          textAlignVertical: "top"
        }}
        type='default' 
        onChangeText={(val:string)=>{
          formData = {
            ...formData,
            des: val,
          }
          setFormData({
            ...formData
          });
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>

      

      {
       ['addUser'].includes(op_type) && <Button
          title={'发送'}
          type="default"
          disabled={false}
          activeOpacity={0.6}
          titleStyle={{color: '#fff'}}
          style={{
            marginTop:10,
            marginHorizontal: 30,
            height: 50,
            borderWidth:0, 
            backgroundColor: MyThemed[colorScheme||'light'].primaryColor,
          }}
          onPress={async () => {
            addFriendApply();
          }}
        />
      }
      {
       ['toVerify'].includes(op_type) && <Button
          title={'完成'}
          type="default"
          disabled={false}
          activeOpacity={0.6}
          titleStyle={{color: '#fff'}}
          style={{
            marginTop:10,
            marginHorizontal: 30,
            height: 50,
            borderWidth:0, 
            backgroundColor: MyThemed[colorScheme||'light'].primaryColor,
          }}
          onPress={async () => {
            const login_user_id = AppStore.userInfo?.user_id;
            if(search_user_info?.expire<=dayjs().format('YYYY-MM-DD HH:mm:ss')){
              expireHander()
            }else{
              if(!params?.user_id) return;
              const res:any = await ACCEPT_ADD_FRIENDS({
                ...formData,
                label_ids: (formData.labels && formData.labels.length)?formData.labels.map((item:any)=>item.label_id).join(','):null,
                f_user_id: search_user_info.user_id,
                msg_unique_id: uniqueMsgId(AppStore.userInfo?.user_id)
              });;
              if(!res || !res.data) return;
              //清除缓存
              let infoObj:any = await AsyncStorage.getItem('remarkLabel');
              infoObj = infoObj?JSON.parse(infoObj):{};
              if(infoObj[search_user_id]){
                delete infoObj[search_user_id];
                await AsyncStorage.setItem('remarkLabel',JSON.stringify(infoObj));
              }

              const friends:any = await searchFriends({user_id: search_user_info.user_id});
              navigation.dispatch(navigation.pop());//清除内部导航堆栈(默认清除上一个并且导航到)
              runInAction(async()=>{
                AppStore.search_user_info = friends;
                const has_val = FriendsStore.addFriendChatLogs[login_user_id] && FriendsStore.addFriendChatLogs[login_user_id][search_user_id];
                if(!FriendsStore.chatLogs[login_user_id]) {
                  FriendsStore.chatLogs[login_user_id] = {
                    userIdSort: [search_user_id]
                  };
                }else{
                  if(Array.isArray(FriendsStore.chatLogs[login_user_id]?.userIdSort)){
                    const idx = FriendsStore.chatLogs[login_user_id].userIdSort.indexOf(search_user_id);
                    if(idx!=-1) FriendsStore.chatLogs[login_user_id].userIdSort.splice(idx,1);
                    FriendsStore.chatLogs[login_user_id].userIdSort.unshift(search_user_id);
                  }else{
                    FriendsStore.chatLogs[login_user_id].userIdSort = [search_user_id];
                  }
                }
                if(has_val){
                  
                  const user = FriendsStore.addFriendChatLogs[login_user_id][search_user_id]||[];
                  const msg_contents = user.msg_contents;
                  for(const item of msg_contents) item.readMsg = true;
                  const time = {
                    type: 'time',
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  }
                  msg_contents.unshift(time);
                  msg_contents.push({
                    type:'des',
                    des: '以上是打招呼的内容'
                  });
                  msg_contents.push({
                    type:'des',
                    des: `你已添加了${user?.user_name},现在可以开始聊天了`
                  });
                  FriendsStore.chatLogs[login_user_id][search_user_id] = _.cloneDeep(user);
                }else{
                  console.log('FriendsStore.chatLogs[login_user_id][search_user_id]======>>>',res?.data?.f_user_name_remark,FriendsStore.chatLogs[login_user_id][search_user_id]);
                  FriendsStore.chatLogs[login_user_id][search_user_id] = {
                    user_id: res?.data?.user_id,
                    user_name: res?.data?.user_name,
                    avatar: res?.data?.avatar,
                    f_user_name_remark: res?.data?.f_user_name_remark,
                    msg_contents: [{
                        type: 'time',
                        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                      },{
                        type:'des',
                        des: '以上是打招呼的内容'
                      },{
                      type:'des',
                      des: `你已添加了${res?.data?.user_name},现在可以开始聊天了`
                    }]
                  };
                  console.log('FriendsStore.chatLogs[login_user_id][search_user_id]======>>>123', JSON.stringify(FriendsStore.chatLogs[login_user_id][search_user_id]));

                }
                await FriendsStore.getFriendList();
                await FriendsStore.get_new_friends_list();

                await AsyncStorage.setItem('chatLogs',JSON.stringify(FriendsStore.chatLogs));
                await AsyncStorage.setItem('addFriendChatLogs',JSON.stringify(FriendsStore.addFriendChatLogs));
              });
              navigation.navigate({
                name: 'UserDetail',
                params: {
                  // userInfo: friends,
                }
              });
            }

          }}
        />
      }
    </View>
  </ScrollView>

  
};

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  contenWrapper:{
    
  },
  titleTxt:{
    textAlign: 'center',
    height: 50,
    lineHeight: 50,
    fontWeight: 'bold',
    fontSize: 18
  },
  forWwrapper:{
    padding: 20,
  },
  labelTxt:{
    marginBottom: 10,
  },
  valueTxt:{
    borderWidth: 0,
    // height: 50,
    borderRadius: 10,
  },
  rightArrow:{
    width: 20,
    height: 20
  }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(SetRemarkLabel));
