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
const SetRemarkLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { search_user_id } = params;
  const { userInfo } = AppStore;
  const [formData,setFormData] = useState({})
  // {
  //   f_user_name_remark: '',
  //   labels: ['朋友','同事'],
  //   des: '描述'
  // }
  useEffect(()=>{

    const unsubscribe = navigation.addListener('state', async() => {
      // 处理路由变化的逻辑
      let info:any = await AsyncStorage.getItem('remarkLabel');
      info = JSON.parse(info);
      formData[search_user_id] = {
        f_user_name_remark: info && info[search_user_id]?.f_user_name_remark,
        labels: (info && info[search_user_id]?.labels)?info[search_user_id]?.labels:[],
        des: info && info[search_user_id]?.des,
      };
      setFormData({
        ...formData
      })
    });
    return unsubscribe;
  },[]);
  return <ScrollView style={{
    ...styles.container,
    backgroundColor: MyThemed[colorScheme||'light'].ctBg
  }}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].ctBg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={''}
    rightView={<View  style={{paddingRight:10}}>
      <Button title="保存" type="primary" onPress={async ()=>{
        await AsyncStorage.setItem('remarkLabel',JSON.stringify(formData));
        navigation.goBack();
      }}>保存</Button>
    </View>}/>
    <View style={styles.contenWrapper}>
      <Text style={styles.titleTxt}>设置备注和标签</Text>

      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>备注</Text>
        <Input 
        value={formData[search_user_id]?.f_user_name_remark}
        placeholder="新的备注名"
        style={{
          ...styles.valueTxt,
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
          })
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>标签</Text>
        <TouchableOpacity 
        style={{
          ...styles.valueTxt,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          alignItems:'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 12
        }}
        onPress={()=>{
          navigation.navigate('SetLabel',{
            search_user_id
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
    height: 50,
    borderRadius: 10,
  },
  rightArrow:{
    width: 20,
    height: 20
  }
});

export default inject("AppStore","MyThemed")(observer(SetRemarkLabel));
