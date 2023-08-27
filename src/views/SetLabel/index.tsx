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
const SetLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { userInfo } = AppStore;
  const [labels,setLabels] = useState([
    { label_name: '朋友', label_id: 1},
    { label_name: '同事', label_id: 2},
  ]);
  const [selectLabels,setSelectLabels] = useState<any>([
    { label_name: '朋友', label_id: 1,selected:true},
    { label_name: '同事', label_id: 2},
  ]);
  useEffect(()=>{
  },[]);
  return <ScrollView style={{
    ...styles.container,
    // backgroundColor: MyThemed[colorScheme||'light'].ctBg
  }}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].ctBg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={'从全部标签中添加'}
    rightView={<View  style={{paddingRight:10}}>
      <Button title="保存" type="primary" onPress={async ()=>{
        // await AsyncStorage.setItem('remarkLabel',JSON.stringify(formData));
        console.log('123456')
      }}>保存</Button>
    </View>}/>
    <View style={{
      ...styles.alreadySelectLabelContainer,
      backgroundColor: MyThemed[colorScheme||'light'].ctBg
    }}>
      {
        selectLabels.map((item:any,index:number)=>{
          return <TouchableOpacity 
          activeOpacity={0.6}
          key={item.label_id+'selectLabel'}
          style={{
            ...styles.labelTxtWrapper,
            backgroundColor: item.selected? MyThemed[colorScheme||'light'].primaryColor:'#cde9da',
          }}
          onPress={()=>{
            console.log('index',index);
            selectLabels[index].selected = true;
            setSelectLabels(selectLabels);
          }}>
            <Text style={{
              ...styles.labelTxt,
              color: item.selected?'#fff':MyThemed[colorScheme||'light'].primaryColor,
            }}>
              {item.label_name} {item.selected?'x':''}
            </Text>
          </TouchableOpacity>
        })
      }
    </View>
    {/* <View style={styles.contenWrapper}>
      
      <View style={styles.forWwrapper}>
        <Text style={styles.labelTxt}>描述</Text>
        <Input 
        multiline={true}
        maxLength={255}
        value={formData.des}
        placeholder="添加文字"
        style={{
          ...styles.valueTxt,
          backgroundColor: MyThemed[colorScheme||'light'].bg,
          color: MyThemed[colorScheme||'light'].ftCr,
          textAlignVertical: "top"
        }}
        type='default' 
        onChangeText={(val:string)=>{
          setFormData({
            ...formData,
            des: val
          })
        }}
        onSubmitEditing={()=>{

        }}></Input>
      </View>
    </View> */}
  </ScrollView>
};

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  alreadySelectLabelContainer:{
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  labelTxtWrapper:{
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 8,
    borderRadius: 18,
    marginRight: 10
  },
  labelTxt:{
  }
});

export default inject("AppStore","MyThemed")(observer(SetLabel));
