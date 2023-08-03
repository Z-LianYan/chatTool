// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * Generated with the TypeScript template
//  * https://github.com/react-native-community/react-native-template-typescript
//  *
//  * @format
//  */

//  import React, { useState,useEffect, useCallback } from 'react';
//  import { useNavigation } from '@react-navigation/core';
//  import { observer, inject } from 'mobx-react'
//  import Ionicons from 'react-native-vector-icons/Ionicons';
//  import {
//    SafeAreaView,
//    ScrollView,
//    StatusBar,
//    StyleSheet,
//    useColorScheme,
//    Platform,
//    ActivityIndicator,
//    Image,
//    TouchableOpacity,
//    TouchableHighlight,
//    View as Viw,
//    Text as Txt,
//    Dimensions
//  } from 'react-native';
 
//  import { 
//    NavigationContainer,
//    DarkTheme,
//    DefaultTheme, 
//  } from '@react-navigation/native';
//  import { 
//    View,
//    Text
//  } from './customThemed';
//  import { 
//    Button,
//    Carousel,
//    NavigationBar,
//    Theme,
//    Label,
//    Overlay
//  } from '../component/teaset/index';
//  import PropTypes, { number } from 'prop-types';
//  import { 
//    DETAIL_AVATAR
//  } from '../assets/image/index';
 
//  import { get_film_hot } from '../api/film';
//  var ScreenWidth = Dimensions.get('window').width;


//  let overlayView = function(colorScheme:any,items:string[]=[],onSelected:any){
//    return <Overlay.PullView side='bottom' modal={false}>
     
//      {
//        items.map((item:any,index:number)=><TouchableOpacity 
//        key={item} 
//        activeOpacity={0.5} 
//        style={{
//         height:50,
//         alignItems:'center',
//         justifyContent:'center',
//         backgroundColor:colorScheme=='dark'?'#000':'#fff',
//         borderTopWidth:index==0?0.5:0,
//         borderTopColor:colorScheme=='dark'?'#1a1b1c':'#ccc',
//         borderBottomWidth:(index+1)==items.length?0:0.5,
//         borderBottomColor:colorScheme=='dark'?'#1a1b1c':'#ccc'
//       }}
//       onPress={()=>{
//         onSelected && onSelected(item);
//       }}>
//         <Text style={{color:colorScheme=='dark'?'#fff':'#000'}}>{item}</Text>
//       </TouchableOpacity>)
//      }
//     <View style={{height:5,backgroundColor:colorScheme=='dark'?'#1a1b1c':'#f4f4f4'}}></View>
//     <TouchableOpacity activeOpacity={0.9} style={{
//       height:50,
//       alignItems:'center',
//       justifyContent:'center',
//       backgroundColor:colorScheme=='dark'?'#000':'#fff',
//     }}
//     onPress={()=>{
//       onSelected && onSelected('取消');
//     }}>
//       <Text style={{color:colorScheme=='dark'?'#fff':'#000'}}>取消</Text>
//     </TouchableOpacity>
//  </Overlay.PullView>
//  };


//  type TypeProps = {
   
//  }
//  const CommentItem = ({
//   isShowMineCommentTag, //是否显示我的评分tag
//   commentContent, //评论内容
//   scoreText, //评分
//   avatar, //头像
//   separator, //分割线
//   messageNum, //回复评论数
//   dzNum, //点赞数
//   date, //评论日期
//   isShowMenuBtn, //是否显示菜单按钮
//   nickname, //评论人名称
//   replyName, //回复人
//   actionsOption, //菜单设置项
//   onAction, //选中菜单项返回事件
//   onThumbUp, //点赞按钮事件
//   onReplyMessage, //右边的信息按钮
//   userInfo, //用户信息
//   history, //路由历史对象
//   onReplyTextBtn, //左边回复按钮事件
//   children, //插槽
//   itemPaddingTop,
//   itemPaddingRight,
//   itemPaddingBottom,
//   itemPaddingLeft,
//   isShowUnfoldPackUp, //是否显示展开收起按钮
//   // showUnfold, //显示展开
//   // showPackUp,//显示收起
//   // onUnfold,
//   // onPackUp,
//   isLoading,
//   bottomNode,
//   alreadyThumbUp, //判断当前用户是否点赞过
//  }:any) => {
//    const colorScheme = useColorScheme();
//    const [isShowUnfold,setIsShowUnfold] = useState(true);
//    const navigation:any = useNavigation();
//   //  const [_overlay,setOverlay] = useState<any>(null);
   
//    useEffect(()=>{
//    })
 
//    const renderStart = useCallback(()=>{
     
//    },[])
 
