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



const AddFriend = ({AppStore,MyThemed,navigation,AppVersions}:any) => {
    
  const colorScheme = useColorScheme();

  const [keywords, setKeywords] = useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [searchInfo, setSearchInfo] = useState(false);
  const inputRef:{current:any} = useRef();

  // const _navigation = useNavigation();
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
        setModalVisible(!modalVisible);
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


      <Modal
        style={{zIndex: 10}}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        onShow={()=>{
          console.log('inputRef===>>',inputRef.current)
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
              const result:any = await searchFriends({keywords});
              if(result){
                setSearchInfo(result);
                navigation.navigate({
                  name: 'UserDetail',
                  params: {
                    userInfo: result,
                  }
                });
                setModalVisible(!modalVisible);
                setLoadingComplete(false)
                setKeywords('');
              }else{
                setLoadingComplete(true)
              }
              
              // setTimeout(() => {
              //   setLoadingComplete(true)
              // }, 100);


              
            }}/>
            <Label 
            type='title' 
            size='lg' 
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
              const result:any = await searchFriends({keywords});
              if(result){
                setSearchInfo(result);
                navigation.navigate({
                  name: 'UserDetail',
                  params: {
                    userInfo: result,
                  }
                });
                setModalVisible(!modalVisible);
                setLoadingComplete(false)
                setKeywords('');
              }else{
                setLoadingComplete(true)
              }
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
      </Modal>

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
