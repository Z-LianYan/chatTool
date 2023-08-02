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
import { phone_register, send_verify_code } from "../../api/user";
// import tools from "../../utils/tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomListRow from '../../component/CustomListRow';

// declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer;

const Login = (props:any) => {
  const colorScheme = useColorScheme();
  // 在页面显示之前设(重)置 options 值，相当于在 componentDidMount 阶段执行
  // useLayoutEffect 是阻塞同步的，即执行完此处之后，才会继续向下执行
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title:'登录'
  //   });
  // });
  
  let [phone_number,set_phone_number] = useState('13536681616');
  let [verify_code,set_verify_code] = useState('1234');
  let [code_time,set_code_time] = useState(60);
  let [isCodeDisabled,set_is_code_disabled] = useState(false);
  let [timer,set_timer] = useState(0);
  let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

  useEffect(()=>{
    console.log('-----',props)
    return ()=>{
      clearIntervalDis()
    }
  },[])


  async function sendVerifyCode(){

    if (!phone_number) {
      return Toast.message('请输入手机号');
    }
    if (!reg_tel.test(phone_number)) {
      return Toast.message('请输入正确的手机号');
    }
    await send_verify_code({
      phone_number: phone_number,
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
      if (!phone_number) {
        return Toast.message("请输入手机号");
      }
      if (!reg_tel.test(phone_number)) {
        return Toast.message("请输入正确的手机号");
      }
      if (!verify_code) {
        return Toast.message("请输入4位数的短信验证码");
      }
      if (verify_code.length < 4) {
        return Toast.message("请输入4位数的短信验证码");
      }
      let result:any = await phone_register({
        phone_number,
        verify_code
      },'');
      clearIntervalDis();
      
      // let storage_token = await AsyncStorage.getItem('token');
      // await AsyncStorage.setItem('token', result.token);
      delete result.token
      props.AppStore.setUserInfo(result);

      if(route.params && route.params.toUrl){
        props.navigation.navigate(route.params.toUrl);
        return;
      }
      // props.navigation.goBack();
      props.navigation.replace('AppTabBar',{});
    }catch(err:any){
      console.log(err.message)
    }
    
  }
  return (<View style={styles.container}>
    {/* <NavigationBar 
    onBack={()=>{
      props.navigation.goBack()
      console.log('navigation',props.route);
    }}
    title={'登录'}/> */}
    <View style={styles.contentContainer}>
        <CustomListRow 
        bottomSeparator="none" 
        title={
          <Input 
          placeholder="请输入手机号" 
          maxLength={11}
          value={phone_number} 
          keyboardType="numeric"
          onChangeText={(text:any)=>{
            set_phone_number(text);
          }}
          style={{
            width: '60%',
            borderWidth:0,
            backgroundColor:'transparent',
            color:colorScheme=='dark'?'#fff':'#000'
          }} />
        } detail={
          <Button
            style={{backgroundColor:'transparent'}}
            title={isCodeDisabled ? (code_time + 's后再发送') : '发送验证码'}
            type="default"
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
            color:colorScheme=='dark'?'#fff':'#000'
          }} />
        } detail='' />

        <Button
          title={'登录'}
          type="primary"
          disabled={!isCodeDisabled}
          style={{marginLeft:10,marginRight:10,marginTop:50}}
          onPress={() => {
            doLogin()
          }}
        />
        <Text style={styles.tip}>⚠️已注册的直接登录，未注册的自动注册，注册后直接登录</Text>
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
    textAlign:'center',
    color:'#666',
    marginTop:20
  }
});
export default inject("AppStore")(observer(Login));