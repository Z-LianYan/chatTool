import React, { useState,useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { observer, inject } from 'mobx-react';
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
  Dimensions
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
import { 
  View,
  Text
} from '../component/customThemed';
import { 
  Button,
  Carousel,
  // NavigationBar,
  Theme,
  ListRow,
  Toast,
  Input
} from '../component/teaset/index';
import PropTypes, { number, string } from 'prop-types';
import { get_film_hot } from '../api/film';
import CustomListRow from '../component/CustomListRow';
import NavigationBar from '../component/NavigationBar';
import { login_out } from "../api/user";
import { edit_user_info, get_user_info } from "../api/user";
var ScreenObj = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

const InitPage = ({AppStore,navigation,route}:any) => {
  let [time,setTime] = useState(10);
  const colorScheme = useColorScheme();
  useEffect(()=>{

    
    getStorage();

    let timer = setInterval(() => {
      if(time<=0) {
        clearInterval(timer);
        navigation.replace('AppTabBar');
      };
      time -= 1;
      setTime(time)
    }, 1000);
    return ()=>{
      clearInterval(timer);
    }
  },[]);

  const getStorage = useCallback(async()=>{
    let res:string|null = await AsyncStorage.getItem('locationInfo');
    if(!res) return;
    let _res:{city_id:number,city_name:string} = JSON.parse(res)
    AppStore.setLocationInfo({
      city_id: _res.city_id, //默认城市编码
      city_name: _res.city_name, //默认城市广州
    })
  },[])
  
  return <View style={styles.container}>
    {/* <StatusBar 
    hidden={false} 
    translucent={true}//指定状态栏是否透明
    backgroundColor={"transparent"} //状态栏的背景色  
    barStyle={colorScheme=='dark'?'light-content':'dark-content'}
    /> */}
    <View style={styles.headContainer}>
      <Text></Text>
      <Text 
      style={{
        borderWidth:1,
        borderColor:'#eee',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:15
      }}
      onPress={()=>{
        console.log('12345')
        navigation.replace('AppTabBar');
      }}>跳过{time<0?0:time}</Text>
    </View>
    <Text style={{textAlign:'center',marginTop:100}}>欢迎光临，聊天app</Text>
    {/* <Text style={{textAlign:'center',marginTop:100}}>
      聊天app
    </Text> */}
    {/* <Text style={{textAlign:'center'}}>
      qq：2930638161
    </Text> */}
  </View>;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  headContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 40,
    paddingTop:50
  }
  
});

export default inject("AppStore")(observer(InitPage));
