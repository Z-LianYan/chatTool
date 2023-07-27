
 import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  // View,
  // Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  useColorScheme,
  View as Viw,
  Text as Txt
} from 'react-native';
import { 
  Carousel,
  Theme,
  Button
} from './teaset/index';
import { 
  View,
  Text
} from './Themed';
import { 
  EMPTY_CONTENT
} from '../assets/image';

const BottomLoading = ({
  isLoading = true,
  isFinallyPage = false,
  hasContent = true,
  emptyText = '暂无内容哦',
}:{
  isLoading:boolean,
  isFinallyPage:boolean,
  hasContent:boolean,
  emptyText?:string
})=>{
  const colorScheme = useColorScheme();
  return <Viw>
    {isLoading?<Viw style={{
      height:50,
      justifyContent:'center',
      }}>
        <ActivityIndicator/>
      </Viw>:hasContent?(isFinallyPage?<Text 
      style={{
        color:Theme.toastIconTintColor,
        height:50,
        lineHeight:50,
        textAlign:'center'
      }}>兄弟没有了哦</Text>:<Text 
      style={{
        height:50,
        lineHeight:50,
        textAlign:'center'
      }}>上拉加载更多</Text>):<Viw style={{
        height:150,
        alignItems:'center',
        justifyContent:'center'
      }}>
      <Image
        style={{width:50,height:50}}
        source={EMPTY_CONTENT}
      />
      <Text 
      style={{
        color:'#ccc',
        textAlign:'center'
      }}>{emptyText}</Text>
    </Viw>
    }
  </Viw>
}
export default BottomLoading;
 