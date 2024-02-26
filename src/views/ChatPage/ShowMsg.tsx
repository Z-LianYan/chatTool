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

import { ADD_CIR, ADD_USER, ALBUM_ICON, AUDIO_ICON, AUDIO_ICON_NOT_CIRCLE_LEFT, AUDIO_ICON_NOT_CIRCLE_RIGHT, CAPTURE_ICON, LOADING_ICON, NEW_FIREND, SEND_FAIL, VIDEO_ICON } from '../../assets/image';

import {launchCamera, launchImageLibrary,} from 'react-native-image-picker';
import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera} from 'react-native-vision-camera';
import { formatTime } from '../../utils/tool';
import { searchFriends } from '../../api/friends';
import { runInAction } from 'mobx';
import { conformsTo } from 'lodash';
import ImageViewer from '../../component/ImageViewer';
import Video, {VideoRef,ResizeMode,PosterResizeModeType} from 'react-native-video';
import ImageVideo from '../../component/ImageVideo';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowMsg = ({AppStore,MyThemed,FriendsStore,navigation,AppVersions,onSendMsg,params}:any,ref:any) => {
  const use_audio_ref = useRef<any>();
  const colorScheme:any = useColorScheme();
  const login_user_id = AppStore?.userInfo?.user_id;
  const chatLogs = FriendsStore.chatLogs[login_user_id]||{};
  const user = chatLogs[params?.user_id]||{}
  const msg_contents = user.msg_contents||[];
  const refImageViewer:{current:any} = useRef();

  const videoRef:{current:any} = useRef<VideoRef>(null);
  // const [videoSourceUri,setVideoSourceUri] = useState<string>('')
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
    runInAction(async ()=>{
      AppStore.search_user_info = friends;

      // 更新聊天记录的会员信息
      if(FriendsStore.chatLogs[login_user_id] && FriendsStore.chatLogs[login_user_id][user_id]){
        FriendsStore.chatLogs[login_user_id][user_id] = {
          ...FriendsStore.chatLogs[login_user_id][user_id],
          user_id:  friends?.user_id,
          user_name:  friends?.user_name,
          f_user_name_remark: friends?.f_user_name_remark,
          avatar:  friends?.avatar,
        }
        await AsyncStorage.setItem('chatLogs',JSON.stringify(FriendsStore.chatLogs));
      }

      //更新通讯录的个人信息
      FriendsStore?.friendsData?.rows.map((item:any)=>{
        if(item.user_id===friends?.user_id) {
          runInAction(()=>{
            item.user_name = friends?.user_name;
            item.f_user_name_remark = friends?.f_user_name_remark;
            item.avatar = friends?.avatar;
          })
        }
      })
      
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
  const playAudio = useCallback((url:string)=>{
    if(use_audio_ref.current){
      if(use_audio_ref.current.timer){
        clearTimeout(use_audio_ref.current.timer)
      }else{
        use_audio_ref.current.whoosh && use_audio_ref.current.whoosh.stop();
      };
    }else{
      use_audio_ref.current = {}
    }

    const timer = setTimeout(() => {
      // 解决ios 问题 对于IOS，您可以将url => decodeURI(url) 和 Sound.MAIN_BUNDLE(第二个参数) 设置为“”（空字符串）
      const whoosh = new Sound(decodeURI(url), '', (error:any) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
       
        // Play the sound with an onEnd callback
        whoosh.play((success:any) => {
          if (success) {
            use_audio_ref.current.timer = null;
            use_audio_ref.current.whoosh = null;
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
      use_audio_ref.current.whoosh = whoosh;
      
    }, 800);
    use_audio_ref.current.timer = timer;
  },[])
  const renderMsg = useCallback(()=>{
    // const imgs:any = [];
    // msg_contents.map((item:any)=>{
    //   if(['img','video'].includes(item?.msg_type)) imgs.push({url: item.msg_content});
    // });
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
                    msg_contents.splice(index,1);
                    const obj = {
                      msg_type: im?.msg_type,
                      msg_content: im.msg_content,
                      file: im.file,
                      
                      msg_unique_id: im.msg_unique_id,
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
                ['text','audio'].includes(item?.msg_type) && <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    padding: 8,
                    minHeight: 20,
                    backgroundColor:  MyThemed[colorScheme||'light'].fromMsgBg,
                    justifyContent: "center"
                  }}
                  onPress={()=>{
                    if(['audio'].includes(item?.msg_type)) playAudio(item.msg_content)
                  }}
                >
                  {
                    ['audio'].includes(item?.msg_type)?<Image 
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: MyThemed[colorScheme||'light'].ftCr,
                        marginVertical: 0
                      }} 
                      source={AUDIO_ICON_NOT_CIRCLE_RIGHT}/>:<Text
                    selectable={true}
                     style={{
                      ...styles.msgText,
                      // color: MyThemed[colorScheme||'light'].ftCr,
                     }}
                    >{item.msg_content}</Text>
                  } 
                </TouchableOpacity>
              }

              {
                ['img','video'].includes(item?.msg_type) && <ImageVideo item={item} onClick={()=>{
                  if(['img','video'].includes(item?.msg_type)){
                    refImageViewer.current.open({
                      index: 0,
                      imgs:   [{url: item.msg_content}]
                    })
                  }
                  // if(['video'].includes(item?.msg_type)){
                  //   setVideoSourceUri(item?.msg_content)
                  //   console.log('videoRef.current====>>>play',videoRef.current)
                  //   setTimeout(() => {
                  //     // videoRef.current?.resume()
                  //     videoRef.current?.presentFullscreenPlayer()
                  //     // videoRef.current?.play()
                  //   }, 100);
                  // }
                }}/>
              }

             
            </Vw>
            {
              ['text','audio'].includes(item?.msg_type) && <Vw style={{//箭头
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
          source={{uri: item.from_user_id === AppStore.userInfo?.user_id?AppStore.userInfo?.avatar:FriendsStore.chatLogs[login_user_id][params?.user_id]?.avatar}}/>
        </TouchableOpacity>


        
        {
          item.from_user_id !== AppStore.userInfo?.user_id && <Vw style={styles.msgTextContainer}>
            <Vw style={styles.msgTextWrapper}>
              {
                ['text','audio'].includes(item?.msg_type) && <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    padding: 8,
                    minHeight: 20,
                    // backgroundColor:  MyThemed[colorScheme||'light'].fromMsgBg,
                    justifyContent: "center",

                    // ...styles.msgText,
                    backgroundColor:  MyThemed[colorScheme||'light'].ctBg
                  }}
                  onPress={()=>{
                    if(['audio'].includes(item?.msg_type)) playAudio(item.msg_content)
                  }}
                >
                  
                  {
                    ['audio'].includes(item?.msg_type)?<Image 
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: MyThemed[colorScheme||'light'].ftCr,
                    }} 
                    source={AUDIO_ICON_NOT_CIRCLE_LEFT}/>:<Text 
                    selectable={true}
                    style={{
                      ...styles.msgText,
                      // color: MyThemed[colorScheme||'light'].ftCr,
                    }}>{item.msg_content}</Text>
                  }
                </TouchableOpacity>
              }

              {
                ['img','video'].includes(item?.msg_type) && <ImageVideo item={item} onClick={()=>{
                  console.log("it");
                  if(['img','video'].includes(item?.msg_type)){
                    refImageViewer.current.open({
                      index: 0,
                      imgs: [{url: item.msg_content}]
                    })
                  }
                  // if(['video'].includes(item?.msg_type)){
                  //   setVideoSourceUri(item?.msg_content)
                  //   // videoRef.current?.play()
                  //   setTimeout(() => {
                  //     videoRef.current?.presentFullscreenPlayer()
                  //   }, 100);
                  // }
                }}/>
              }
            </Vw>
            {
              ['text','audio'].includes(item?.msg_type) && <Vw style={{
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
    {
      renderMsg()
    }
    <ImageViewer ref={refImageViewer}/>
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
    // padding: 8,
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
