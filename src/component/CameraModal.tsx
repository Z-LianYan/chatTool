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


import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera, CameraCaptureError} from 'react-native-vision-camera';
import { CLOSE_CIRCLE_ICON, CLOSE_FLASH, OPEN_FLASH, TURN_CAPTURE } from '../assets/image';
import ImageViewer2 from './ImageViewer2';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { result } from 'lodash';

const CameraModal = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const use_ref = useRef<any>();
  const imageViewer2Ref = useRef<any>();
  const colorScheme = useColorScheme();
  
 
  const overlay_view_ref:{current:any} = useRef();
  const device = useCameraDevice('back',{
    // physicalDevices: [
    //   'ultra-wide-angle-camera',
    //   'wide-angle-camera',
    //   'telephoto-camera'
    // ]
  });//受权后才会有
  const cameraRef = useRef<Camera>(null);

  const [visibleModal,setVisibleModal] = useState(false)

  useEffect(()=>{
    
  },[]);


  const open = useCallback(async (callBack:any)=>{
    use_ref.current = {
      callBack: callBack,
      isCapture: false,
    };
    
    // const _ov = Overlay.show(overlayView);
    // console.log('_ov====>>',_ov);
    // overlay_view_ref.current = _ov;
    setVisibleModal(true);

  },[]);
  const close = useCallback(async()=>{
    // Overlay.hide(overlay_view_ref.current);
    setVisibleModal(false);
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


  const onCapture = useCallback(()=>{
      const _video = cameraRef?.current?.startRecording({
        flash: "off",//off,on
        onRecordingFinished: (video) => {
          console.log("onRecordingFinished=========>>>",video);
          // use_ref.current.callBack && use_ref.current.callBack(video)
          imageViewer2Ref.current.open({
            videoUri: 'file://'+video.path,
          },(file:any)=>{
            console.log('imageViewer2Ref====>>>file',file);
            use_ref.current.callBack && use_ref.current.callBack(file);
            close();
            
          })
        },
        onRecordingError: (error) => {
          console.error('onRecordingError===========>>>>>>',error)
        }
      });

      console.log('video======>>>',_video)

     
      
  },[]);

  const takePhotos = useCallback(async ()=>{
      try{
        const photo = await cameraRef?.current?.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'on',// 'auto' | 'off'
          enableShutterSound: false,
          enableAutoRedEyeReduction: true,
        });
        console.log('photo======>>>',photo)
        if(!photo) return;
        imageViewer2Ref.current.open({
          imgUri: 'file://'+photo.path,
        },(file:any)=>{
          console.log('imageViewer2Ref====>>>file',file);

          use_ref.current.callBack && use_ref.current.callBack(file)


          close();
          
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
      
  },[])

  const onFocus = useCallback(async (tapEvent:any)=>{
    console.log('tapEvent==>>',tapEvent)
    await cameraRef?.current?.focus({
      x: tapEvent.x,
      y: tapEvent.y
    })
  },[])


  return <Modal
  animationType={"fade"}// slide,fade,none
  transparent={true}
  visible={visibleModal}
  statusBarTranslucent={true}//确定您的模态是否应位于系统状态栏下。
  onRequestClose={()=>{
    close()
  }}>
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.containerContent} onPress={(e:any)=>{
        // console.log('e========>>>>',e.nativeEvent.locationX,e.nativeEvent.locationY);
        // console.log('e========>>>>pageY',e.nativeEvent.pageX,e.nativeEvent.pageY);
        // onFocus({
        //   x: e.nativeEvent.locationX,
        //   y:e.nativeEvent.locationY
        // })
      }}>
        {
          device && <Camera
          ref={cameraRef}
          style={{
            flex: 1,
          }}
          resizeMode='cover'
          device={device}
          isActive={true}
          photo={true}
          video={true}
          audio={false}
          onInitialized={()=>{
            console.log('onInitialized====>>>')
          }}
          />
        }


        <Vw style={styles.bottomBtn}>
          <Vw>
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
                  
                  // await setCapture(true)
                  use_ref.current.isCapture = true;
                  console.log('0000----',use_ref.current.isCapture);

                  const res = await onUseMicrophonePermission();
                  console.log('res===000>>>',res);
                  if(res!=200) return use_ref.current.isCapture = false;
                  onCapture()
                }}
                onPressOut={async ()=>{
                  console.log('0000',use_ref.current.isCapture,use_ref.current);
                  if(use_ref.current.isCapture){
                    await cameraRef?.current?.stopRecording()
                    use_ref.current.isCapture = false;
                  }
                  // use_ref.current.callBack && use_ref.current.callBack()
                }}
                onPress={async ()=>{
                  takePhotos();
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


    <ImageViewer2 ref={imageViewer2Ref}/>
  </Modal>;
};

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center'
  },
  containerContent:{
    position: 'relative',
    width: '100%',
    height: '80%',
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