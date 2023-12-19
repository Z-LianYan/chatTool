/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState,useEffect, useCallback,useImperativeHandle,forwardRef, useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react'
// import Ionicons from 'react-native-vector-icons/Ionicons';
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
  View as Vw,
  Text as Txt,
  Modal,
  RefreshControl,
  Dimensions,
  Alert,
  NativeModules,
  PermissionsAndroid,
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
  NavigationBar,
  Theme,
  AlbumView,
  Toast,
  Overlay
} from './teaset/index';

import ImageViewer from 'react-native-image-zoom-viewer';

import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import RNFetchBlob from "rn-fetch-blob";
import { saveToCameraRoll } from '../utils/tool';

type TypeProps = {
  // index?: number,
  // images: any[],
  style?: object,
  MyThemed?: any,
}


const ImageViewer2 = ({
  // index = 0,
  // images = [],
  style,
  MyThemed
}:TypeProps,ref:any) => {
  const colorScheme = useColorScheme();
  const { StatusBarManager } = NativeModules;
  

  const [visibleModal,setVisibleModal] = useState(false)
  const [currentIndex,setCurrentIndex] = useState(0);
  const [images,setImages] = useState([])
  const imageViewerRef:{current:any} = useRef();

  const navigation:any = useNavigation();
  useEffect(()=>{

    return ()=>{
    }
  })
  
  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if ((Platform as any).Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }
    };
  
    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if ((Platform as any).Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          (statuses) =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };
  
    return await getRequestPermissionPromise();
  }

  const open = useCallback(({imgs,index}:any)=>{
    console.log('234567----open');
    (this as any).overlayKey = Overlay.show(overlayView);
    // StatusBar.setHidden(true);
    // if(!imgs || !imgs.length) return
    // setCurrentIndex(index);
    // setImages(imgs);//imgs [{url:''}]
    // setVisibleModal(true)

    // if(Platform.OS == "android") StatusBar.setBackgroundColor('#000000');
  },[])
  const close = useCallback(()=>{
    // setVisibleModal(false);
    
    
    // if(Platform.OS == "android") StatusBar.setBackgroundColor(MyThemed[colorScheme||'light'].bg);
    Overlay.show((this as any).overlayKey)

  },[])

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));


  const savePhoto = useCallback(async (url:string)=>{
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    if(Platform.OS === "ios") {
      CameraRoll.save(url, { type: "auto" })
    }else{
      saveToCameraRoll(url)
    }

  
  },[]);


  const overlayView = useCallback(()=>{
    return <Overlay.View
    onCloseRequest={()=>{}}
    style={{
        alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{color: '#fff',width: 200,height:500,backgroundColor:'red'}}>123456</Text>
    </Overlay.View>;
  },[]);

  return null;
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(forwardRef(ImageViewer2)));
