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
 import Ionicons from 'react-native-vector-icons/Ionicons';
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
   Dimensions,
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
   NavigationBar,
   Theme,
   Label,
   Overlay,
   Input,
   Toast
 } from '../component/teaset/index';

 import {
  get_comment_list,
  thumb_up,
  get_comment_reply_list,
  add_comment_reply,
  del_comment_reply,
  del_comment,
  comment_jubao,
} from "../api/comment";
import { string } from 'prop-types';
 
var ScreenWidth = Dimensions.get('window').width;

type TypeProps = {
   
 }
 const CustomAlert = ({}:any,ref:any) => {
   const colorScheme = useColorScheme();
   const navigation:any = useNavigation();
   const [isShow,setShow] = useState(false);
   const [content,setContent] = useState<any>('');
   const [title,setTitle] = useState<any>('');
   
   useEffect(()=>{
   })
 
  const open = useCallback((title,content)=>{
    setTitle(title);
    setContent(content);
    setShow(true);
  },[]);
  const close = useCallback(()=>{
    setTitle('');
    setContent('');
    setShow(false)
  },[])
  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  
  
  return <Modal
  animationType={"fade"}//'none', 'slide', 'fade'
  transparent={true}
  visible={isShow}
  onRequestClose={()=>{
    close()
  }}
  >
    <View style={styles.container}>
      
      <SafeAreaView style={{flex:1}}>
        <TouchableOpacity 
        activeOpacity={1}
        onPress={()=>{
          // close();
        }}
        style={styles.touchableOpacityBox}>
          <View style={styles.maskContainer}>
            <TouchableOpacity 
            activeOpacity={1} 
            onPress={()=>{
              close();
            }}
            style={{flex:1}}></TouchableOpacity>
          </View>
          <View style={styles.contentWrapper}>
            <View style={styles.titleTextBox}>
              {typeof title=='string'||'number'?<Text style={styles.titleText}>{title}</Text>:title}
            </View>
            <View style={styles.contentTextBox}>
              {typeof content=='string'||'number'?<Text style={styles.cententText}>{content}</Text>:content}
            </View>
            <View style={styles.btnWrapper}>
              <Button style={{borderWidth:0,backgroundColor:'transparent'}} title="我知道了" onPress={()=>{
                close();
              }}></Button>
            </View>
            
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
   </Modal>;
 };
 
 const styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:'transparent',
    // opacity:0.5,
    position:'relative',
  },
  maskContainer:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    top:0,
    backgroundColor:'#000',
    opacity:0.5,
    zIndex:-10,
  },
  touchableOpacityBox:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  contentWrapper:{
    width: ScreenWidth - 60,
    borderRadius: 5,
    padding:1,
    borderWidth:1,
    borderColor:'#ccc'
  },
  titleTextBox:{
    paddingTop:10
  },
  titleText:{
    textAlign:'center',
    fontSize:20
  },
  contentTextBox:{
    paddingHorizontal:10,
    // width:100,
    // flexWrap:'wrap'
    // flex:1,
    // flexDirection:'row'
  },
  cententText:{
    marginVertical:20
  },
  btnWrapper:{
    // borderBottomColor:'#ccc',
    borderTopColor:'#ccc',
    // borderBottomWidth:0.5,
    borderTopWidth:0.5,
    paddingVertical:10
  }
  
 });
 
 export default forwardRef(CustomAlert);
 