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
import { TextInput,PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { runInAction } from 'mobx';


import {useCameraDevice,useCameraPermission,useMicrophonePermission,Camera, CameraCaptureError, useCameraFormat} from 'react-native-vision-camera';
import { AUDIO_ICON_NOT_CIRCLE, CLOSE_CIRCLE_ICON, CLOSE_FLASH, OPEN_FLASH, TURN_CAPTURE } from '../assets/image';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { result } from 'lodash';

import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import * as Progress from 'react-native-progress';

const AudioModal = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const use_ref = useRef<any>();
  // const touchableOpacityRef = useRef<any>();
  const colorScheme = useColorScheme();

  const SCREEN_WIDTH = Dimensions.get('window').width

  const [visibleModal,setVisibleModal] = useState(false);


  useEffect(()=>{

    return ()=>{
    }
  },[]);

  const open = useCallback(async (callBack:any)=>{
    use_ref.current = {
      callBack: callBack,
    };
    
    setVisibleModal(true);


  },[]);
  const close = useCallback(async()=>{
    setVisibleModal(false);
  },[]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));


  const onUseMicrophonePermission = useCallback(async ()=>{
    return new Promise(async (resolve, reject) => {
      
    })
  },[]);


  
  return <Modal
  animationType={"none"}// slide,fade,none
  transparent={true}
  visible={visibleModal}
  statusBarTranslucent={true}//确定您的模态是否应位于系统状态栏下。
  onRequestClose={()=>{
    close()
  }}>
    <Vw style={styles.maskWrapper}></Vw>
    
    <Vw style={{
      flex:1,
      justifyContent: "flex-end",
      alignItems:"center"
    }}>
      <TouchableOpacity 
      // ref={touchableOpacityRef}
      style={{
        height: Dimensions.get('window').width * 2,
        width: Dimensions.get('window').width * 2,
        borderTopLeftRadius: Dimensions.get('window').width,
        borderTopRightRadius: Dimensions.get('window').width,
        backgroundColor: "#fff",
        marginBottom: -(Dimensions.get('window').width * 2 - 150),
        alignItems: 'center',
      }}
      activeOpacity={0.9}
      onPressIn={()=>{
        // console.log('onPressIn======>>>>')
      }}
      onMagicTap={()=>{
        console.log('onMagicTap======>>>>')
      }}
      onLayout={()=>{
        // console.log('onLayout======>>>>');
      }}
      onAccessibilityAction={()=>{
        console.log('onAccessibilityAction======>>>>');
      }}
      onAccessibilityEscape={()=>{
        console.log('onAccessibilityEscape======>>>>');
      }}
      onAccessibilityTap={()=>{
        console.log('onAccessibilityTap======>>>>');
      }}
      onBlur={()=>{
        console.log('onBlur======>>>>');
      }}
      onPressOut={()=>{
        // console.log('onPressOut======>>>>111');
      }}
      onFocus={()=>{
        console.log('onFocus======>>>>')
      }}>

        <TouchableWithoutFeedback onPress={()=>{
          console.log('onPress======>>>0');
        }}>
          <Image 
          style={{
            width: 35,height:35,
            tintColor: MyThemed[colorScheme||'light'].ftCr,
            marginRight: 10,
            marginTop: 50
          }} 
          source={AUDIO_ICON_NOT_CIRCLE}/>
        </TouchableWithoutFeedback>

      </TouchableOpacity>
    </Vw>
  </Modal>;
};

const styles = StyleSheet.create({
  maskWrapper:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    opacity: 0.5
  },
  
});

export default inject("AppStore","MyThemed")(observer(forwardRef(AudioModal)));