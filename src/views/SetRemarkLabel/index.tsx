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
  Alert,
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
// import { View } from '../../component/customThemed';
import { FRIENDCIRCLE, MAN_AVATAR, QRCODE, RIGHT_ARROW, SETICON, WOMAN_AVATAR } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
import { Button, Input } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runInAction } from 'mobx';
import { editFriends } from '../../api/friends';
const SetRemarkLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { search_user_info,op_type } = params;
  const search_user_id = search_user_info?.user_id;
  const { userInfo } = AppStore;
  const [formData,setFormData] = useState({})
  // const [isAlready,setIsAlready] = useState(false)
  // {
  //   f_user_name_remark: '',
  //   labels: [{label_id:'',label_name:''}],
  //   des: '描述'
  // }
  console.log('op_type======>>>',op_type)
  useEffect(()=>{
    if(!Object.keys(formData).length){
      (async function(){
        let info:any = await AsyncStorage.getItem('remarkLabel');
        info = JSON.parse(info);
        formData[search_user_id] = {
          f_user_name_remark: search_user_info?.f_user_name_remark||(info && info[search_user_id]?.f_user_name_remark),
          labels: search_user_info?.labels||((info && info[search_user_id]?.labels)?info[search_user_id]?.labels:[]),
          des: search_user_info?.des || (info && info[search_user_id]?.des),
        };
        setFormData({
          ...formData
        })
  
      })()
    }
  },[route?.params?.search_user_info,formData]);

  // const navigationBeforeRemove = useCallback(()=>{
  //   navigation.addListener('beforeRemove', (e:any) => {
  //     if (search_user_info.f_user_name_remark===formData[search_user_id]?.f_user_name_remark && search_user_info.des===formData[search_user_id]?.des) {
  //       // If we don't have unsaved changes, then we don't need to do anything
  //       return;
  //     }
  //     // setIsAlready(true);
  
  //     // Prevent default behavior of leaving the screen
  //     e.preventDefault();
  
  //     // Prompt the user before leaving the screen
  //     Alert.alert(
  //       '保存本次编辑？',
  //       '',
  //       [
  //         { text: "不保存", style: 'cancel', onPress: () => navigation.dispatch(e.data.action) },
  //         {
  //           text: '保存',
  //           style: 'destructive',
  //           // If the user confirmed, then we dispatch the action we blocked earlier
  //           // This will continue the action that had triggered the removal of the screen
  //           onPress: () => {

  //           },
  //         },
  //       ]
  //     );
  //   })
  // },[formData])
  

  return <ScrollView style={{
    ...styles.container,
    backgroundColor: MyThemed[colorScheme||'light'].ctBg
  }}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].ctBg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={['addUser'].includes(op_type) && '申请添加朋友'}
    rightView={!['addUser'].includes(op_type) && <View  style={{paddingRight:10}}>
      <Button title="保存" type="primary" onPress={async ()=>{
        if(search_user_info?.isFriends){
          await editFriends({
            ...formData[search_user_id],
            label_ids: formData[search_user_id]?.labels?.map((item:any)=>item.label_id),
            friends_id: search_user_info?.friends_id
          });
          let infoObj:any = await AsyncStorage.getItem('remarkLabel');
          infoObj = JSON.parse(infoObj);
          if(infoObj[search_user_id]){
            delete infoObj[search_user_id];
            await AsyncStorage.setItem('remarkLabel',JSON.stringify(infoObj));
          }
        }else{
          await AsyncStorage.setItem('remarkLabel',JSON.stringify(formData));
        }
        navigation.navigate({
          name: 'UserDetail',
          params:{
            userInfo: {
              ...search_user_info,
              ...formData[search_user_id]
            },
          },
          merge: true,
        })
      }}>保存</Button>
    </View>}/>
    <View style={styles.contenWrapper}>
      {!['addUser'].includes(op_type) && <Text style={styles.titleTxt}>设置备注和标签</Text>
}
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>发送添加朋友申请</Text>
        <Input 
        multiline={true}
        numberOfLines={5}
        value={formData[search_user_id]?.f_user_name_remark}
        placeholder="请输入内容"
        style={{
          ...styles.valueTxt,
          height: 100,
          textAlignVertical: 'top',
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          color: MyThemed[colorScheme||'light'].ftCr
        }}
        maxLength={16}
        type='default' 
        onChangeText={(val:string)=>{
          formData[search_user_id] =  {
            ...formData[search_user_id],
            f_user_name_remark:val
          }
          setFormData({
            ...formData,
          });
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>

      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>备注</Text>
        <Input 
        value={formData[search_user_id]?.f_user_name_remark}
        placeholder="新的备注名"
        style={{
          ...styles.valueTxt,
          height: 50,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          color: MyThemed[colorScheme||'light'].ftCr
        }}
        maxLength={16}
        type='default' 
        onChangeText={(val:string)=>{
          formData[search_user_id] =  {
            ...formData[search_user_id],
            f_user_name_remark:val
          }
          setFormData({
            ...formData,
          });
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>标签</Text>
        <TouchableOpacity 
        style={{
          ...styles.valueTxt,
          height: 50,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          alignItems:'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 12
        }}
        onPress={()=>{
          navigation.navigate('SetLabel',{
            search_user_info:{
              ...search_user_info,
              ...formData[search_user_id]
            }
          })
        }}>
          <Text 
          style={{
            // paddingLeft: 12
          }}>{formData[search_user_id]?.labels?.length?formData[search_user_id]?.labels?.map((item:any)=>item.label_name).join('，'):"添加标签"}</Text>
          <Image style={styles.rightArrow} source={RIGHT_ARROW}/>
        </TouchableOpacity>
      </View>
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>描述</Text>
        <Input 
        multiline={true}
        maxLength={255}
        value={formData[search_user_id]?.des}
        placeholder="添加文字"
        style={{
          ...styles.valueTxt,
          height: 50,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          color: MyThemed[colorScheme||'light'].ftCr,
          textAlignVertical: "top"
        }}
        type='default' 
        onChangeText={(val:string)=>{
          formData[search_user_id] = {
            ...formData[search_user_id],
            des: val,
          }
          setFormData({
            ...formData
          });
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>

      {
       ['addUser'].includes(op_type) && <Button
        title={'发送'}
        type="default"
        disabled={false}
        activeOpacity={0.6}
        titleStyle={{color: '#fff'}}
        style={{
          marginTop:10,
          marginHorizontal: 30,
          height: 55,
          borderWidth:0, 
          backgroundColor: MyThemed[colorScheme||'light'].primaryColor,
        }}
        onPress={() => {
          
        }}
      />
      }
    </View>
  </ScrollView>
};

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  contenWrapper:{
    
  },
  titleTxt:{
    textAlign: 'center',
    height: 50,
    lineHeight: 50,
    fontWeight: 'bold',
    fontSize: 18
  },
  forWwrapper:{
    padding: 20,
  },
  labelTxt:{
    marginBottom: 10,
  },
  valueTxt:{
    borderWidth: 0,
    // height: 50,
    borderRadius: 10,
  },
  rightArrow:{
    width: 20,
    height: 20
  }
});

export default inject("AppStore","MyThemed")(observer(SetRemarkLabel));
