import React, { useState,useEffect, useCallback, useRef } from 'react';
import { useNavigation,StackActions } from '@react-navigation/core';
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
  Alert,
  View as Vw,
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
} from '../../component/customThemed';
import { 
  Button,
  Carousel,
  // NavigationBar,
  Theme,
  ListRow,
  Toast,
  Input,
  Overlay,
  Label
} from '../../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import CustomListRow from '../../component/CustomListRow';
import NavigationBar from '../../component/NavigationBar';
import { login_out } from "../../api/user";
import MyCell from '../../component/MyCell';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADD_USER, NEW_FIREND, QRCODE } from '../../assets/image';
// import SearchFriend from '../SearchFriend';
import config from '../../config';
import { searchFriends } from '../../api/friends';
import { TextInput } from 'react-native-gesture-handler';
import SearchModal from './SearchModal';



const AddFriend = ({AppStore,MyThemed,navigation,AppVersions}:any) => {
  const search_modal_ref:{current:any} = useRef();
  const colorScheme = useColorScheme();
  useEffect(()=>{
    // const unsubscribe = navigation.addListener('state', () => {
    //   // 处理路由变化的逻辑
    // });
    // return unsubscribe;
  },[]);

  
  return <ScrollView
    style={styles.container}
    stickyHeaderIndices={[]}
    onMomentumScrollEnd={(event:any)=>{}}>
      
      <TouchableOpacity activeOpacity={0.6} style={styles.inputTO} onPress={()=>{
        search_modal_ref.current.open()
      }}>
        <View style={styles.inputWrapper}>
            <Text style={{
              ...styles.inputeText,
              color: MyThemed[colorScheme||'light'].ftCr2
            }}>账号/手机号</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.inputBom}>
        我的微信号：{AppStore?.userInfo?.chat_no}
        <View style={{width: 20}}></View>
        <Image 
        style={{
          width: 15,
          height: 15,
          tintColor: MyThemed[colorScheme||'light'].ftCr2,
        }} 
        source={QRCODE}/>
      </Text>

      <SearchModal navigation={navigation} ref={search_modal_ref}/>
      
    </ScrollView>;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  inputTO:{
    paddingVertical: 20,
  },
  inputWrapper:{
    borderRadius: 10,
    marginHorizontal:20,
  },
  inputeText:{
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
  },
  inputBom:{
    textAlign: 'center',
  }
});

export default inject("AppStore","MyThemed")(observer(AddFriend));
