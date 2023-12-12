import React, { useState,useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
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
  Alert,
  Text as Tt,
  View as Vw,
  Modal,
  Linking
  
} from 'react-native';
import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { 
  View,
  Text
} from '../../component/customThemed';
import { 
  Button,
  Carousel,
  // NavigationBar,
  Theme,
  ListRow,
  Toast,
  Input,
  Overlay,
  Label,
  AlbumView
} from '../../component/teaset/index';

import { ADD_CIR, ADD_USER, ALBUM_ICON, CAPTURE_ICON, LOADING_ICON, NEW_FIREND, SEND_FAIL, VIDEO_ICON } from '../../assets/image';

import {launchCamera, launchImageLibrary,} from 'react-native-image-picker';
import CameraModal from '../../component/CameraModal';
import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera} from 'react-native-vision-camera';
import { formatTime } from '../../utils/tool';
import { searchFriends } from '../../api/friends';
import { runInAction } from 'mobx';
import { conformsTo } from 'lodash';
import ImageViewer from '../../component/ImageViewer';

const ShowMsg = ({AppStore,MyThemed,FriendsStore,navigation,AppVersions,onSendMsg,params}:any,ref:any) => {
  const use_ref = useRef<any>();
  const colorScheme:any = useColorScheme();
  const login_user_id = AppStore?.userInfo?.user_id;
  const chatLogs = FriendsStore.chatLogs[login_user_id]||{};
  const user = chatLogs[params?.user_id]||{}
  const msg_contents = user.msg_contents||[];
  const refImageViewer:{current:any} = useRef();

  useEffect(()=>{
    
  },[]);


  // const open = useCallback((callback:any)=>{
  //   use_ref.current = {
  //     callback: callback
  //   };
  // },[]);
  // const close = useCallback(()=>{
  // },[]);

  // 把父组件需要调用的方法暴露出来
  // useImperativeHandle(ref, () => ({
  //   open,
  //   close
  // }));
  const goUserDetail = useCallback(async (user_id:number)=>{
    const friends:any = await searchFriends({user_id: user_id});
    runInAction(()=>{
      AppStore.search_user_info = friends;
    });
    navigation.navigate({
      name: 'UserDetail',
      params: {
        // userInfo: friends,
      }
    });
  },[]);
  const renderAddFriendVerify = useCallback((item:any,index:number)=>{
    return  <Vw key={index+'chatPage'} style={{paddingVertical:15}}>
      <Text 
        style={{
          // ...styles.typeText,
          color: MyThemed[colorScheme||'light'].ftCr2,
          textAlign:'center',
          lineHeight: 20
        }}>{
          AppStore?.search_user_info?.f_user_name_remark || AppStore?.search_user_info?.user_name } 
          已开启朋友验证，你还不是他（她）朋友。请先发送朋友验证请求，对方验证通过后，才能聊天。<TouchableOpacity 
          activeOpacity={0.6}
          onPress={async ()=>{
            console.log('12345')
              const friends:any = await searchFriends({user_id: params?.user_id});
              console.log('')
              runInAction(()=>{
                AppStore.search_user_info = friends;
                navigation.navigate({
                  name: 'SetRemarkLabel',
                  params:{
                    op_type: 'addUser'
                  }
                })
              });
          }}>
            <Text 
            style={{
              color: MyThemed[colorScheme||'light'].ftCr3,
            }}>发送朋友验证</Text>
        </TouchableOpacity>
      </Text>
    </Vw>
  },[msg_contents]);
  const renderTime = useCallback((item:any,index:number)=>{
    return <Text key={index+'chatPage'} style={{
      ...styles.typeText,
      color: MyThemed[colorScheme||'light'].ftCr2,
    }}>{formatTime(item.created_at)}</Text>
  },[]);

  const renderDes = useCallback((item:any,index:number)=>{
    return <Text key={index+'chatPage'} style={{
      ...styles.typeText,
      color: MyThemed[colorScheme||'light'].ftCr2,
    }}>{item.des}</Text>
  },[]);
  const renderMsg = useCallback(()=>{
    const imgs:any = [];
    msg_contents.map((item:any)=>{
      if(['img'].includes(item?.msg_type)) imgs.push({url: item.msg_content});
    });
    return msg_contents?.map((item:any,index:number)=>{
      if(['des'].includes(item.type)) return renderDes(item,index);
      if(['time'].includes(item.type)) return renderTime(item,index);
      if(['addFriendVerify'].includes(item.type)) return  renderAddFriendVerify(item,index);
      return <Vw key={item.msg_unique_id+'chatPage'} style={{
        ...styles.msgCell,
        justifyContent: item.from_user_id === AppStore.userInfo?.user_id? 'flex-end':'flex-start',
      }}>
        {
          item.from_user_id === AppStore.userInfo?.user_id && <Vw style={styles.msgTextContainer}>
            {
              item.sendIng ? <Image 
              style={{
                ...styles.leftLoadingIcon,
              }} 
              source={LOADING_ICON}/>:(['addFriendVerify','serverNotCallBack'].includes(item.sendStatus) && <TouchableOpacity
                activeOpacity={0.6}
                onPress={()=>{
                  runInAction(()=>{
                    const im = msg_contents[index];
                    // im.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
                    // im.sendIng = true;
                    // im.msg_unique_id = uniqueMsgId(AppStore.userInfo?.user_id);
                    msg_contents.splice(index,1);
                    // sendMsg({
                    //   msg_type:'text',
                    //   msgRow:im,
                    // });
                    const obj = {
                      msg_type: im?.msg_type,
                      msg_content: im.msg_content,
                      file: im.file
                    }
                    if(['img'].includes(im?.msg_type)) obj.file = im.file;
                    onSendMsg([obj]);
                  });
                }}
              >
                <Image 
                style={{
                  ...styles.leftLoadingIcon,
                }} 
                source={SEND_FAIL}/>
              </TouchableOpacity>)
            }
            <Vw style={styles.msgTextWrapper}>
              {
                ['text'].includes(item?.msg_type) && <Text
                  selectable={true}
                  style={{
                    ...styles.msgText,
                    backgroundColor:  MyThemed[colorScheme||'light'].fromMsgBg,
                    color: MyThemed['light'].ftCr
                  }}
                >{item.msg_content}</Text>
              }
              {
                ['img'].includes(item?.msg_type) && <TouchableOpacity activeOpacity={0.6}
                onPress={()=>{
                  refImageViewer.current.open({
                    index:0,
                    imgs: imgs,
                  })
                }}>
                  <Image 
                  resizeMode="cover"
                  style={{
                    width: 80,
                    height: 120
                  }} 
                  source={{uri: item.msg_content}}/>
                </TouchableOpacity>
              }
            </Vw>
            {
              ['text'].includes(item?.msg_type) && <Vw style={{
                borderWidth: 8,
                // borderColor: 'transparent',
                borderLeftColor: MyThemed[colorScheme||'light'].fromMsgBg,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                position: 'absolute',
                right: -16,
                top: 10,
                // marginTop: -8,
              }}></Vw>
            }
          </Vw>
          
        }


        <TouchableOpacity onPress={()=>{
          goUserDetail(item.from_user_id);
        }}>
          <Image 
          style={{
            ...styles.msgCellAvatar,
            marginLeft: item.from_user_id === AppStore.userInfo?.user_id? 10:0,
            marginRight: item.from_user_id !== AppStore.userInfo?.user_id? 10:0,
          }} 
          source={{uri: item.from_avatar}}/>
        </TouchableOpacity>


        
        {
          item.from_user_id !== AppStore.userInfo?.user_id && <Vw style={styles.msgTextContainer}>
            <Vw style={styles.msgTextWrapper}>
              {
                ['text'].includes(item?.msg_type) && <Text
                  selectable={true}
                  style={{
                    ...styles.msgText,
                    // textAlign: 'center',
                    backgroundColor:  MyThemed[colorScheme||'light'].ctBg
                  }}
                >{item.msg_content}</Text>
              }
              {
                ['img'].includes(item?.msg_type) && <TouchableOpacity activeOpacity={0.6}
                onPress={()=>{
                  // console.log('12');
                  // <AlbumView
                  // style={{flex: 1}}
                  // control={true}
                  // images={[
                  //   require('../../assets/image/address-book-activate.png'),
                  //   require('../../assets/image/friendCircle.png'),
                  // ]}
                  // thumbs={[
                  //   require('../../assets/image/address-book-activate.png'),
                  //   require('../../assets/image/friendCircle.png'),
                  // ]}
                  // />

                  refImageViewer.current.open({
                    index:0,
                    imgs: imgs
                  })
                }}>
                  <Image 
                  resizeMode="cover"
                  style={{
                    width: 80,
                    height: 120
                  }} 
                  source={{uri: item.msg_content}}/>
                </TouchableOpacity>
              }
            </Vw>
            {
              ['text'].includes(item?.msg_type) && <Vw style={{
                borderWidth: 8,
                // borderColor: 'transparent',
                borderLeftColor: 'transparent',
                borderTopColor: 'transparent',
                borderRightColor: MyThemed[colorScheme||'light'].ctBg,
                borderBottomColor: 'transparent',
                position: 'absolute',
                left: -16,
                top: 10,
                // marginTop: -8,
              }}></Vw>
            }
          </Vw>
        }
      </Vw>
    })
  },[msg_contents]);
  

  return <Vw>
    <ImageViewer ref={refImageViewer}/>
    {
      renderMsg()
    }
  </Vw>;
};

const styles = StyleSheet.create({
  msgTextContainer:{
    maxWidth: '70%',
    position: 'relative',
  },
  msgCellAvatar:{
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  msgCell:{
    flexDirection:'row',
    marginVertical:10,
  },
  msgText:{
    padding: 8,
    lineHeight: 20,
  },
  leftLoadingIcon:{
    position: 'absolute',
    top: 3,
    left: -30,
    width: 30,
    height: 30,
    // fontSize: 10,
  },
  typeText: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 15,
  },
  msgTextWrapper:{
    borderRadius: 8,
    overflow: 'hidden'
  },
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(forwardRef(ShowMsg)));
