import React, { useState,useEffect } from 'react';
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
  View as Vw,
  Modal
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
// import { View } from '../../component/customThemed';
import { CLOSE_CIRCLE_ICON, FRIENDCIRCLE, MAN_AVATAR, QRCODE, RIGHT_ARROW, SETICON, WOMAN_AVATAR } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
import { Button, Input } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runInAction } from 'mobx';
const AddEditLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
}:any) => {
    
  const colorScheme = useColorScheme();
  const { userInfo } = AppStore;
  
  const [label,setLabel] = useState<string>();
  const [modalVisible,setModalVisible] = useState<boolean>(true);
  useEffect(()=>{
  },[]);
  return <Modal
    style={{zIndex: 10}}
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    {/* <TouchableOpacity style={{flex:1}}></TouchableOpacity> */}
    <View style={{paddingBottom:60,paddingTop: 30,position: 'absolute',paddingHorizontal:20,bottom: 0,left: 0,right: 0,alignItems:'center'}}>
      <View style={{width: '100%',flexDirection:'row',justifyContent:'center',positino:'absolute'}}>
        <TouchableOpacity 
        style={{
          position: 'absolute',
          left:0,
          top:'50%',
          
          marginTop: -10,
        }} 
        onPress={()=>{
          setModalVisible(false);
        }}>
          <Image 
          style={{
            width: 25,
            height: 25,
            tintColor: MyThemed[colorScheme||'light'].ftCr
          }} 
          source={CLOSE_CIRCLE_ICON}/>
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold'}}>新建标签</Text>
      </View>
      <View style={{height: 30}}></View>
      
      <Input 
      clearButtonMode={'always'}
      style={{
        width: '100%',
        backgroundColor: MyThemed[colorScheme||'light'].bg,
        borderWidth: 0,
        height: 50,
        borderRadius: 10,
        color:MyThemed[colorScheme||'light'].ftCr
      }}
      placeholder='标签名称' 
      value={label} 
      animated={true}
      autoFocus={modalVisible}
      keyboardType="default"
      onChangeText={(val:string)=>{
        setLabel(val);
      }}
      onSubmitEditing={async ()=>{
      }}/>
      <Button 
      title="确定" 
      type="primary" 
      style={{width: 150,height: 40,marginTop: 30}}
      onPress={()=>{
        setModalVisible(false);
      }}/>
    </View>
  </Modal>
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(AddEditLabel));
