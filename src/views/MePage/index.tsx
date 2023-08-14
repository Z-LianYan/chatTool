import React, { useState,useEffect } from 'react';
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
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
// import { View } from '../../component/customThemed';
import { FRIENDCIRCLE, QRCODE, RIGHT_ARROW, SETICON } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
const MePage = ({ 
  MyThemed,
  navigation
}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })
  return <ScrollView style={styles.container}>
    <View style={{
      ...styles.headContainer,
      paddingTop: Platform.OS == 'ios'?10:80,
    }}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image style={{
          ...styles.avatarImg,
        }} source={{uri:'https://pic.rmb.bdstatic.com/bjh/down/2f007a84f278b90f0683c6aae764d6f7.png'}}/>
        <View style={{flex:1,paddingHorizontal:10}}>
          <Text style={{paddingBottom: 10,color: MyThemed[colorScheme||'light'].ftCr,fontWeight:'bold'}}>lend</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={{flex:1}}>微信号：1234567890</Text>
            <View style={{flexDirection:'row'}}>
              <Image 
              style={{
                ...styles.rightArrow,
                marginHorizontal: 10,
                tintColor: MyThemed[colorScheme||'light'].ftCr2,
              }} 
              source={QRCODE}/>
              <Image 
              style={{
                ...styles.rightArrow,
                tintColor: MyThemed[colorScheme||'light'].ftCr2,
              }} 
              source={RIGHT_ARROW}/>
            </View>
            
          </View>
        </View>
      </View>
    </View>

    <MyCell
    style={{marginTop:10}}
    title='朋友圈' 
    avatar={FRIENDCIRCLE}
    showBottomBorder={false}
    showRightArrow={true}
    onPress={()=>{}}
    />
    <MyCell
    style={{marginTop:10}}
    title='设置' 
    avatar={SETICON}
    showBottomBorder={false}
    showRightArrow={true}
    onPress={()=>{
      navigation.navigate('Set')
    }}/>
  </ScrollView>
  
  ;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  headContainer:{
    paddingHorizontal:10,
    paddingBottom: 10,
  },
  avatarImg:{
    height: 60,
    width: 60,
    borderRadius: 10,

  },
  rightArrow:{
    width: 15,
    height: 15
  }
});

export default inject("AppStore","MyThemed")(observer(MePage));
