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
import { userLogin, phone_register, send_verify_code } from "../../api/user";
// import tools from "../../utils/tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomListRow from '../../component/CustomListRow';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer;

const Login = (props:any) => {
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
  
  let [form_data,set_form_data] = useState({
    phone_number: '13536681616',
    password: '123456'
  });
  let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

  useEffect(()=>{
    return ()=>{}
  },[]);

  async function doLogin() {
    // if(!isCodeDisabled) return Toast.message("请输入发送短信验证码");
    const { phone_number, password } = form_data;
    
    try{
      let route = props.route;
      if (!phone_number) {
        return Toast.message("请输入手机号");
      }
      if (!reg_tel.test(phone_number)) {
        return Toast.message("请输入正确的手机号");
      }
      console.log('route------>>>', route);

      await userLogin(form_data);
      // let result:any = await phone_register(form_data);
      // clearIntervalDis();
      
      // let storage_token = await AsyncStorage.getItem('token');
      // await AsyncStorage.setItem('token', result.token);
      // delete result.token
      // props.AppStore.setUserInfo(result);

      // if(route.params && route.params.toUrl){
      //   props.navigation.navigate(route.params.toUrl);
      //   return;
      // }
      // props.navigation.goBack();
      // props.navigation.replace('AppTabBar',{});
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
          value={form_data.phone_number} 
          keyboardType="numeric"
          onChangeText={(text:any)=>{
            // set_phone_number(text);
            set_form_data({
              ...form_data,
              phone_number: text
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
          disabled={(form_data.phone_number && form_data.phone_number.length==11 && form_data.password && form_data.password.length>=6)?false:true}
          style={{marginLeft:10,marginRight:10,marginTop:50}}
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
    padding: 25
  }
});
export default inject("AppStore","MyThemed")(observer(Login));