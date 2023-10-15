import React, { useState,useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { runInAction } from 'mobx';



const SearchModal = ({AppStore,MyThemed,navigation,AppVersions}:any,ref:any) => {
  const use_ref = useRef<any>();
  const colorScheme = useColorScheme();

  const [keywords, setKeywords] = useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  // const [searchInfo, setSearchInfo] = useState(false);
  const inputRef:{current:any} = useRef();

  // const _navigation = useNavigation();
  useEffect(()=>{
    // const unsubscribe = navigation.addListener('state', () => {
    //   // 处理路由变化的逻辑
    // });
    // return unsubscribe;
  },[]);


  const open = useCallback((callback:any)=>{
    use_ref.current = {
      callback: callback
    };
    setModalVisible(true);
  },[]);
  const close = useCallback(()=>{
    setModalVisible(false);
  },[]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  const handSearchUser = useCallback(async ()=>{
    const result:any = await searchFriends({keywords});
    if(result){
      runInAction(()=>{
        AppStore.search_user_info = result;
      });
      // setSearchInfo(result);
      navigation.navigate({
        name: 'UserDetail',
        params: {
          // userInfo: result,
        }
      });
      setModalVisible(!modalVisible);
      setLoadingComplete(false)
      setKeywords('');
    }else{
      setLoadingComplete(true)
    }
  },[keywords])

  
  return <Modal
    style={{zIndex: 10}}
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
    onShow={()=>{
    }}
  >
    <Vw style={{height: Platform.OS == 'ios'?config.STATUS_BAR_HEIGHT:0,width: '100%'}}></Vw>
    <View style={{
      flex: 1,
      width: '100%',
      backgroundColor: MyThemed[colorScheme||'light'].bg
    }}>
      
      <Vw style={{flexDirection:'row',alignItems:'center',padding: 10}}>
        <TextInput 
        clearButtonMode={'always'}
        style={{flex:1,backgroundColor: MyThemed[colorScheme||'light'].ctBg,borderWidth: 0,height: 50,borderRadius: 10,color:MyThemed[colorScheme||'light'].ftCr}}
        placeholder='账号手/机号' 
        value={keywords} 
        // animated={true}
        autoFocus={true}//只聚焦，没有自动弹出键盘
        ref={inputRef}
        onLayout={()=> inputRef.current.focus()}//只聚焦，没有自动弹出键盘
        keyboardType="default"
        onChangeText={(val:string)=>{
          setLoadingComplete(false)
          setKeywords(val);
        }}
        onSubmitEditing={async ()=>{
          await handSearchUser()
        }}/>
        <Label 
        type='title' 
        size='md' 
        text='取消' 
        style={{marginHorizontal:10, color: MyThemed[colorScheme||'light'].ftCr3}}
        onPress={()=>{
          setModalVisible(!modalVisible);
          setLoadingComplete(false)
          setKeywords('');
        }}/>
      </Vw>
      {
        loadingComplete && <View style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: MyThemed[colorScheme||'light'].ftCr2}}>该用户不存在</Text>
        </View>
      }
      {
        keywords && !loadingComplete && <TouchableOpacity activeOpacity={0.6} onPress={async()=>{
          await handSearchUser()
        }}>
          <View style={{padding: 10,flexDirection: 'row',alignItems: 'center'}}>
            <Image style={{
              width: 40,
              height: 40,
              borderRadius: 5
            }} source={NEW_FIREND}/>
            <Text style={{paddingLeft: 10}}>
              <Text>搜索：</Text><Text style={{
                paddingLeft: 10,
                color: MyThemed[colorScheme||'light'].primaryColor
              }} key={keywords}>{keywords}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      }
    </View>
  </Modal>;
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(forwardRef(SearchModal)));
