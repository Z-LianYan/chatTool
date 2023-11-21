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
  Text as Tx,
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
} from './customThemed';
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
} from './teaset/index';
import PropTypes, { number } from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { runInAction } from 'mobx';


import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera} from 'react-native-vision-camera';
import { CLOSE_CIRCLE_ICON, CLOSE_FLASH, OPEN_FLASH, TURN_CAPTURE } from '../assets/image';

const CameraModal = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const use_ref = useRef<any>();
  const colorScheme = useColorScheme();

  const [keywords, setKeywords] = useState<string>();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [loadingComplete, setLoadingComplete] = useState(false);
  const [overlay_view, set_overlay_view] = useState<any>();
  const overlay_view_ref:{current:any} = useRef();
  const device = useCameraDevice('back');//受权后才会有
  const camera = useRef<Camera>(null);

  useEffect(()=>{
    
  },[]);


  const open = useCallback(async (callback:any)=>{
    use_ref.current = callback;
    console.log('open=====>>>>callback',callback);
    const photo = await camera?.current?.startRecording({
      onRecordingFinished: (video) => {
        console.log('onRecordingFinished===>>>',video)
      },
      onRecordingError: (error) => {
        console.error('onRecordingError====>',error)
      }
    });
    console.log('photo====>>>',photo)
    const _ov = Overlay.show(overlayView);
    console.log('_ov====>>',_ov);
    overlay_view_ref.current = _ov;
    // set_overlay_view(_ov)
  },[]);
  const close = useCallback(async()=>{
    Overlay.hide(overlay_view_ref.current);
    
  },[]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));




  // const { hasPermission, requestPermission } = useCameraPermission()

  // const { hasPermission, requestPermission } = useMicrophonePermission()
  // if(!hasPermission){
  //   requestPermission()
  // }
  // const { hasPermission, requestPermission } = useCameraPermission()

  // const cameraPermission = await Camera.getCameraPermissionStatus()
