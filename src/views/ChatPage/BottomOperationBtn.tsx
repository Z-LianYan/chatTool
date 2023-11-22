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
  Label
} from '../../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import CustomListRow from '../../component/CustomListRow';
import NavigationBar from '../../component/NavigationBar';
import { login_out } from "../../api/user";
import MyCell from '../../component/MyCell';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import SearchFriend from '../SearchFriend';
import config from '../../config';
import { searchFriends } from '../../api/friends';
import { TextInput } from 'react-native-gesture-handler';
import { runInAction } from 'mobx';

import { ADD_CIR, ADD_USER, ALBUM_ICON, CAPTURE_ICON, NEW_FIREND, VIDEO_ICON } from '../../assets/image';

import {launchCamera, launchImageLibrary,} from 'react-native-image-picker';
import CameraModal from '../../component/CameraModal';
import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera} from 'react-native-vision-camera';


const BottomOperationBtn = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const camera_modal = useRef<any>();
  const use_ref = useRef<any>();
  const colorScheme:any = useColorScheme();

  

  useEffect(()=>{
    
  },[]);


  const open = useCallback((callback:any)=>{
    use_ref.current = {
      callback: callback
    };
  },[]);
  const close = useCallback(()=>{
  },[]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  const handLaunchImageLibrary = useCallback(async (callBack:any)=>{
    try{
      callBack && callBack()
      const result:any = await launchImageLibrary({
        mediaType: 'mixed',
        quality: 1,
        selectionLimit: 0,
        includeBase64: true,
        includeExtra: true
      });
      console.log('includeBase64========>>>>',result);
      if(result && result.assets) {
        // await uploadImage(result.assets)
      }
    }finally{
      // callBack && callBack()
    }
    
  },[]);


  const onUseCameraPermission = useCallback(async ()=>{
    return new Promise(async (resolve, reject) => {
      const cameraPermission:any = await Camera.getCameraPermissionStatus()
      console.log('cameraPermission====>>',cameraPermission);
      if(['granted'].includes(cameraPermission)){//您的应用程序已被授权使用该权限
        resolve(200);
      }
      if(['not-determined'].includes(cameraPermission)){//您的应用尚未请求用户许可
        const newCameraPermission = await Camera.requestCameraPermission();
        if(['denied'].includes(newCameraPermission)) resolve(400);
        if(['granted'].includes(newCameraPermission)) resolve(200);
        if(['restricted'].includes(newCameraPermission)) {
          Alert.alert(
            "权限申请",
            "您的应用程序无法使用相机或麦克风，因为该功能已受到限制",
            [
              { text: "确定", onPress: async () => {}}
            ]
          );
          resolve(400)
        };
      }

      if(['denied'].includes(cameraPermission)){//您的应用程序已向用户请求权限，但被明确拒绝。您无法再次使用请求功能，但可以使用LinkingAPI​​​​将用户重定向到设置应用程序，他可以在其中手动授予权限
        Alert.alert(
          "权限申请",
          "在设置-应用-chatTool-权限中开启相机权限，以正常使用拍照,录制视频",
          [
            {
              text: "取消",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "去设置", onPress: async () => {
              const initialUrl = await Linking.openSettings();//应用程序设计页
              console.log('initialUrl===>>>',initialUrl)
            }}
          ]
        );
        resolve(400)
      }

      if(['restricted'].includes(cameraPermission)){//您的应用程序无法使用相机或麦克风，因为该功能已受到限制，可能是由于家长控制等主动限制造成的
        Alert.alert(
          "权限申请",
          "您的应用程序无法使用相机或麦克风，因为该功能已受到限制",
          [
            { text: "确定", onPress: async () => {}}
          ]
        );
        resolve(400);
      }
      
    })
  },[]);
  // const { hasPermission, requestPermission } = useMicrophonePermission();
  
  
  return <Vw style={{
    ...styles.bottomOperationBtn,
    borderTopColor: ['light'].includes(colorScheme)?'#d3d3d3':'#292929',
  }}>

    <TouchableOpacity 
    activeOpacity={0.6}
    style={{
      ...styles.operationItem,
      backgroundColor: MyThemed[colorScheme||'light'].ctBg
    }}
    onPress={()=>{
      handLaunchImageLibrary(()=>{

      })
    }}>
      <Image 
      style={{
        ...styles.operationItemImg,
        tintColor: MyThemed[colorScheme||'light'].ftCr,
      }} 
      source={ALBUM_ICON}/>
      <Text>相册</Text>
    </TouchableOpacity>
    <TouchableOpacity 
    activeOpacity={0.6}
    style={{
      ...styles.operationItem,
      backgroundColor: MyThemed[colorScheme||'light'].ctBg
    }}
    onPress={async ()=>{
      const res = await onUseCameraPermission()
      if(res!=200) return;
      camera_modal.current.open(()=>{
        console.log('回调了====》〉》')
      })
    }}>
      <Image 
      style={{
        ...styles.operationItemImg,
        tintColor: MyThemed[colorScheme||'light'].ftCr,
      }} 
      source={CAPTURE_ICON}/>
      <Text>拍摄</Text>
    </TouchableOpacity>
    <TouchableOpacity 
    activeOpacity={0.6}
    style={{
      ...styles.operationItem,
      backgroundColor: MyThemed[colorScheme||'light'].ctBg
    }}>
      <Image 
      style={{
        ...styles.operationItemImg,
        tintColor: MyThemed[colorScheme||'light'].ftCr,
      }} 
      source={VIDEO_ICON}/>
      <Text>视频聊天</Text>
    </TouchableOpacity>

    <CameraModal ref={camera_modal}/>
    
  </Vw>;
};

const styles = StyleSheet.create({
  bottomOperationBtn:{
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 30,
    // paddingVertical: 30,
    paddingTop: 30,
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  operationItem:{
    alignItems: 'center',
    width: "20%",
    // backgroundColor:'red',
    marginBottom: 30,
    paddingVertical: 10,
    // borderWidth: 1,
    borderRadius: 10
  },
  operationItemImg:{
    width: 25,
    height: 25,
    marginBottom: 8,
  }
});

export default inject("AppStore","MyThemed")(observer(forwardRef(BottomOperationBtn)));
