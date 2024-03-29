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
  Dimensions,
  PermissionsAndroid,
  View as Vw,
  Text as Txt,
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
  Checkbox
} from '../../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import CustomListRow from '../../component/CustomListRow';
import NavigationBar from '../../component/NavigationBar';
import { get_user_info, edit_user_info } from "../../api/user";
import UploadFile from '../../component/UploadFile';
import dayjs from 'dayjs';

import * as qiniu from 'qiniu-js';

import { conformsTo } from 'lodash';
import { CLOSE_CIRCLE_ICON } from '../../assets/image';
import { Switch } from 'react-native-gesture-handler';

var ScreenObj = Dimensions.get('window');

const navBarHeight = Platform.OS === 'android' ? 56 : 44;
const EditUserInfo = ({AppStore,navigation,MyThemed}:any) => {
  
  const colorScheme = useColorScheme();
  let [formData,setFormData] = useState<any>({
    avatar: "",
    user_name: "",
    chat_no: "",
    sex: true,
    add_friend_verify: 1,
  });
  let [qiniuConfig,setQiniuConfig] = useState({
    static_host: "",
    upload_token: "",
  });
  let [submiting,setSubmiting] = useState(false);
  let [loadingFinish,setLoadingFinish] = useState(false);


  useEffect(()=>{

      (async ()=>{
        // setFormData({
        //   avatar: AppStore?.userInfo?.avatar,
        //   user_name: AppStore?.userInfo?.user_name,
        //   chat_no: AppStore?.userInfo?.chat_no,
        //   sex: AppStore?.userInfo?.sex?true:false,
        //   add_friend_verify: AppStore?.userInfo?.add_friend_verify
        // });
        setFormDataTool(AppStore?.userInfo);
        await getUserInfo();
       console.log('AppStore?.userInfo=====>>>',AppStore?.userInfo)
      
      
      })();
    return ()=>{
      // isMounted = false
    }
  },[]);

  const setFormDataTool = useCallback((userInfo:any)=>{
    if(!userInfo) return;
    setFormData({
      avatar:userInfo!.avatar,
      user_name:userInfo?.user_name,
      chat_no: userInfo?.chat_no,
      sex: userInfo?.sex?true:false,
      add_friend_verify: userInfo?.add_friend_verify
    })
  },[])
  async function getUserInfo() {
    return new Promise(async (resolve,reject)=>{
      let result:any = await get_user_info();
      if (!result) return;
      // setFormData({
      //   avatar:result!.avatar,
      //   user_name:result?.user_name,
      //   chat_no: result?.chat_no,
      //   sex: result?.sex?true:false,
      //   add_friend_verify: result?.add_friend_verify
      // })
      setFormDataTool(result);
      AppStore.setUserInfo(result);
      resolve('ok');
    });
      
  }

  async function onEditUserInfo() {
    if (!formData?.user_name) return Toast.message("名字不能为空");
    if (!formData?.avatar) return Toast.message("头像不能为空");
    setSubmiting(true);
    try{
      const result = await edit_user_info({
        ...formData,
        sex: formData?.sex?1:0
      });
      AppStore.setUserInfo(result);
      navigation.goBack()
    }catch(err){

    }
    setSubmiting(false);
  }

  return <ScrollView 
  style={styles.scroll_view}>
    <View style={styles.container}>

      <CustomListRow 
      // accessory="none"
      bottomSeparator="indent" 
      title={'头像'} 
      detail={<UploadFile 
        borderRadius={10} 
        key={Math.random()}
        fileList={[{uri:formData?.avatar}]}
        onBeforeUpload={async (file)=>{
          return new Promise(async (resolve, reject)=>{
            // const res = await fetch(`${file[0].uri}`);
            // const blobData:any = await res.blob()
            // qiniu.compressImage(blobData._data, {
            //   quality: 0.92,
            //   noCompressIfLarger: true
            // }).then(data=>{
            //   console.log('压缩----》〉data',data)
            //   // resolve([data])
            // }); 
            resolve(file)
          })
        }}
        onAfterUpload={(file)=>{
          formData.avatar = file[0].uri;
          setFormData(formData);
        }}
        onUploadFail={(err)=>{
          console.log('onUploadFail------>>>',err)
        }}
      />} />
      <CustomListRow 
      // accessory="none"
      bottomSeparator="indent" 
      title={'名字'} 
      detail={<View>
        <View style={styles.inputWrapper}>
          <Input 
          value={formData?.user_name} 
          clearButtonMode="never"
          style={{
            ...styles.input,
            color:colorScheme=="dark"?'#fff':'#000',
          }}
          placeholderTextColor="#999"
          selectionColor={Theme.primaryColor}
          maxLength={8}
          keyboardType="default"
          placeholder="请输入名字"
          onSubmitEditing={(_e:any)=>{
          }}
          onChangeText={(val:any)=>{
            setFormData({
              ...formData,
              user_name:val
            });
          }}
          autoFocus={false}
          onChange={(e:any)=>{
            let val = e.nativeEvent.text;
          }}/>

          <TouchableOpacity 
          style={styles.iosCloseCircleSharp}
          onPress={()=>{
            setFormData({
              ...formData,
              user_name:''
            })
          }}>
            <Image 
            style={{
              width: 20,
              height: 20,
              tintColor: MyThemed[colorScheme||'light'].primaryColor,
            }} 
            source={CLOSE_CIRCLE_ICON}/>
          </TouchableOpacity>
        </View>
      </View>} />
      

      <CustomListRow 
      // accessory="none"
      bottomSeparator="indent" 
      title={'畅聊号'} 
      detail={<View>
        <View style={styles.inputWrapper}>
          <Input 
          value={formData?.chat_no} 
          clearButtonMode="never"
          style={{
            ...styles.input,
            color:colorScheme=="dark"?'#fff':'#000',
          }}
          placeholderTextColor="#999"
          selectionColor={Theme.primaryColor}
          maxLength={22}
          keyboardType="default"
          placeholder="请输入名字"
          onSubmitEditing={(_e:any)=>{
          }}
          onChangeText={(val:any)=>{
            setFormData({
              ...formData,
              chat_no:val
            });
          }}
          autoFocus={false}
          onChange={(e:any)=>{
            let val = e.nativeEvent.text;
          }}/>

          <TouchableOpacity 
          style={styles.iosCloseCircleSharp}
          onPress={()=>{
            setFormData({
              ...formData,
              chat_no:''
            })
          }}>
            <Image 
            style={{
              width: 20,
              height: 20,
              tintColor: MyThemed[colorScheme||'light'].primaryColor,
            }} 
            source={CLOSE_CIRCLE_ICON}/>
          </TouchableOpacity>
        </View>
      </View>} />


      <CustomListRow 
      bottomSeparator="indent" 
      title={"性别"}
      detail={
        <View style={{flexDirection:'row'}}>
          <Checkbox
          title='男'
          checked={formData?.sex}
          checkedIconStyle={{
            width: 20,
            height: 20,
            borderRadius: 0
          }}
          uncheckedIconStyle={{
            width: 20,
            height: 20,
            borderRadius: 0
          }}
          onChange={(value:boolean) => {
            setFormData({
              ...formData,
              sex: value
            })
          }}
          />
          <Checkbox

          style={{marginLeft: 50}}
          title='女'
          checked={!formData?.sex}
          checkedIconStyle={{
            width: 20,
            height: 20,
            borderRadius: 0
          }}
          uncheckedIconStyle={{
            width: 20,
            height: 20,
            borderRadius: 0
          }}
          onChange={(value:boolean) => {
            setFormData({
              ...formData,
              sex: !value
            })
          }}
          />
        </View>
      }/>

      <CustomListRow 
      bottomSeparator="none" 
      title={"加我为朋友时需要认证"}
      detail={
        <View style={{flexDirection:'row'}}>
          <Switch
            trackColor={{ false: "#767577", true: MyThemed[colorScheme||'light'].primaryColor }}
            onValueChange={(val)=>{
              setFormData({
                ...formData,
                add_friend_verify: val?1:0,
              })
            }}
            value={formData?.add_friend_verify?true:false}
          />
        </View>
      }/>
      
    </View>
    <Button
      style={styles.btnRecharge}
      title={'保存'}
      type="primary"
      size="lg"
      disabled={submiting}
      onPress={() => {
        onEditUserInfo();
      }}
    />
  </ScrollView>;
};

const styles = StyleSheet.create({
  scroll_view:{
    flex:1,
    // backgroundColor:'red'
  },
  container:{
    marginTop: 20,
    flex:1,
    paddingVertical: 30,
    borderRadius: 20,
  },
  inputWrapper:{
    width:ScreenObj.width - 120,
    position:'relative',
    // backgroundColor:'#ccc'
  },
  input:{
    width:'100%',
    height:50,
    // fontSize:18,
    // fontWeight:'bold',
    backgroundColor:'transparent',
    borderColor:'transparent'
  },
  iosCloseCircleSharp:{
    position:'absolute',
    right:10,
    top: '50%',
    marginTop: -10
  },
  btnRecharge:{
    marginHorizontal:20,
    marginTop: 80
  }
});

export default inject("AppStore","MyThemed")(observer(EditUserInfo));
