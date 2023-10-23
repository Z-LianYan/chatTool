import React,{ Component, useEffect,useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { View,Text} from '../../component/customThemed';
import NavigationBar from '../../component/NavigationBar';
import { observer, inject } from 'mobx-react';
import { 
  Button,
  Carousel,
  Theme,
  Label,
  Drawer,
  ActionSheet,
  Input,
  ListRow,
  Toast
} from '../../component/teaset/index';
import { userLogin } from "../../api/user";
// import tools from "../../utils/tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomListRow from '../../component/CustomListRow';
import { useNavigation,StackActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BACK_ICON } from '../../component/teaset/icons';
import SocketIoClient from '../../socketIo';

// declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer;

const Login = (props:any) => {
  const { MyThemed,AppStore } = props;
  const colorScheme = useColorScheme();
  const navigation:any = useNavigation();

  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  useLayoutEffect(() => {
    if(props.route.params && props.route.params.hidBackBtn){
      navigation.setOptions({
        headerLeft:''
      });
    }
  });
  
  let [form_data,set_form_data] = useState({
    mobile_phone: process.env.NODE_ENV=='development'?'13536681616':'',
    password: process.env.NODE_ENV=='development'?'123456':'',
    type:'password'
  });
  let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

  useEffect(()=>{
    return ()=>{}
  },[]);

  async function doLogin() {
    const { mobile_phone, password } = form_data;
    
    try{
      let route = props.route;
      if (!mobile_phone) {
        return Toast.message("请输入手机号");
      }
      if (!reg_tel.test(mobile_phone)) {
        return Toast.message("请输入正确的手机号");
      }
      const result:any = await userLogin(form_data);
      AppStore.setUserInfo(result);
      if(result && result.token){
        await AsyncStorage.setItem('token',result.token);
        const sockitIo = SocketIoClient.getInstance(()=>{
          if(route.params && route.params.toUrl){
            props.navigation.replace(route.params.toUrl);
            return;
          }
          props.navigation.replace('AppTabBar',{});
        });
      }else{
        Toast.message('服务端未返回token');
      }
    }catch(err:any){
      console.log(err.message);
    }
    
  }
  return (<View style={styles.container}>
    <View style={styles.contentContainer}>
        <CustomListRow 
        bottomSeparator="none" 
        title={
          <Input 
          placeholder="请输入手机号" 
          maxLength={11}
          value={form_data.mobile_phone} 
          keyboardType="numeric"
          onChangeText={(text:any)=>{
            // set_mobile_phone(text);
            set_form_data({
              ...form_data,
              mobile_phone: text
            })
          }}
          style={{
            width: '60%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } />
        <CustomListRow 
        bottomSeparator="none" 
        title={
          <Input 
          placeholder="请输入密码" 
          maxLength={99}
          value={form_data.password} 
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text:any)=>{
            set_form_data({
              ...form_data,
              password: text
            })
          }}
          style={{
            width: '60%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } />

        <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
          <TouchableOpacity activeOpacity={0.6} onPress={()=>{
            props.navigation.replace('VerifyCodeLogin',{
              hidBackBtn:true
            })
          }}>
            <Text style={{
              ...styles.tip,
              color: MyThemed[colorScheme||'light'].primaryColor
            }}>短信验证码登录</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
          activeOpacity={0.6} 
          onPress={()=>{
            props.navigation.navigate('RegisterPage')
          }}>
            <Text style={{
              ...styles.tip,
              color: MyThemed[colorScheme||'light'].primaryColor
            }}>注册</Text>
          </TouchableOpacity>
        </View>
        

        <Button
          title={'登录'}
          type="primary"
          disabled={(form_data.mobile_phone && form_data.mobile_phone.length==11 && form_data.password && form_data.password.length>=6)?false:true}
          style={{marginHorizontal:10,marginTop:50,height: 44}}
          onPress={() => {
            doLogin()
          }}
        />

    </View>
    
  </View>);
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  contentContainer:{
    flex:1,
    paddingTop:60,
  },
  tip:{
    padding: 25
  }
});
export default inject("AppStore","MyThemed","FriendsStore")(observer(Login));