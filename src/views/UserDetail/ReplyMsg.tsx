import React, { useState,useEffect,useRef,forwardRef, useCallback, useImperativeHandle } from 'react';
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
import { addFriendsLabel, editFriendsLabel, getFriendsLabelList } from '../../api/friendsLabel';
const ReplyMsg = ({ 
  MyThemed
}:any,ref:any) => {
  
  const use_ref = useRef<any>();
  const colorScheme = useColorScheme();
  
  const [label_name,set_label_name] = useState<string>();
  const [label_id,set_label_id] = useState<number|string>();
  const [operator_type,set_operator_type] = useState<number|string>();
  const [modalVisible,setModalVisible] = useState<boolean>(false);
  useEffect(()=>{
  },[]);

  const open = useCallback((callback:any,item:{label_id: number, label_name: string},operatorType='add')=>{
    console.log('item===operatorType---------',item,operatorType)
    use_ref.current = {
      callback: callback
    };
    setModalVisible(true);

    if(item?.label_name) set_label_name(item.label_name);
    if(item?.label_id) set_label_id(item.label_id);
    set_operator_type(operatorType)
  },[]);
  const close = useCallback(()=>{
    setModalVisible(false);
    set_label_id('');
    console.log('item===operatorType--close',operator_type);
    if(operator_type=='edit') set_label_name('');
  },[operator_type]);

  // 把父组件需要调用的方法暴露出来
  useImperativeHandle(ref, () => ({
    open,
    close
  }));

  const add = useCallback(async ()=>{
    const result = await addFriendsLabel({
      label_name: label_name,
    });
    set_label_name('');
    close();
    use_ref.current.callback && use_ref.current.callback();
  },[label_name]);

  const edit = useCallback(async ()=>{
    const result = await editFriendsLabel({
      label_name: label_name,
      label_id: label_id
    });
    set_label_name('');
    close();
    use_ref.current.callback && use_ref.current.callback();
  },[label_name,label_id]);

  return <Modal
    style={{zIndex: 10}}
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    hardwareAccelerated={true}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <Vw style={{
      width: '100%',
      height:'100%',
      justifyContent:'center',
      alignItems:'center'
    }}>
      <Vw 
        style={{
        width: '100%',
        height:'100%',
        backgroundColor:'#000',
        opacity:0.5}}
      ></Vw>
      <View style={{
        // paddingBottom:60,
        paddingTop: 10,
        position: 'absolute',
        width: '80%',
        alignItems:'center',
        borderRadius: 20,
        // paddingHorizontal:20
      }}>
        {/* <View style={{width: '100%',flexDirection:'row',justifyContent:'center',positino:'absolute'}}>
          <Text style={{fontWeight: 'bold'}}>回复</Text>
        </View> */}
        <Text style={{width: '100%',textAlign:'center',fontWeight: 'bold'}}>回复</Text>
        <View style={{height: 30}}></View>
        <View style={{width: '100%',paddingHorizontal: 20}}>
          <Input 
          clearButtonMode={'always'}
          style={{
            width: '100%',
            backgroundColor: MyThemed[colorScheme||'light'].bg,
            borderWidth: 0,
            height: 50,
            borderRadius: 10,
            color:MyThemed[colorScheme||'light'].ftCr,
            marginBottom: 20,
          }}
          placeholder='输入回复内容' 
          value={label_name} 
          animated={true}
          autoFocus={modalVisible}
          keyboardType="default"
          onChangeText={(val:string)=>{
            set_label_name(val);
          }}
          onSubmitEditing={async ()=>{
          }}/>
        </View>
        
        <View style={{
          flexDirection:'row',
          borderTopWidth: 0.5,
          borderColor: MyThemed[colorScheme||'light'].ftCr2,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          // borderRadius: 20,
        }}>
          <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btn} 
          onPress={()=>{
            setModalVisible(false);
          }}>
            <Text  style={styles.btnTxt} >取消</Text>
          </TouchableOpacity>

          <TouchableOpacity
          activeOpacity={0.7}
          style={{
            ...styles.btn,
            borderLeftWidth: 0.5,
            borderColor: MyThemed[colorScheme||'light'].ftCr2,
          }} 
          onPress={()=>{
            setModalVisible(false);
          }}>
            <Text  style={{
              ...styles.btnTxt
            }} >确定</Text>
          </TouchableOpacity>
        </View>
      </View>
        
    </Vw>
  </Modal>
};

const styles = StyleSheet.create({
  btn:{
    width: '50%',
    height: 50,
    // lineHeight: 50,
    // textAlign: 'center',
    // backgroundColor:'red'
  },
  btnTxt:{
    width: '100%',
    height: '100%',
    lineHeight: 50,
    textAlign: 'center',
  }
});

export default inject("AppStore","MyThemed")(observer(forwardRef(ReplyMsg)));
