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
import SocketIoClient from '../../socketIo';
const ReplyMsg = ({ 
  MyThemed,
  AppStore,
  to_user_id
}:any,ref:any) => {
  const sockitIo = SocketIoClient.getInstance()
  
  const use_ref = useRef<any>();
  const colorScheme = useColorScheme();
  
  const [reply_content,set_reply_content] = useState<string>();
  const [label_id,set_label_id] = useState<number|string>();
  const [operator_type,set_operator_type] = useState<number|string>();
  const [modalVisible,setModalVisible] = useState<boolean>(false);
  const [isSending,setIsSending] = useState<boolean>(false);
  useEffect(()=>{
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

  const comfirmReply = useCallback(async ()=>{
    if(isSending) return;
    if(isSending) setIsSending(true);
    console.log('======>>>',AppStore?.userInfo?.user_id,to_user_id,reply_content);
    if(!AppStore?.userInfo?.user_id || !to_user_id) return;
    
    sockitIo?.getSocketIo()?.emit('addFriendApplyReply',{ from_user_id: AppStore?.userInfo?.user_id, to_user_id: to_user_id, msg: reply_content },function(response:any) {
      if (response && response.status === 'success') {
          console.log('Message sent successfully!',response);
          close();
          set_reply_content('');
          use_ref.current?.callback && use_ref.current?.callback(response.msg);
      } else {
          console.log('Failed to send message!');
      }

      setIsSending(false);
    });
    
    
    
  },[reply_content]);

 

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
        paddingTop: 10,
        position: 'absolute',
        width: '80%',
        alignItems:'center',
        borderRadius: 20,
      }}>
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
          value={reply_content} 
          animated={true}
          autoFocus={modalVisible}
          keyboardType="default"
          onChangeText={(val:string)=>{
            set_reply_content(val);
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
          onPress={async ()=>{
            await comfirmReply();
          }}>
            <Text  style={{
              ...styles.btnTxt,
              color: MyThemed[colorScheme||'light'].ftCr3,
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
  },
  btnTxt:{
    width: '100%',
    height: '100%',
    lineHeight: 50,
    textAlign: 'center',
  }
});

export default inject("AppStore","MyThemed")(observer(forwardRef(ReplyMsg)));
