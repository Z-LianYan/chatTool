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
  Toast
} from '../component/teaset/index';

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


const ImageViewerComponent = ({
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
    // StatusBar.setHidden(true);
    if(!imgs || !imgs.length) return
    setCurrentIndex(index);
    setImages(imgs);//imgs [{url:''}]
    setVisibleModal(true)

    if(Platform.OS == "android") StatusBar.setBackgroundColor('#000000');
  },[])
  const close = useCallback(()=>{
    setVisibleModal(false);
    
    if(Platform.OS == "android") StatusBar.setBackgroundColor(MyThemed[colorScheme||'light'].bg);
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

    // saveToCameraRoll(url)
  
  },[]);

  // const isLocalFile = (path:any) => {
  //   // 本地⽂件路径的常⻅前缀
  //   const localFilePrefixes = ['file://', '/'];
  //   // 检查⽂件路径是否以本地⽂件前缀开始
  //   for (const prefix of localFilePrefixes) {
  //   if (path.startsWith(prefix)) {
  //   return true; // 是本地⽂件
  //   }
  //   }
  //   // 如果不是本地⽂件前缀开头，则可能是⽹络⽂件
  //   return false;
  // };
  // const saveToCameraRoll = async (imageUrl:any) => {
  //   if(isLocalFile(imageUrl)) {
  //     console.log('哈哈哈哈😂',imageUrl)
  //     // 使⽤ CameraRoll 保存图⽚到相册
  //     // CameraRoll.saveToCameraRoll(imageUrl, 'photo')
  //     const result:any = CameraRoll.save(imageUrl, { type: "auto" });
  //     console.log('1111111---->>',result);
  //     if(result){
  //       console.log('1111111')
  //       Toast.message('已成功保存到相册');
  //     }else{
  //       Toast.fail('保存失败');
  //     }
  //     return
  //   }
  //   try {
  //     // const index = imageUrl.lastIndexOf('.');
  //     // const suffix = imageUrl.slice(index+1);
  //     // 下载⽹络图⽚到本地
  //     const response = await RNFetchBlob.config({
  //       fileCache: true,
  //       // appendExt: suffix, // 可以根据需要更改⽂件扩展名 
  //     }).fetch('GET', imageUrl);
  //     const imagePath = response.path();
  //     console.log("imagePath========>>>",imagePath);
  //     // 将本地图⽚保存到相册
  //     const result:any = CameraRoll.save(imagePath, { type: "auto" });
  //     if (result) {
  //       Toast.message('已成功保存到相册');
  //     } else {
  //       Toast.fail('保存失败');
  //     }
  //   } catch (error) {
  //     Toast.fail('保存失败');
  //   }
  // }

  return <Modal
  animationType={"fade"}// slide,fade,none
  transparent={false}
  visible={visibleModal}
  statusBarTranslucent={false}//确定您的模态是否应位于系统状态栏下。
  onRequestClose={()=>{
    close()
  }}>
      <ImageViewer 
      ref={imageViewerRef}
      renderIndicator={(a,b)=>{
          return <Text style={{color:'#fff'}}></Text>
      }}
      // renderFooter={()=>{
      //   return <Text style={{height: 15,width: '100%',borderWidth:1,borderColor:"red"}}>1234567</Text>
      // }}
      menus={({cancel,saveToLocal})=>{
        return <TouchableOpacity style={{
          flex:1,
          justifyContent: 'flex-end',
          marginBottom: StatusBarManager.HEIGHT,
          position: 'relative'
        }}
        onPress={()=>{
          cancel()
        }}>
          <Vw style={{
            position: "absolute",
            top: -StatusBarManager.HEIGHT,
            left: 0,
            right: 0,
            bottom: -StatusBarManager.HEIGHT,
            
            // paddingBottom:  StatusBarManager.HEIGHT,
            // marginBottom:  StatusBarManager.HEIGHT
            justifyContent: 'flex-end',
          }}>
            <Vw style={{
              flex:1,
              backgroundColor: "#000",
              opacity: 0.6,
            }}></Vw>
            <Vw style={{
              backgroundColor: "#181818",
              height: 30
            }}></Vw>
          </Vw>
          <TouchableOpacity style={{
            backgroundColor: "#181818",
            paddingVertical: 15,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomWidth: 0.3,
            borderColor: MyThemed[colorScheme||'light'].hdbrBmCr,
          }}
          activeOpacity={1}
          onPress={()=>{
            saveToLocal()
          }}>
            <Text style={{
              textAlign:'center',
              color: '#fff'
            }}
            selectable={false}>保存到相机</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: "#181818",
            paddingVertical: 15,
          }}
          activeOpacity={1}
          onPress={()=>{
            cancel()
          }}>
            <Text style={{
              textAlign:'center',
              color: '#fff',
            }}>取消</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      }}
      footerContainerStyle={{
        bottom: 13
      }}
      enablePreload={true}//启用预加载
      imageUrls={images}
      enableImageZoom={true} // 是否开启手势缩放
      saveToLocalByLongPress={true} //是否开启长按保存
      index={currentIndex} // 初始显示第几张
      // failImageSource={} // 加载失败图片
      loadingRender={()=>{
        return <ActivityIndicator animating={true} size={"large"} />
      }}
      enableSwipeDown={false}
      // menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
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
  // a:{
  // }
});

export default inject("AppStore","MyThemed","FriendsStore")(observer(forwardRef(ImageViewerComponent)));
