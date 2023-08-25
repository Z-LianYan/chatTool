import React, { useState,useEffect } from 'react';
import { useNavigation,StackActions } from '@react-navigation/core';
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
  Alert
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
  Input
} from '../../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import CustomListRow from '../../component/CustomListRow';
import NavigationBar from '../../component/NavigationBar';
import { login_out } from "../../api/user";
import MyCell from '../../component/MyCell';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRCODE } from '../../assets/image';



const SearchFriend = ({AppStore,MyThemed,navigation,AppVersions}:any) => {
    
  const colorScheme = useColorScheme();

  const [value, setValue] = useState()

  useEffect(()=>{
  })


  return <ScrollView
    style={styles.container}
    stickyHeaderIndices={[]}
    onMomentumScrollEnd={(event:any)=>{}}>
      
      <NavigationBar 
      onBack={()=>{
        navigation.goBack()
      }}
      title={''}/>

      <TouchableOpacity activeOpacity={0.6} style={styles.inputTO}>
        <View style={styles.inputWrapper}>
            <Text style={{
              ...styles.inputeText,
              color: MyThemed[colorScheme||'light'].ftCr2
            }}>账号/手机号</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.inputBom}>
        我的微信号：{AppStore.userInfo.mobile_phone}
        <View style={{width: 20}}></View>
        <Image 
        style={{
          width: 15,
          height: 15,
          tintColor: MyThemed[colorScheme||'light'].ftCr2,
        }} 
        source={QRCODE}/>
      </Text>
      

    </ScrollView>;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  inputTO:{
    paddingVertical: 20,
  },
  inputWrapper:{
    borderRadius: 10,
    marginHorizontal:20,
  },
  inputeText:{
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
  },
  inputBom:{
    textAlign: 'center',
  }
});

export default inject("AppStore","MyThemed")(observer(SearchFriend));
