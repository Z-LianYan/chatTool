/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState,useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
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
  View as Viw,
  Text as Txt,
  PermissionsAndroid,
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
  Overlay,
  Checkbox,
  ModalIndicator,
  Toast,
} from './teaset/index';
import PropTypes, { number } from 'prop-types';

import { scaleView as sv, scaleText as st } from '../utils/scaleSize';

import CustomListRow from './CustomListRow';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { get_upload_qiuniu_config } from "../api/common";
import HttpUtils from "../utils/request";
import * as Api from '../api/constant';
import { result } from 'lodash';
import myConfig from '../config';
import dayjs from 'dayjs';
import * as qiniu from 'qiniu-js';
import { ADD_ICON, RIGHT_ARROW } from '../assets/image';

type TypeProps = {
  onBeforeUpload?:(val:any[])=> any,
  onAfterUpload?:(val:any[])=> void,
  onUploadFail?:(val:any)=> void
  width?: number
  height?: number,
  borderRadius?: number,
  fileList?: any[],
  MyThemed?: any,
}
const UploadFile = ({
  width=100,
  height=100,
  borderRadius=5,
  fileList = [],
  onBeforeUpload,
  onAfterUpload,
  onUploadFail,
  MyThemed,
}:TypeProps) => {
  const colorScheme = useColorScheme();
  // const [overlay_view,set_overlay_view] = useState(null)
  const [file_list,set_file_list] = useState<any[]>([])
  const [percent,setPercent] = useState(0);
  const [isUplaodIng,setIsUplaodIng] = useState(false);

  useEffect(()=>{
    fileList = fileList.filter(item=>item && item.uri);
    set_file_list(fileList);
  },[fileList])
  
  // const uploadImage = useCallback(async (_file,callBack)=>{
  //   try{
  //     const token = await get_upload_qiuniu_config();
  //     console.log('---->>>token',token);


  //     const file = onBeforeUpload ? await onBeforeUpload(_file): _file;
      
  //     const formData = new FormData()
      
  //     for(const item of file){
  //       formData.append('file', {
  //         uri: item.uri, 
  //         type: item.type,
  //         name: item.fileName,
  //       });
  //     }
  //     console.log('上传----FormData',formData);
  //     const result:any = await upload_file(formData);

  //     console.log('上传----》〉》',result)
  //     if(result && result.file_list.length) {
  //       const fileList = []
  //       for(const item of result.file_list){
  //         fileList.push({
  //           uri: item.url
  //         });
  //       }
  //       onAfterUpload && onAfterUpload(fileList);
  //     }
  //   }catch(err){
  //     console.log('上传catch------》〉',err)
  //     onUploadFail && onUploadFail(err);
  //     Alert.alert(
  //       "错误提示",
  //       '上传失败！！！',
  //       [
  //         {
  //           text: "",
  //           onPress: () => {

  //           },
  //           style: "cancel"
  //         },
  //         { text: "关闭", onPress: async () => {}}
  //       ]
  //     );
  //   }finally{
  //     callBack && callBack();
  //   }
    
  // },[])

  function getExtName(str:string) {
    var index = str.lastIndexOf(".");
    return str.slice(index);
  }

  const uploadImage = useCallback(async (_file:any)=>{
    _file = onBeforeUpload ? await onBeforeUpload(_file): _file;
    const file = _file[0];
    // console.log('压缩----》〉前',file)
    // const data:any = await qiniu.compressImage(file, {
    //   quality: 0.92,
    //   noCompressIfLarger: true
    // }).then(datas=>{
    //   console.log('压缩----》〉datas',datas)
    // }); 

    // console.log('压缩----》〉',data)
    // file = data.dist;
    try{
      const tokenConfig:any = await get_upload_qiuniu_config();
      setPercent(0);
      setIsUplaodIng(true);
      const key = `public/chatTool/userAvatar/${dayjs().format('YYYYMMDDHHmmssSSS')+String(Math.random()).substring(2,6)+getExtName(file.fileName)}`;; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。
      let config = {
        useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        region: qiniu.region.z2, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
      };
      
      let putExtra = {
        // fname: file.fileName, //文件原文件名
        // params: {}, //用来放置自定义变量
        // mimeType: ["image/png", "image/jpeg", "image/gif"], //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
      };
      console.log("key", key);
      const idx1 = file.uri.lastIndexOf('/')
      const str = file.uri.slice(idx1+1);
      const idx2 = str.lastIndexOf('.');
      const name = str.slice(0,idx2);
      let observable = qiniu.upload(
        // file,
        {
          uri: file.uri, 
          type: file.type, 
          name: name
        } as any,//文件格式需要这样子否则上传会失败
        key,
        tokenConfig.upload_token,
        putExtra,
        config
      );
      observable.subscribe({
        next: (res) => {
          // 主要用来展示进度
          let total:any = res.total;
          setPercent(total.percent.toFixed(0))
        },
        error: (err:any) => {
          // 失败报错信息
          Toast.fail(err.message);
          onUploadFail && onUploadFail(err);
          setPercent(0);
          setIsUplaodIng(false);
        },
        complete: (res) => {
          const list = [{uri: tokenConfig.static_host+res.key}]
          set_file_list(list);
          onAfterUpload && onAfterUpload(list);
          setTimeout(() => {
            setIsUplaodIng(false);
          }, 800);
        },
      });

    }catch(err){
      Alert.alert(
        "错误提示",
        '上传失败！！！',
        [
          {
            text: "",
            onPress: () => {

            },
            style: "cancel"
          },
          { text: "关闭", onPress: async () => {}}
        ]
      );
    }finally{
    }
      
  },[]);

  const handLaunchCamera = useCallback(async (callBack:any)=>{
    try{
      callBack && callBack();
      let granted = null
      if(Platform.OS === "android"){
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "应用程序摄像头权限",
            message:"应用程序需要访问您的相机",
            buttonNeutral: "稍后询问我",
            buttonNegative: "关闭",
            buttonPositive: "授权"
          }
        );
      }
      if(granted && granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "摄像头权限被禁止,请到手机系统设置开启！！！",
          "",
          [
            {
              text: "",
              onPress: () => {

              },
              style: "cancel"
            },
            { text: "确定", onPress: async () => {
              
            }}
          ]
        );
        return;
      };

      const result:any = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
        includeExtra: false,
      });
      console.log('result----->>launchCamera',result);
      if(result && result.assets) {
        await uploadImage(result.assets);
      }
    }catch(err:any){
      Alert.alert(
        "错误提示",
        err.message,
        [
          {
            text: "",
            onPress: () => {

            },
            style: "cancel"
          },
          { text: "确定", onPress: async () => {
            
          }}
        ]
      );
    } finally {
      // callBack && callBack();
    }
    
  },[]);

  const handLaunchImageLibrary = useCallback(async (callBack:any)=>{
    try{
      callBack && callBack()
      const result:any = await launchImageLibrary({
        mediaType: 'mixed',
        quality: 1,
        selectionLimit: 2,
        includeBase64: true
      });
      if(result && result.assets) {
        await uploadImage(result.assets)
      }
    }finally{
      // callBack && callBack()
    }
    
  },[]);

  const overlay_pullview = useCallback((callBack:any)=>{
    return <Overlay.PopView 
    modal={false}
    style={{alignItems: 'center', justifyContent: 'center'}}
    containerStyle={{
      minWidth: sv(400),
      borderRadius:sv(25),
      backgroundColor: colorScheme=='dark'?'#1a1b1c':'#fff',
      // padding: sv(20)
      // paddingHorizontal: sv(20),
      // paddingVertical: sv(10)
    }}>
      {/* <CustomListRow
      accessory="indicator"
      bottomSeparator="indent" 
      title={'拍照'}
      onPress={()=>{
        handLaunchCamera(callBack)
      }}/>
      <CustomListRow
      accessory="indicator"
      bottomSeparator="none" 
      title={'从文件中选择'}
      onPress={()=>{
        handLaunchImageLibrary(callBack)
      }}/> */}
      <View
      style={{
        ...styles.rowWrapper,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}>
        <TouchableOpacity 
        activeOpacity={0.8}
        style={{
          ...styles.row,
          borderBottomColor: MyThemed[colorScheme||'light'].ftCr2,
          borderBottomWidth: 0.5,
        }}
        onPress={()=>{
          handLaunchCamera(callBack)
        }}>
          <Text>拍照</Text>
          <Image 
          style={{
            ...styles.rightArrow,
            tintColor: MyThemed[colorScheme||'light'].ftCr2,
          }} 
          source={RIGHT_ARROW}/>
        </TouchableOpacity>
      </View>
      <View
      style={{
        ...styles.rowWrapper,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      }}>
        <TouchableOpacity
        activeOpacity={0.8}
        style={{
          ...styles.row,
        }}
        onPress={()=>{
          handLaunchImageLibrary(callBack)
        }}>
          <Text>从文件中选择</Text>
          <Image 
          style={{
            ...styles.rightArrow,
            tintColor: MyThemed[colorScheme||'light'].ftCr2,
          }} 
          source={RIGHT_ARROW}/>
        </TouchableOpacity>
      </View>
      
    </Overlay.PopView>
  },[])

  return <TouchableOpacity activeOpacity={0.8} style={{
      borderColor: colorScheme=='dark'?Theme.primaryColor:Theme.primaryColor,
      borderWidth: sv(1),
      width: sv(width),
      height: sv(height),
      justifyContent:'center',
      alignItems: 'center',
      borderRadius: borderRadius,
      position:'relative'
    }}
    onPress={()=>{
      let ol = Overlay.show(overlay_pullview(()=>{
        Overlay.hide(ol);
      }));

    }}>

      {
        file_list.map((item:any,index)=>{
          if(!item.uri) return;
          return <Image
          style={{width: sv(width-2), height: sv(height -2)}}
          resizeMode="cover"
          borderRadius={borderRadius}
          source={{uri:item.uri}}
          // onLoadEnd={() => this.checkLeftRight()}
          key={"avatar"+index}
        />})
      }

      {
        !file_list.length && <Image 
        style={{
          width: sv(30),
          height: sv(30),
          tintColor: MyThemed[colorScheme||'light'].primaryColor,
        }} 
        source={ADD_ICON}/>
      }

      {
        isUplaodIng && <View 
        style={{
          position:'absolute',
          left:0,
          right:0,
          top:0,
          bottom:0,
          backgroundColor: '#ccc',
          borderRadius: borderRadius,
          opacity: 0.8,
          justifyContent:'center',
          alignItems: 'center'
        }}>
          <Text style={{fontSize: 10}}>已上传:{percent}%</Text>
        </View>
      }
  </TouchableOpacity>
};

const styles = StyleSheet.create({
  row:{
    paddingVertical: sv(30),
    // paddingHorizontal: sv(10),
    // borderWidth: 1,
    // borderColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowWrapper:{
    paddingHorizontal: sv(20),
  },
  rightArrow:{
    width: 15,
    height: 15,
  }
});

export default inject("AppStore","MyThemed")(observer(UploadFile));
