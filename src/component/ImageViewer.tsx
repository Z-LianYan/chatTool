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
  View as Viw,
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
} from '../component/teaset/index';

import ImageViewer from 'react-native-image-zoom-viewer';
// import CameraRoll from "@react-native-community/cameraroll";
type TypeProps = {
  // index?: number,
  // images: any[],
  style?: object
}


const ImageViewerComponent = ({
  // index = 0,
  // images = [],
  style
}:TypeProps,ref:any) => {
  const colorScheme = useColorScheme();
  const ScreenHeight = Dimensions.get('window').height;

  const [visibleModal,setVisibleModal] = useState(false)
  const [currentIndex,setCurrentIndex] = useState(0);
  const [images,setImages] = useState([])
  useEffect(()=>{
  })

  const renderStart = useCallback(()=>{

  },[])

  const open = useCallback(({imgs,index}:any)=>{
    if(!imgs || !imgs.length) return
    setCurrentIndex(index);
    setImages(imgs);//imgs [{url:''}]
    setVisibleModal(true)
  },[])
  const close = useCallback(()=>{
    setVisibleModal(false)
  },[])

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  const renderLoad = useCallback(()=>{
    return (
      <View style={{ marginTop: (ScreenHeight / 2) - 20 }}>
          <ActivityIndicator animating={true} size={"large"} />
      </View>
  )
  },[]);

  const savePhoto = useCallback((url:string)=>{
    console.log('url====>>',url)
  },[]);

  return <Modal
  animationType={"slide"}
  transparent={true}
  visible={visibleModal}
  // statusBarTranslucent={true}//确定您的模态是否应位于系统状态栏下。
  onRequestClose={()=>{
    close()
  }}
  >
    <ImageViewer 
    imageUrls={images}
    enableImageZoom={true} // 是否开启手势缩放
    saveToLocalByLongPress={false} //是否开启长按保存
    index={currentIndex} // 初始显示第几张
    // failImageSource={} // 加载失败图片
    loadingRender={renderLoad}
    enableSwipeDown={false}
    menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
    // onChange={(index:number) => { }} // 图片切换时触发
    onClick={() => { // 图片单击事件
      close()
    }}
    onSave={(url:string) => { 
      savePhoto(url)
    }}/>

    
  </Modal>;
};

const styles = StyleSheet.create({
});

export default forwardRef(ImageViewerComponent);
