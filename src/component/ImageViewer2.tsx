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
import Video, { PosterResizeModeType, ResizeMode } from 'react-native-video';

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
  const [imgUri,setImgUri] = useState<string>('');
  const [videoUri,setVideoUri] = useState<string>('');
  const ref2:{current:any} = useRef();
  const videoRef2:{current:any} = useRef();
  
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

  const open = useCallback(({imgUri,videoUri}:any,callBack:any)=>{
    console.log('234567----open',imgUri,videoUri);
    // (this as any).overlayKey = Overlay.show(overlayView);
    // StatusBar.setHidden(true);
    // if(!imgs || !imgs.length) return
    // setCurrentIndex(index);
    imgUri && setImgUri(imgUri);
    videoUri && setVideoUri(videoUri)
    setVisibleModal(true);
    ref2.current = {
      callBack: callBack,
    };

    // if(Platform.OS == "android") StatusBar.setBackgroundColor('#000000');
  },[])
  const close = useCallback(()=>{
    setVisibleModal(false);
    setImgUri('')
    setVideoUri('')
    // if(Platform.OS == "android") StatusBar.setBackgroundColor(MyThemed[colorScheme||'light'].bg);
    // Overlay.show((this as any).overlayKey)

  },[])

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));


  const savePhoto = useCallback(async (url:string)=>{
    console.log('点击完成=====》〉》〉',url);
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    let saveResult = null;
    if(Platform.OS === "ios") {
      saveResult = await CameraRoll.save(url, { type: "auto" })
    }else{
      const  res:any = await saveToCameraRoll(url);//保存到相册
      if(res.error===0) saveResult = res.data;
    }
    console.log('点击完成=====》〉》〉111',saveResult);
    if(saveResult){
      const id = saveResult.slice(saveResult.lastIndexOf('/')+1);
      const data = await CameraRoll.getPhotos({//获取相册
        first: 5,
      });
      console.log('reslut====>>>first111',JSON.stringify(data));
      const image = null;
      const edges = data?.edges||[];
      console.log('edges====>>>',id,edges)
      for(const item of edges){
        if(item.node.id==id) {
          ref2.current.callBack && ref2.current.callBack({
            type: item?.node?.type, 
            uri: item?.node?.image?.uri
          });
          close();
          break;
        }
      }
    }
    
  },[]);

  return <Modal
  animationType={"none"}// slide,fade,none
  transparent={true}
  visible={visibleModal}
  statusBarTranslucent={false}//确定您的模态是否应位于系统状态栏下。
  onRequestClose={()=>{
    close()
  }}>
    
    
    <Vw style={{flex:1,backgroundColor:'#000',justifyContent:'center'}}>
      <Vw style={{width: '100%',height: '80%',position:'relative'}}>
        {
          imgUri && <Image 
          resizeMode="contain"
          style={{
            flex:1,
          }} 
          source={{uri: imgUri}}/>
        }
        {
          videoUri && <Video
            resizeMode={ResizeMode.CONTAIN}
            muted={false}//控制音频是否静音
            posterResizeMode={PosterResizeModeType.CONTAIN}
            // poster={videoUri+'?vframe/jpg/offset/0'}//视频加载时显示的图像
            // repeat={true}
            // paused={true}
            // pictureInPicture={true}
            // reportBandwidth={true}

            // fullscreen={true}
            // hideShutterView={true}
            // Can be a URL or a local file.
            source={{uri: videoUri}}
            rate={1.0}
            repeat={true}
            // Store reference  
            ref={videoRef2}
            controls={false}
            // Callback when remote video is buffering                                      
            onBuffer={(value)=>{
              console.log('onBuffer=====>>>',value)
            }}
            // Callback when video cannot be loaded              
            onError={(onError)=>{
              console.log('onError=====>>>2',onError)
            }}  
            onEnd={()=>{
              console.log('onEnd=====>>>',videoRef2.current)
              // videoRef2.current?.resume()
            }}
            onFullscreenPlayerDidDismiss={()=>{
              console.log('onFullscreenPlayerDidDismiss=====>>>')
              // setVideoSourceUri("")
              // videoRef.current?.pause();
              // videoRef.current?.dismissFullscreenPlayer();
            }}         
            style={{
              flex:1,
            }}
          />
        }


        <Vw style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          justifyContent:'space-around',
          flexDirection:'row',
        }}>
          <Button
            style={{
              width: 80,
              height: 35,
              borderColor: '#fff'
            }}
            title={'取消'}
            type="default"
            titleStyle={{
              color: '#fff'
            }}
            onPress={() => {
              close()
            }}
          />
          <Button
            style={{
              width: 80,
              height: 35,
            }}
            title={'完成'}
            type="primary"
            onPress={() => {
              savePhoto(imgUri||videoUri);
            }}
          />
        </Vw>
      </Vw>
    </Vw>
  </Modal>;
};

const styles = StyleSheet.create({a:{justifyContent:'space-between'}
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(forwardRef(ImageViewer2)));
