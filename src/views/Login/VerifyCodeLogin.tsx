import React,{ Component, useEffect,useLayoutEffect, useState } from 'react';
import {
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
import { userLogin, send_verify_code } from "../../api/user";
// import tools from "../../utils/tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomListRow from '../../component/CustomListRow';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SocketIoClient from '../../socketIo';

// declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer;

const VerifyCodeLogin = (props:any) => {
  const { MyThemed } = props;
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
  
  let [mobile_phone,set_mobile_phone] = useState(process.env.NODE_ENV=='development'?'13536681616':'');
  let [verify_code,set_verify_code] = useState(process.env.NODE_ENV=='development'?'1234':'');
  let [code_time,set_code_time] = useState(60);
  let [isCodeDisabled,set_is_code_disabled] = useState(false);
  let [timer,set_timer] = useState(0);
  let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

  useEffect(()=>{
    return ()=>{
      clearIntervalDis()
    }
  },[])


  async function sendVerifyCode(){

    if (!mobile_phone) {
      return Toast.message('请输入手机号');
    }
    if (!reg_tel.test(mobile_phone)) {
      return Toast.message('请输入正确的手机号');
    }
    await send_verify_code({
      mobile_phone: mobile_phone,
      key: 'phoneVerifyCodeLogin',
    });
    let timer:any = setInterval(() => {
      code_time -= 1;
      if (code_time <= 0) {
        clearInterval(timer);
      }
      set_code_time(code_time <= 0 ? 60 : code_time);
      set_is_code_disabled(code_time <= 0 ? false : true)
    }, 1000);
    set_timer(timer);
  }
  function clearIntervalDis() {
    clearInterval(timer);
    set_code_time(60);
    set_is_code_disabled(false);
  }
  async function doLogin() {
    // if(!isCodeDisabled) return Toast.message("请输入发送短信验证码");
    try{
      let route = props.route;
      if (!mobile_phone) {
        return Toast.message("请输入手机号");
      }
      if (!reg_tel.test(mobile_phone)) {
        return Toast.message("请输入正确的手机号");
      }
      if (!verify_code) {
        return Toast.message("请输入4位数的短信验证码");
      }
      if (verify_code.length < 4) {
        return Toast.message("请输入4位数的短信验证码");
      }
      let result:any = await userLogin({
        mobile_phone,
        verify_code,
        type: 'verify_code'
      },'');
      
      clearIntervalDis();
      props.AppStore.setUserInfo(result);
      // delete result.token
      if(result && result.token){
        console.log('验证码登录=====》〉',result);
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
      clearIntervalDis();
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
          value={mobile_phone} 
          keyboardType="numeric"
          onChangeText={(text:any)=>{
            set_mobile_phone(text);
          }}
          style={{
            width: '60%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } detail={
          <Button
            style={{backgroundColor:'transparent'}}
            titleStyle={{color: MyThemed[colorScheme||'light'].primaryColor}}
            title={isCodeDisabled ? (code_time + 's后再发送') : '发送验证码'}
            type="primary"
            disabled={isCodeDisabled}
            onPress={() => {
              sendVerifyCode()
            }}
          />
        } />
        <CustomListRow 
        bottomSeparator="none"  
        title={
          <Input 
          placeholder="请输入短信验证码" 
          maxLength={4}
          keyboardType="numeric"
          value={verify_code} 
          onChangeText={(text:any)=>{
            set_verify_code(text);
          }}
          style={{
            width: '100%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } 
        detail=''/>
        <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
          <TouchableOpacity 
          activeOpacity={0.6} 
          onPress={()=>{
            props.navigation.replace('LoginPage',{
              hidBackBtn:true
            })
          }}>
            <Text style={{
              ...styles.tip,
              color: MyThemed[colorScheme||'light'].primaryColor
            }}>密码登录</Text>
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
          disabled={!isCodeDisabled}
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
    paddingTop:60
  },
  tip:{
    padding: 25,
  }
});
export default inject("AppStore","MyThemed")(observer(VerifyCodeLogin));