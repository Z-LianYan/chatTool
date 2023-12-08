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
  Toast,
  Checkbox
} from '../../component/teaset/index';
import { registerUser, send_verify_code } from "../../api/user";
// import tools from "../../utils/tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomListRow from '../../component/CustomListRow';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer;

const RegisterPage = (props:any) => {
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
  let [user_name,set_user_name] = useState();
  let [sex,set_sex] = useState(true);
  let [password,set_password] = useState('');
  let [password_comfirm,set_password_comfirm] = useState('');
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
    });
    let timer:any = setInterval(() => {
      code_time -= 1;
      if (code_time <= 0) {
        clearInterval(timer);
      }
      set_code_time(code_time <= 0 ? 60 : code_time);
      set_is_code_disabled(code_time <= 0 ? false : true);
    }, 1000);
    set_timer(timer);
  }
  function clearIntervalDis() {
    clearInterval(timer);
    set_code_time(60);
    set_is_code_disabled(false);
  }
  async function doRegister() {
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
      if (!user_name) return Toast.message("请输入用户名称");
      if (!password) return Toast.message("请输入密码");
      if (password.length<6) {
        return Toast.message("请输入至少6位数的密码");
      };
      if (!password_comfirm) return Toast.message("再次确认密码密码");
      if (password_comfirm.length<6) {
        return Toast.message("请输入至少6位数的密码");
      };
      if(password!=password_comfirm) return Toast.message("两次输入的密码不一致，请确认后再注册");
      let result:any = await registerUser({
        mobile_phone: mobile_phone,
        verify_code,
        user_name,
        password,
        sex: sex?1:0
      },'');
      clearIntervalDis();
      delete result.token
      props.AppStore.setUserInfo(result);
      await AsyncStorage.setItem('userInfo',JSON.stringify(result));
      props.navigation.goBack();
    }catch(err:any){
      console.log(err.message)
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
            set_mobile_phone(String(text).trim());
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
          placeholder="请输入短信验证码(默认1234)" 
          maxLength={4}
          keyboardType="numeric"
          value={verify_code} 
          onChangeText={(text:any)=>{
            set_verify_code(String(text).trim());
          }}
          style={{
            width: '100%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } 
        detail=''/>
        <CustomListRow 
        bottomSeparator="none"  
        title={
          <Input 
          placeholder="请输入用户名称" 
          maxLength={4}
          keyboardType="default"
          value={user_name} 
          onChangeText={(text:any)=>{
            set_user_name(String(text).trim());
          }}
          style={{
            width: '100%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } 
        detail=''/>

        <CustomListRow 
        bottomSeparator="none"  
        title={
          <Input 
          placeholder="请输入密码" 
          maxLength={100}
          keyboardType="default"
          secureTextEntry={true}
          value={password} 
          onChangeText={(text:any)=>{
            set_password(String(text).trim());
          }}
          style={{
            width: '100%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } 
        detail=''/>
        <CustomListRow 
        bottomSeparator="none"  
        title={
          <Input 
          placeholder="确认密码" 
          maxLength={100}
          keyboardType="default"
          secureTextEntry={true}
          value={password_comfirm} 
          onChangeText={(text:any)=>{
            set_password_comfirm(String(text).trim());
          }}
          style={{
            width: '100%',
            borderWidth:0,
            backgroundColor:'transparent',
            color: MyThemed[colorScheme||'light'].ftCr
          }} />
        } 
        detail=''/>

        <CustomListRow 
        bottomSeparator="none"  
        title={<Text style={{paddingLeft:12}}>性别</Text>}
        detail={
          <View style={{flexDirection:'row'}}>
            <Checkbox
            title='男'
            checked={sex}
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
            onChange={(value:boolean) => set_sex(value)}
            />
            <Checkbox

            style={{marginLeft: 50}}
            title='女'
            checked={!sex}
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
            onChange={(value:boolean) => set_sex(!value)}
            />
          </View>
        }/>
       
        

        <Button
          title={'注册'}
          type="primary"
          disabled={!isCodeDisabled}
          style={{marginHorizontal:10,marginTop:50,height: 44}}
          onPress={() => {
            doRegister()
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
export default inject("AppStore","MyThemed")(observer(RegisterPage));