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
   Modal,
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
 
var ScreenWidth = Dimensions.get('window').width;

type TypeProps = {
   
 }
 const ReplyCommentModal = ({
  commentlist=[],
  replySuccess,
  app
 }:any,ref:any) => {
   const colorScheme = useColorScheme();
   const navigation:any = useNavigation();
   const [isShow,setShow] = useState(false);
   const [replyContent,setReplyContent] = useState('');
   const [selectReplyItem,setSelectReplyItem] = useState<any>(null);
   
   useEffect(()=>{
   })
 
  const open = useCallback((selectReplyItem)=>{
    console.log(123456+'呵呵呵',selectReplyItem);
    setSelectReplyItem(selectReplyItem);
    setShow(true);
  },[]);
  const close = useCallback(()=>{
    console.log('close')
    setShow(false)
  },[])
  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  const onReply = useCallback(async ()=>{
    // return;
    console.log(123456+'哈哈哈哈',selectReplyItem,replyContent)
    console.log(123456+'嘻嘻嘻嘻😁',replyContent)
    if(!replyContent) return Toast.show({
      // icon: 'smile',
      duration: 2000,
      text: '请输入回复内容',
      position:'top'
    });
    //  Toast.message({
    //   text:'请输入回复内容',
    //   position:'top'
    // }); 
    
    if(!selectReplyItem) return;
    try {
      let result = await add_comment_reply({
        ...selectReplyItem,
        reply_content:replyContent
      });
      
      if (!commentlist[selectReplyItem.commentlistIndex].replyList) {
        commentlist[selectReplyItem.commentlistIndex].replyList = [];
      }
      commentlist[selectReplyItem.commentlistIndex].replyList.push(result);

      if (!commentlist[selectReplyItem.commentlistIndex].backup_reply_list) {
        commentlist[selectReplyItem.commentlistIndex].backup_reply_list = [];
      }
      commentlist[selectReplyItem.commentlistIndex].backup_reply_list.push(
        result
      );

      if (!commentlist[selectReplyItem.commentlistIndex].reply_count) {
        commentlist[selectReplyItem.commentlistIndex].reply_count = 0;
      }
      commentlist[selectReplyItem.commentlistIndex].reply_count += 1;
      replySuccess && replySuccess(commentlist);
      setReplyContent('');
      close();
    } catch (err:any) {
      if (err.error == 401) {
        app.setUserInfo(null); //如果token认证过期 清空当前缓存的登录信息
        navigation.navigate({
          name: "LoginPage"
        });
      }
    }
  },[selectReplyItem,replyContent])

  
  return <Modal
  animationType={"fade"}//'none', 'slide', 'fade'
  transparent={true}
  visible={isShow}
  onRequestClose={()=>{
    close()
  }}
  statusBarTranslucent={true}
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
          <View style={{
            backgroundColor:colorScheme=='dark'?'#1a1b1c':'rgb(244, 244, 244)',
            ...styles.contentWrapper
          }}>
            <Input 
            // keyboardShouldPersistTaps="always"
            blurOnSubmit={true}
            placeholder={`回复 ${selectReplyItem?selectReplyItem.reply_person_nickname:''}：`} 
            style={{
              backgroundColor:colorScheme=='dark'?'#fff':'#fff',
              ...styles.input,
              textAlignVertical: "top"
            }}
            editable={true}//是否可编辑
            keyboardAppearance={colorScheme}//'default', 'light', 'dark'
            size='lg'
            multiline={true}
            value={replyContent}
            onChangeText={(text:any) => {
              // console.log(text)
              setReplyContent(text)
            }}
            />
            <Button 
            style={styles.button} 
            titleStyle={{color:'#fff'}} 
            title="回复" 
            size="md"
            onPress={()=>{
              onReply()
            }}></Button>
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
    justifyContent:'flex-end'
  },
  contentWrapper:{
    paddingHorizontal:20,
    paddingTop:10,
    paddingBottom:30,
    flexDirection:'row',
    alignItems:'center'
  },
  input:{
    flex:1,
    height:80,
    borderWidth:0
  },
  button:{
    backgroundColor:Theme.primaryColor,
    marginLeft:20
  }
 });
 
 export default forwardRef(ReplyCommentModal);
 