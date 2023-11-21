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
  Modal
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
import { CLOSE_CIRCLE_ICON } from '../assets/image';

const CameraModal = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const use_ref = useRef<any>();
  const colorScheme = useColorScheme();

  const [keywords, setKeywords] = useState<string>();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [loadingComplete, setLoadingComplete] = useState(false);
  const [overlay_view, set_overlay_view] = useState<any>();
  const inputRef:{current:any} = useRef();

  useEffect(()=>{
    
  },[]);


  const open = useCallback((callback:any)=>{
    console.log('open=====>>>>');
    // use_ref.current = {
    //   callback: callback
    // };
    // setModalVisible(true);
    const _ov = Overlay.show(overlayView);
    set_overlay_view(_ov)
  },[]);
  const close = useCallback(()=>{
    console.log('123456')
    // setModalVisible(false);
    Overlay.hide(overlay_view)
  },[]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));


  const { hasPermission, requestPermission } = useCameraPermission()

  // const { hasPermission, requestPermission } = useMicrophonePermission()
  if(!hasPermission){
    requestPermission()
  }

  console.log('hasPermission-====>>',hasPermission);

  const device = useCameraDevice('back');//受权后才会有
  const camera = useRef<Camera>(null)
  // console.log('device=====>>>',device);

  const overlayView = <Overlay.View
    style={{alignItems: 'center', justifyContent: 'center'}}
    modal={false}
    overlayOpacity={1}
    >
    <Text 
    onPress={async ()=>{
      // console.log('12345',camera?.current)
      // const photo = await camera?.current?.takePhoto({
      //   qualityPrioritization: 'speed',
      //   flash: 'on',
      //   enableShutterSound: false,
      //   enableAutoRedEyeReduction: true,
      // });
      

      const photo = await camera?.current?.startRecording({
        onRecordingFinished: (video) => {
          console.log('onRecordingFinished===>>>',video)
        },
        onRecordingError: (error) => {
          console.error('onRecordingError====>',error)
        }
      });
      console.log('photo====>>>',photo)
    }}>拍摄</Text>
    <Text onPress={async()=>{
      await camera?.current?.stopRecording()
    }}>停止</Text>
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
        />
      }
    </Vw>
    <Vw style={styles.bottomBtn}>
      <Text>123</Text>
      <Vw style={styles.captureBtnWrapper}>
        <Text>轻触拍照，长按摄像</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.captureBtn}
        ></TouchableOpacity>
      </Vw>
      <Text>5</Text>
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
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection:'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  captureBtnWrapper:{
    
  },
  captureBtn:{
    width: 100,
    height: 100,
    backgroundColor: '#ffff' 
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
