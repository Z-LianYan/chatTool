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
  View as Vw
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
import AddEditLabel from './AddEditLabel';
const SetLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { userInfo } = AppStore;
  const [labels,setLabels] = useState<any>([
    { label_name: '朋友', label_id: 11},
    { label_name: '同事', label_id: 2},
  ]);
  const [selectLabels,setSelectLabels] = useState<any>([]);
  useEffect(()=>{
  },[]);
  return <ScrollView style={{
    ...styles.container,
    // backgroundColor: MyThemed[colorScheme||'light'].ctBg
  }}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].bg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={'从全部标签中添加'}
    rightView={<View  style={{paddingRight:10}}>
      <Button title="保存" type="primary" onPress={async ()=>{
        // await AsyncStorage.setItem('remarkLabel',JSON.stringify(formData));
        navigation.goBack();
      }}>保存</Button>
    </View>}/>
    <View style={{
      ...styles.alreadySelectLabelContainer,
      backgroundColor: MyThemed[colorScheme||'light'].ctBg,
      flexWrap: 'wrap'
    }}>
      {
        selectLabels.map((item:any,index:number)=>{
          return <TouchableOpacity 
          activeOpacity={0.6}
          key={item.label_id+'selectLabel'+Math.random()}
          style={{
            ...styles.labelTxtWrapper,
            backgroundColor: item.selected? MyThemed[colorScheme||'light'].primaryColor:'#cde9da',
          }}
          onPress={()=>{
            let idx = selectLabels.findIndex((it:any)=>it.selected==true);
            if(idx!==-1 && idx!==index)  delete selectLabels[idx].selected;
            if(selectLabels[index].selected){
              selectLabels.splice(index,1);
            }else{
              selectLabels[index].selected = true;
            }
            setSelectLabels(JSON.parse(JSON.stringify([
              ...selectLabels
            ])));
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
      <Text style={{
        ...styles.labelTxtWrapper,
        color: MyThemed[colorScheme||'light'].ftCr2
      }}>选择标签</Text>
    </View>

    <Vw style={{flexDirection:'row',justifyContent:'space-between',paddingVertical: 20, paddingHorizontal: 10}}>
      <Text>全部标签</Text>
      {/* <Text onPress={()=>{
        console.log('99999==>>')
      }}>
        编辑
        <Image style={styles.rightArrow} source={RIGHT_ARROW}/>
      </Text> */}
    </Vw>

    <Vw style={{
      ...styles.alreadySelectLabelContainer,
      flexWrap: 'wrap'
    }}>
      {
        labels.map((item:any,index:number)=>{
          return <TouchableOpacity 
          activeOpacity={0.6}
          key={item.label_id+'selectLabel'}
          style={{
            ...styles.labelTxtWrapper,
            backgroundColor: selectLabels.some((it:any)=>it.label_id==item.label_id)? MyThemed[colorScheme||'light'].primaryColor:MyThemed[colorScheme||'light'].ctBg,
          }}
          onPress={()=>{
            let idx = selectLabels.findIndex((it:any)=>item.label_id==it.label_id);
            if(idx===-1){
              selectLabels.push(item);
            }else{
              selectLabels.splice(idx,1);
            }
            setSelectLabels(JSON.parse(JSON.stringify([
              ...selectLabels
            ])));
          }}>
            <Text style={{
              ...styles.labelTxt,
              color: selectLabels.some((it:any)=>it.label_id==item.label_id)?'#fff':MyThemed[colorScheme||'light'].ftCr2,
            }}>
              {item.label_name}
            </Text>
          </TouchableOpacity>
        })
      }
    </Vw>
    <Button 
    title="新建标签" 
    type="default" 
    style={{width: 100,height: 40,marginTop: 30,borderWidth: 0}}
    onPress={()=>{
      console.log('123456')
    }}/>

    <AddEditLabel/>
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
    paddingBottom: 5,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10
  },
  labelTxt:{
  },
  rightArrow:{
    width: 15,
    height: 15,
  }
});

export default inject("AppStore","MyThemed")(observer(SetLabel));