//    return <View
//       style={{
//         ...styles.commentItemContainer,
//         paddingTop:itemPaddingTop,
//         paddingBottom:itemPaddingBottom,
//         paddingLeft:itemPaddingLeft,
//         paddingRight:itemPaddingRight,
//       }}
//     >
//       <View style={styles.leftWrapper}>
//         <Image 
//         resizeMode='cover' 
//         key={avatar}
//         style={styles.avatar} 
//         source={avatar?{uri: avatar }:DETAIL_AVATAR} />
//       </View>
//       <View 
//       style={styles.rightWrapper}>
//         <View style={styles.head}>
//           <View 
//           style={styles.nicknameScore}>
//             <View 
//             style={{
//               ...styles.nickname,
//               maxWidth: 115,
//               // flex:1
//             }}
//             className="nickname">
//               <View
//                 style={{
//                   ...styles.nk,
//                   // maxWidth: replyName ? 27 : "" 
//                 }}
//               >
//                 <Txt numberOfLines={1}>{nickname}</Txt>
//               </View>
//               {replyName && (
//                 <View style={styles.rp} >
//                   <Ionicons 
//                   name={'ios-caret-forward-outline'}
//                   size={14} 
//                   color={colorScheme=='dark'?'#fff':'#000'}/>
//                   <Txt numberOfLines={1}>{" "}{replyName}</Txt>
//                 </View>
//               )}
//             </View>
//             <View style={styles.scoreBox}>
//               {isShowMineCommentTag && (
//                 <Txt style={styles.tagItem}>
//                   我的评价
//                 </Txt>
//               )}
//               {scoreText && <Txt style={styles.scoreText}>{scoreText}</Txt>}
//             </View>
//           </View>
//           {isShowMenuBtn && (
//             <Ionicons 
//             name={'md-ellipsis-horizontal'}
//             size={20} 
//             color={colorScheme=='dark'?'#fff':'#000'}
//             onPress={()=>{
//               let ol = Overlay.show(overlayView(colorScheme,actionsOption,(val:string)=>{
//                 if(val==='取消'){
//                   Overlay.hide(ol);
//                   return;
//                 }
//                 if (!userInfo) {
//                   navigation.navigate({
//                     name: "LoginPage",
//                   });
//                 }else{
//                   onAction(val)
//                 }

//                 Overlay.hide(ol);

//               }));
//             }}/>
//           )}
//         </View>
//         <Txt style={styles.commentContent}>{commentContent}</Txt>
//         <View 
//         style={styles.bottomBox}>
//           <View 
//           style={styles.leftDate}>
//             <Txt style={{color:'#ccc'}}>{date}{" "}</Txt>
//             {onReplyTextBtn && (
//               <Txt
//                 style={styles.replyTextBtn}
//                 onPress={() => {
//                   if (userInfo) {
//                     onReplyTextBtn && onReplyTextBtn();
//                   } else {
//                     navigation.navigate({
//                       name: "LoginPage",
//                     });
//                   }
//                 }}
//               >
//                 回复
//               </Txt>
//             )}
//           </View>
//           <View 
//           style={styles.rightDzMessage}>
//             {onThumbUp && (
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{
//                   ...styles.onThumbUpWrapper,
//                   borderColor:alreadyThumbUp?Theme.primaryColor:'#999'
//                 }}
//                 onPressIn={() => {
//                   if (userInfo) {
//                     onThumbUp && onThumbUp();
//                   } else {
//                     navigation.navigate({
//                       name: "LoginPage",
//                     });
//                   }
//                 }}
//               >
//                 <Ionicons 
//                 name={'ios-thumbs-up-sharp'}
//                 size={13} 
//                 color={alreadyThumbUp?Theme.primaryColor:'#999'}/>
//                 <Txt style={{marginLeft:3,color:alreadyThumbUp?Theme.primaryColor:'#999'}}>{dzNum||0}</Txt>
//               </TouchableOpacity>
//             )}
//             {onReplyMessage && (
//               <Txt
//                 style={styles.message}
//                 onPress={() => {
//                   onReplyMessage && onReplyMessage();
//                 }}
//               >
//                 {messageNum}
//               </Txt>
//             )}
//           </View>
//         </View>
//         {isShowUnfold && Array.isArray(children)
//           ? children.map((item) => {
//               return item;
//             })
//           : children}
//         {bottomNode}
        
//         {separator ? <View style={styles.line}></View> : null}
//       </View>
//     </View>;
//  };
 
//  const styles = StyleSheet.create({
//   commentItemContainer:{
//     flexDirection:'row',
//     padding:15
//   },
//   leftWrapper:{
//     flexDirection:'row',
//     justifyContent: 'center',
//     marginRight: 10,
    
//   },
//   avatar:{
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//   },
//   rightWrapper:{
//     flex: 1
//   },
//   head:{
//     flexDirection:'row',
//     justifyContent: 'space-between',
//     // alignItems: 'center'
//   },
//   nicknameScore:{
//     fontSize: 13
//   },
//   nickname:{
//     marginBottom: 3,
//     color: '#000',
//     flexDirection:'row',
//     // justifyContent: 'center',
//   },
//   nk:{
//     marginRight: 3
//   },
//   rp:{
//     maxWidth: ScreenWidth - 200,
//     flexDirection:'row',
//     alignItems:'center'
//   },
//   scoreBox:{
//     flexDirection:'row',
//     color: '#999',
//     fontSize: 13,
//     alignItems:'center'
//   },
//   tagItem:{
//     fontSize: 10,
//     marginRight: 10,
//     padding:2,
//     borderWidth:1,
//     borderColor:Theme.primaryColor,
//     borderRadius:5,
//     color:Theme.primaryColor,
//     textAlign:'center'
//   },
//   scoreText:{
//     color:'#ccc'
//   },
//   commentContent:{
//     paddingVertical: 10,
//     // color: '#666'
//   },
//   bottomBox:{
//     flexDirection:'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom:10,
//     fontSize: 13,
//     color: '#999'
//   },
//   leftDate:{
//     flexDirection:'row',

//   },
//   replyTextBtn:{
//     color: '#605d5d'
//   },
//   rightDzMessage:{
//     flexDirection:'row',
//     justifyContent: 'center'
//   },
//   onThumbUpWrapper:{
//     paddingVertical:0.5,
//     paddingHorizontal:5,
//     borderWidth:1,
//     // borderColor:'#666',
//     borderRadius:10,
//     flexDirection:'row',
//     alignItems:'center'
//   },
//   message:{

//   },
//   line:{
//     height: 1,
//     background: '#eee'
//   }
//  });
 
//  export default CommentItem;
 