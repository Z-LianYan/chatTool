/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState,useEffect, useCallback,useImperativeHandle,forwardRef } from 'react';
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
  Alert
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
  AlbumView
} from './teaset/index';

import ImageViewer from 'react-native-image-zoom-viewer';
import { ALBUM_ICON, LOADING_ICON, PLAY_ICON } from '../assets/image';
// import CameraRoll from "@react-native-community/cameraroll";
type TypeProps = {
  // index?: number,
  // images: any[],
  item: any,
  onClick?: ()=> void
}


const ImageVideo = ({
  // index = 0,
  // images = [],
  item,
  onClick,
}:TypeProps,ref:any) => {
  const colorScheme = useColorScheme();
  const ScreenHeight = Dimensions.get('window').height;

  const [loading,setLoading] = useState<boolean>(false);
  const [progress,setProgress] = useState<number>(0);

  useEffect(()=>{
  })

  const renderStart = useCallback(()=>{

  },[])

  const open = useCallback(({}:any)=>{
    
  },[])
  const close = useCallback(()=>{
  },[])

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  const renderLoad = useCallback(()=>{
    return <ActivityIndicator animating={true} size={"large"} />
  },[]);

  const savePhoto = useCallback((url:string)=>{
    console.log('url====>>',url)
  },[]);

  return  <Vw style={styles.container}>
      <Image 
      resizeMode="cover"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 8
      }} 
      // defaultSource={ALBUM_ICON}
      source={{uri: item.msg_content+(['video'].includes(item?.msg_type)?'?vframe/jpg/offset/0':'')}}
      // source={{uri: item.msg_content}}
      onProgress={({ nativeEvent: { loaded, total } })=>{//下载进度的回调事件。
        const val:any = loaded/total * 100;
        setProgress(val.toFixed(0))
      }}
      onLoadStart={()=>{//加载开始时调用。
        setLoading(true);
      }}
      onLoad={()=>{//加载成功完成时调用此回调函数。
        setTimeout(() => {
          setLoading(false);
        },200);
      }}
      onLoadEnd={()=>{//加载结束后，不论成功还是失败，调用此回调函数。
        // setLoading(true);
      }}
      onError={({ nativeEvent: { error }})=>{//当加载错误的时候调用此回调函数。
        console.log('err=====>>>',error);
      }}/>
      <TouchableOpacity 
      style={styles.operatorWrapper}
      activeOpacity={0.6}
      onPress={()=>{
        onClick && onClick()
      }}>
        {
          loading && <Image 
          style={styles.loadingIcon} 
          source={LOADING_ICON}/>
        }
        {
          loading && <Text style={styles.progressTxt}>{progress}%</Text>
        }


        {
          !loading && ['video'].includes(item?.msg_type) && <Image 
          style={styles.loadingIcon} 
          source={PLAY_ICON}/>
        }


      </TouchableOpacity>
  </Vw>;
};

const styles = StyleSheet.create({
  container:{
    width: 80,
    height: 120,
    position: 'relative',
    
  },
  operatorWrapper:{
    borderRadius: 8,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    alignItems: "center",
    justifyContent:"center"
  },
  loadingIcon:{
    width: 40,
    height: 40,
    tintColor: '#fff'
  },
  progressTxt:{
    fontSize: 10
  }
});

export default forwardRef(ImageVideo);
