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
  Linking,
  Dimensions
} from 'react-native';
import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useIsFocused 
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
import PropTypes, { any, number } from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput,PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler';
import { runInAction } from 'mobx';


import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera, CameraCaptureError, useCameraFormat} from 'react-native-vision-camera';
import { CLOSE_CIRCLE_ICON, CLOSE_FLASH, OPEN_FLASH, TURN_CAPTURE } from '../assets/image';
import ImageViewer2 from './ImageViewer2';
import ImageViewer from './ImageViewer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { result } from 'lodash';

import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import * as Progress from 'react-native-progress';

const CameraModal = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const use_ref = useRef<any>();
  const imageViewer2Ref = useRef<any>();
  const imageViewerRef = useRef<any>();
  const colorScheme = useColorScheme();
  const [startRecordingSecond,setStartRecordingSecond] = useState<number>(0);//off,on
  const [flash,setFlash] = useState<string>("off");//off,on
  
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front')
  const device = useCameraDevice(cameraPosition);

  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Platform.select<number>({
    android: Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
    ios: Dimensions.get('window').height,
  }) as number
  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    // { 
    //   videoResolution: { width: 1280, height: 720 },
    //   photoResolution: { width: 1280, height: 720 },
    //   pixelFormat: 'native' 
    // },
    { videoResolution: { width: 1280, height: 720 } },
    { photoResolution: { width: 1280, height: 720 } },
    { videoAspectRatio: screenAspectRatio },
    { photoAspectRatio: screenAspectRatio },
    { fps: 30 }
  ])
  const cameraRef = useRef<Camera>(null);

  const [visibleModal,setVisibleModal] = useState(false);

  // const isActive = useIsFocused();
  const [isActive,setIsActive] = useState<boolean>(false);
  const [convertCount,setConvertCount] = useState<number>(0);

  useEffect(()=>{

    return ()=>{
      if(use_ref.current?.timer) clearTimeout(use_ref.current?.timer);
    }
  },[]);

  const open = useCallback(async (callBack:any)=>{
    use_ref.current = {
      callBack: callBack,
      isCapture: false,
    };
    
    setVisibleModal(true);

  },[]);
  const close = useCallback(async()=>{
    setVisibleModal(false);
    setIsActive(false);
    if(use_ref.current?.timer) clearTimeout(use_ref.current?.timer);
    setCameraPosition('front');
    setConvertCount(0);
  },[]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));


  const onUseMicrophonePermission = useCallback(async ()=>{
    return new Promise(async (resolve, reject) => {
      const microphonePermission:any = await Camera.getMicrophonePermissionStatus();
      console.log('microphonePermission====>>',microphonePermission);
      if(['granted'].includes(microphonePermission)){//您的应用程序已被授权使用该权限
        resolve(200);
      }
      if(['not-determined'].includes(microphonePermission)){//您的应用尚未请求用户许可
        const requestMicrophonePermission = await Camera.requestMicrophonePermission();
        console.log('newCameraPermission===>>>',requestMicrophonePermission)
        if(['denied'].includes(requestMicrophonePermission)) resolve(400);
        if(['granted'].includes(requestMicrophonePermission)) resolve(200);
        if(['restricted'].includes(requestMicrophonePermission)) {
          Alert.alert(
            "权限申请",
            "您的应用程序无法使用麦克风，因为该功能已受到限制",
            [
              { text: "确定", onPress: async () => {}}
            ]
          );
          resolve(400)
        };
      }

      if(['denied'].includes(microphonePermission)){//您的应用程序已向用户请求权限，但被明确拒绝。您无法再次使用请求功能，但可以使用LinkingAPI​​​​将用户重定向到设置应用程序，他可以在其中手动授予权限
        Alert.alert(
          "权限申请",
          "在设置-应用-chatTool-权限中开启麦克风权限，以正常使用麦克风",
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

      if(['restricted'].includes(microphonePermission)){//您的应用程序无法使用相机或麦克风，因为该功能已受到限制，可能是由于家长控制等主动限制造成的
        Alert.alert(
          "权限申请",
          "您的应用程序无法使用麦克风，因为该功能已受到限制",
          [
            { text: "确定", onPress: async () => {}}
          ]
        );
        resolve(400);
      }
    })
  },[]);

  const onStartRecord = ()=>{
    if(use_ref.current.startRecordingTimer) clearInterval(use_ref.current.startRecordingTimer);
    setStartRecordingSecond(0);
    let time = 0;
    use_ref.current.startRecordingTimer = setInterval(async ()=>{
      if(time>=600) {
        clearInterval(use_ref.current.startRecordingTimer);
        use_ref.current.isCapture = false;
        await cameraRef?.current?.stopRecording();
      }else{
        time += 1;
        setStartRecordingSecond(time);
      }
    },100);
  }

  const onCapture = useCallback(async ()=>{
    use_ref.current.isCapture = true;
    console.log('0000----',use_ref.current.isCapture);
    const res = await onUseMicrophonePermission();
    if(res!=200) return use_ref.current.isCapture = false;
    if(!cameraRef?.current) return;
    try{
      console.log('开始录制视频==========》〉》〉111',startRecordingSecond)
      
      onStartRecord()
      const _video = await cameraRef?.current?.startRecording({
        flash: flash,//"off"| "auto"|"on"
        onRecordingFinished: (video:any) => {
          setStartRecordingSecond(0);
          if(use_ref.current.startRecordingTimer) clearInterval(use_ref.current.startRecordingTimer);
          // imageViewer2Ref.current.open({
          //   videoUri: 'file://'+video.path,
          // },(file:any)=>{
          //   console.log('imageViewer2Ref====>>>file',file);
          //   use_ref.current.callBack && use_ref.current.callBack(file);
          //   close();
          // })

          // imageViewerRef.current.open({
          //   index: 0,
          //   imgs:   [{url: 'file://'+video.path}]
          // })

          imageViewerRef.current.open({
            index: 0,
            imgs:   [{ url: 'file://'+video.path }],
            callBack: (file:any)=>{
              use_ref.current.callBack && use_ref.current.callBack(file);
              close();
            }
          })


        },
        onRecordingError: (error:any) => {
          console.error('onRecordingError===========>>>>>>',error)
        }
      } as any);
  
      console.log('video======>>>',_video)

    }catch(err){

    }
  },[flash]);

  const takePhotos = useCallback(async ()=>{
      try{
        if(!cameraRef?.current) return; 
        const photo = await cameraRef?.current?.takePhoto({
          qualityPrioritization: 'quality',
          flash: flash,// 闪光灯 "off"| "auto"|"on"
          // quality: 90,
          enableShutterSound: true ,
          enableAutoStabilization: true,
          enableAutoRedEyeReduction: true,
        } as any);
        if(!photo) return;
        // imageViewer2Ref.current.open({
        //   imgUri: 'file://'+photo.path,
        // },(file:any)=>{
        //   console.log('imageViewer2Ref====>>>file',file);
        //   use_ref.current.callBack && use_ref.current.callBack(file);
        //   close();
        // })

        imageViewerRef.current.open({
          index: 0,
          imgs:   [{ url: 'file://'+photo.path }],
          callBack: (file:any)=>{
            console.log('file====>>>哈哈哈哈😄',file);
            use_ref.current.callBack && use_ref.current.callBack(file);
            close();
          }
        })
      }catch(e){
        console.log('e=====>>>',e)
        if (e instanceof CameraCaptureError) {
          switch (e.code) {
            case "capture/file-io-error":
              console.error("Failed to write photo to disk!")
              break
            default:
              console.error(e)
              break
          }
        }
      }
      
  },[flash])

  const onFocus = useCallback(async (tapEvent:any)=>{
    console.log('tapEvent==>>',tapEvent)
    await cameraRef?.current?.focus({
      x: tapEvent.x,
      y: tapEvent.y
    })
  },[])

  const renderCamera = ()=>{
    if(!device) return;
    return  <Camera
      ref={cameraRef}
      format={format} 
      style={{
        flex: 1,
      }}
      resizeMode='contain'
      zoom={1.0}
      device={device as any}
      torch={'off'}// 开启闪光 此项需要配置 否则 执行 cameraRef?.current?.stopRecording(); 会报错
      isActive={isActive}
      photo={true}
      video={true}
      audio={true}
      onStarted={()=>{
        console.log('=========>>>>onStarted');
      }}
      onStopped={()=>{
        console.log('=========>>>>onStopped');
      }}
      onInitialized={()=>{
        console.log('onInitialized====>>>',cameraPosition,convertCount)
        // 3.6.17 版本必须初始化完成之后再激活，不然 android 打开会黑屏(经过测试打包后还是会黑屏)
        // 3.6.16 打开相机画面有时会被拉伸的情况，（问题未解决）
        setIsActive(true);
        
        //临时处理打开相机画面被拉伸的情况，（从前置调到后置可处理相机画面拉伸问题）
        const count = convertCount+1;
        if(count<=1){
          console.log('--------')
          setCameraPosition('back');
          setConvertCount(count);
        }else if(count===2){
          if(use_ref.current?.timer) clearTimeout(use_ref.current?.timer);
          use_ref.current.timer = setTimeout(() => {
            setConvertCount(count);
          }, 800);
        }
        
      }}
      onError={(e)=>{
        console.log('=======>>>>>onError',e)
      }}
    />
  };
  return <Modal
  animationType={"none"}// slide,fade,none
  transparent={true}
  visible={visibleModal}
  statusBarTranslucent={true}//确定您的模态是否应位于系统状态栏下。
  onRequestClose={()=>{
    close()
  }}>
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      
      <TouchableOpacity activeOpacity={1} style={styles.containerContent} onPress={(e:any)=>{
      }}>
        {convertCount<=1 && <Vw style={styles.containerMask}>
          <Text style={{color:'#fff'}}></Text>
        </Vw> }
        {
          renderCamera()
        }

        <Vw style={styles.bottomBtn}>
          <Vw>
            <Text style={styles.captureTxt}>轻触拍照，长按摄像</Text>
            <Vw style={styles.bottomBtnWrapper}>
              <TouchableOpacity
              activeOpacity={1}
              style={styles.flashIconWrapper}>
                {
                  cameraPosition=='back' && <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={()=>{
                      console.log('123456',flash)
                      setFlash(flash=='on'?'off':'on');
                    }}
                    >
                      <Image 
                        style={styles.flashIcon} 
                        source={flash=='off'?CLOSE_FLASH:OPEN_FLASH}
                      />
                  </TouchableOpacity>
                }
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.captureBtn}
                onLongPress={async ()=>{
                  onCapture()
                }}
                onPressOut={async ()=>{
                  if(use_ref.current.isCapture){
                    try{
                      await cameraRef?.current?.stopRecording();
                    }catch(err){
                      console.log("stopRecording======>>>",err);
                    }
                    use_ref.current.isCapture = false;
                  }
                }}
                onPress={async ()=>{
                  takePhotos();
                }}
              >
                <Progress.Circle 
                  size={80} 
                  // indeterminate={true} 
                  // indeterminateAnimationDuration={60000}
                  color={'green'}
                  borderWidth={0}
                  borderColor={'blue'}
                  // fill={'yellow'}
                  progress={(startRecordingSecond*1.666666)/1000}
                  thickness={6} 
                  showsText={false}
                  textStyle={{
                    color:'green',
                    backgroundColor:'red'
                }}/>
              </TouchableOpacity>
             
              <TouchableOpacity
              activeOpacity={0.6}
              style={styles.convertWrapper}
              onPress={()=>{
                setCameraPosition(cameraPosition=='back'?'front':'back');
              }}
              >
                <Image 
                  style={styles.convertIcon} 
                  source={TURN_CAPTURE}
                />
              </TouchableOpacity>
            </Vw>
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
      </TouchableOpacity>
    </TouchableOpacity>


    {/* <ImageViewer2 ref={imageViewer2Ref}/> */}

    <ImageViewer 
    ref={imageViewerRef}
    footerOperatorBtn={true}
    saveToLocalByLongPress={false}/>
  </Modal>;
};

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    position: 'relative',
  },
  containerContent:{
    position: 'relative',
    width: '100%',
    height: '80%',
    // backgroundColor: "red"
  },
  containerMask:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000
  },
  bottomBtn:{
    position: 'absolute',
    bottom: 50,
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
    width: 30,
    height: 30,
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
    tintColor: '#fff'
  }
});

export default inject("AppStore","MyThemed")(observer(forwardRef(CameraModal)));