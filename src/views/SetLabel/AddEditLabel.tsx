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
const AddEditLabel = ({ 
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
    console.log('item===operatorType',item,operatorType)
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
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    hardwareAccelerated={true}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <View style={{
      paddingBottom:60,
      paddingTop: 30,
      position: 'absolute',
      paddingHorizontal:20,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems:'center',
      borderTopLeftRadius:20,
      borderTopRightRadius:20
    }}>
      <View style={{width: '100%',flexDirection:'row',justifyContent:'center',positino:'absolute'}}>
        <TouchableOpacity 
        style={{
          position: 'absolute',
          left:0,
          top:'50%',
          
          marginTop: -10,
        }} 
        onPress={()=>{
          // setModalVisible(false);
          close()
        }}>
          <Image 
          style={{
            width: 25,
            height: 25,
            tintColor: MyThemed[colorScheme||'light'].ftCr
          }} 
          source={CLOSE_CIRCLE_ICON}/>
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold'}}>{operator_type=='edit'?'编辑':'新建'}标签</Text>
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
      value={label_name} 
      animated={true}
      autoFocus={modalVisible}
      keyboardType="default"
      onChangeText={(val:string)=>{
        set_label_name(val);
      }}
      onSubmitEditing={async ()=>{
      }}/>
      <Button 
      title="确定" 
      type="primary" 
      style={{width: 150,height: 40,marginTop: 30}}
      onPress={async ()=>{
        if(operator_type=='edit'){
          edit();
        }else{
          add();
        }
      }}/>
    </View>
  </Modal>
};

const styles = StyleSheet.create({
});

export default inject("AppStore","MyThemed")(observer(forwardRef(AddEditLabel)));
