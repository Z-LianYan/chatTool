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
  Text,
  View as Vw
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import MyCell from '../../component/MyCell';
import { NEW_FIREND } from '../../assets/image';
import { View } from '../../component/customThemed';
import { getFriendList } from '../../api/friends';
// import { 
//   View,
//   Text
// } from '../component/customThemed';
const AddressBookPage = ({
  MyThemed
}:any) => {
    
  const colorScheme = useColorScheme();
  const [list,setList] = useState([]);
  const [count,setCount] = useState(0);

  useEffect(()=>{
    getAddressBookList()
  },[]);

  const getAddressBookList = useCallback(async()=>{
    try{
      const result:any = await getFriendList();
      console.log('result------>>',result);
      setList(result.rows);
      setCount(result.count);
    }catch(err:any){
      console.log('err------>>',err.message)
    }
    
  },[])
  type itemType = {
    user_name: string,
    avatar: string,
    user_id: number,
  }
  
  return <ScrollView>
    <MyCell
    title='新的朋友' 
    avatar={NEW_FIREND}
    showBottomBorder={true}
    showRightArrow={false} />
    <MyCell
    title='仅聊天的朋友' 
    avatar={NEW_FIREND}
    showBottomBorder={false}
    showRightArrow={false}/>
    <Vw style={styles.separator}></Vw>
    {
      list.map((item:itemType,index)=>{
        return <MyCell
          key={index+item.user_name}
          title={item.user_name}
          avatar={item.avatar}
          showBottomBorder={index!=list.length-1}
          />
      })
    }
    
    <Text style={{
      ...styles.bottomText,
      color: MyThemed[colorScheme||'light'].ftcr2
    }}>{count} 个朋友</Text>
  </ScrollView>;
};

const styles = StyleSheet.create({
  separator:{
    height: 30
  },
  bottomText:{
    textAlign: 'center',
    height: 50,
    lineHeight: 50,
  }
});

export default inject("AppStore","MyThemed")(observer(AddressBookPage));;