// const microphonePermission = await Camera.getMicrophonePermissionStatus()
  const onUseCameraPermission = useCallback(async ()=>{
    
    return new Promise(async (resolve, reject) => {
      const cameraPermission:any = await Camera.getCameraPermissionStatus()
      console.log('cameraPermission====>>',cameraPermission);
      if(['granted'].includes(cameraPermission)){//您的应用程序已被授权使用该权限
        resolve(200);
      }
      if(['not-determined'].includes(cameraPermission)){//您的应用尚未请求用户许可
        const newCameraPermission = await Camera.requestCameraPermission()
        console.log('newCameraPermission====>>',newCameraPermission);
      }

      if(['denied'].includes(cameraPermission)){//您的应用程序已向用户请求权限，但被明确拒绝。您无法再次使用请求功能，但可以使用LinkingAPI​​​​将用户重定向到设置应用程序，他可以在其中手动授予权限
        // resolve(200);
        const initialUrl = await Linking.openSettings();//应用程序设计页
        console.log('initialUrl===>>>',initialUrl)
      }

      if(['restricted'].includes(cameraPermission)){//您的应用程序无法使用相机或麦克风，因为该功能已受到限制，可能是由于家长控制等主动限制造成的
        resolve(200);
      }
      
    })
  },[]);
  // const { hasPermission, requestPermission } = useMicrophonePermission();
  const onUseMicrophonePermission = useCallback(async ()=>{
    return new Promise(async (resolve, reject) => {
      const microphonePermission:any = await Camera.getMicrophonePermissionStatus();
      console.log('microphonePermission====>>',microphonePermission);
      if(['granted'].includes(microphonePermission)){//您的应用程序已被授权使用该权限
        resolve(200);
      }
      if(['not-determined'].includes(microphonePermission)){//您的应用尚未请求用户许可
        const newCameraPermission = await Camera.getMicrophonePermissionStatus()
        console.log('getMicrophonePermissionStatus====>>2',newCameraPermission);
      }

      if(['denied'].includes(microphonePermission)){//您的应用程序已向用户请求权限，但被明确拒绝。您无法再次使用请求功能，但可以使用LinkingAPI​​​​将用户重定向到设置应用程序，他可以在其中手动授予权限
        // resolve(200);
        const initialUrl = await Linking.openSettings();//应用程序设计页
        console.log('initialUrl===>>>2',initialUrl)
      }

      if(['restricted'].includes(microphonePermission)){//您的应用程序无法使用相机或麦克风，因为该功能已受到限制，可能是由于家长控制等主动限制造成的
        resolve(200);
      }
    })
  },[]);


  // console.log('hasPermission-====>>',hasPermission);

  const onCapture = useCallback(()=>{
      // console.log('12345',camera?.current)
      // const photo = await camera?.current?.takePhoto({
      //   qualityPrioritization: 'speed',
      //   flash: 'on',
      //   enableShutterSound: false,
      //   enableAutoRedEyeReduction: true,
      // });

      const photo = camera?.current?.startRecording({
        onRecordingFinished: (video) => {
          console.log("onRecordingFinished=========>>>",video)
        },
        onRecordingError: (error) => {
          console.error('onRecordingError===========>>>>>>',error)
        }
      });
      console.log('photo======>>>',photo)
  },[]);

  
  const overlayView = <Overlay.View
    style={{alignItems: 'center', justifyContent: 'center'}}
    modal={false}
    overlayOpacity={1}
    >
    <Vw style={styles.container}>
      {
        device && <Camera
          ref={camera}
          style={{
            width: '100%',
            height: '100%',
          }}
          device={device}
          isActive={true}
          // photo={true}
          video={true}
          audio={false}
        >
          <Text style={{color:'#fff'}}>哈哈哈哈</Text>
        </Camera>
      }
    </Vw>

    
    <Vw style={styles.bottomBtn}>
      <Text style={styles.captureTxt}>轻触拍照，长按摄像</Text>
      <Vw style={styles.bottomBtnWrapper}>
        <TouchableOpacity
        activeOpacity={0.6}
        style={styles.flashIconWrapper}
        >
          <Image 
            style={styles.flashIcon} 
            source={OPEN_FLASH}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.captureBtn}
          onLongPress={async ()=>{
            await onUseCameraPermission();
            await onUseMicrophonePermission();
            onCapture()
          }}
          onPressOut={async ()=>{
            console.log('0000');
            await camera?.current?.stopRecording()
            use_ref.current.callBack && use_ref.current.callBack()
          }}
          onPress={async ()=>{
            
          }}
        ></TouchableOpacity>
        <TouchableOpacity
        activeOpacity={0.6}
        style={styles.convertWrapper}
        >
          <Image 
            style={styles.convertIcon} 
            source={TURN_CAPTURE}
          />
        </TouchableOpacity>
      </Vw>
    </Vw>
    <TouchableOpacity
    style={styles.closeBtnWrapper} 
    activeOpacity={0.6}
    onPress={()=>{
      close()
    }}>
      <Image 
        style={styles.closeBtn} 
        source={CLOSE_CIRCLE_ICON}
      />
    </TouchableOpacity>
  </Overlay.View>

  return null;

  
};

const styles = StyleSheet.create({
  container:{
    position: 'relative',
    width: '100%',
    height: '80%'
  },
  bottomBtn:{
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    
  },
  captureTxt:{
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  bottomBtnWrapper:{
    flexDirection:'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  flashIconWrapper:{

  },
  flashIcon:{
    width: 30,
    height: 30,
    tintColor: '#fff'
  },
  
  convertWrapper:{

  },
  convertIcon:{
    width: 30,
    height: 30,
    tintColor: '#fff'
  },
  
  captureBtn:{
    width: 80,
    height: 80,
    backgroundColor: '#ffff',
    borderRadius: 40
  },
  closeBtnWrapper:{
    width: 30,
    height: 30,
    position: 'absolute',
    top: '10%',
    left: 20,
  },
  closeBtn:{
    width: '100%',
    height: '100%',
    // position: 'absolute',
    // top: 50,
    // left: 20,
    tintColor: '#fff'
  }
});

export default inject("AppStore","MyThemed")(observer(forwardRef(CameraModal)));
