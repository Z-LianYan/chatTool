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
  // const [complete, setComplete] = useState<boolean>(false);
  const overlay_view_ref:{current:any} = useRef();
  const device = useCameraDevice('back');//受权后才会有
  const camera = useRef<Camera>(null);

  useEffect(()=>{
    
  },[]);


  const open = useCallback(async (callBack:any)=>{
    use_ref.current = {
      callBack: callBack,
      isCapture: false,
      complete: false
    };
    console.log('open=====>>>>callback',use_ref.current);
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
      const _video = camera?.current?.startRecording({
        flash: "on",//off,on
        onRecordingFinished: (video) => {
          console.log("onRecordingFinished=========>>>",video);
          use_ref.current.complete = true;

          use_ref.current.callBack && use_ref.current.callBack(video)
        },
        onRecordingError: (error) => {
          console.error('onRecordingError===========>>>>>>',error)
        }
      });

      console.log('video======>>>',_video)

     
      
  },[]);

  const takePhotos = useCallback(async ()=>{
      // console.log('12345')
      const photo = await camera?.current?.takePhoto({
        qualityPrioritization: 'speed',
        flash: 'on',
        enableShutterSound: false,
        enableAutoRedEyeReduction: true,
      });
      use_ref.current.complete = true;
      console.log('photo======>>>',photo)
      use_ref.current.callBack && use_ref.current.callBack(photo)
  },[])

  
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
          photo={true}
          video={true}
          audio={false}
        />
      }


       <Vw style={styles.bottomBtn}>
        {
          !use_ref.current?.complete ?  <Vw>
                <Text style={styles.captureTxt}>轻触拍照，长按摄像-{use_ref.current?.complete}</Text>
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
                        await camera?.current?.stopRecording()
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
          </Vw>:<TouchableOpacity
              activeOpacity={0.6}
              style={styles.convertWrapper}
              >
                <Text>完成</Text>
          </TouchableOpacity>
        }
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
    </Vw>
     

    
    
    
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
