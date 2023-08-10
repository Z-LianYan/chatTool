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
  Toast
} from '../../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import CustomListRow from '../../component/CustomListRow';
import NavigationBar from '../../component/NavigationBar';
import { login_out } from "../../api/user";
import MyCell from '../../component/MyCell';



const SetPage = ({AppStore,navigation,AppVersions}:any) => {
    
  const colorScheme = useColorScheme();

  useEffect(()=>{
  })

  async function onLoginOut() {

    Alert.alert(
      "您确定退出登录吗？",
      "",
      [
        {
          text: "取消",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "确定", onPress: async () => {
          await login_out();
          navigation.navigate("HomePage");
          AppStore.setUserInfo(null);
          // navigation.replace('LoginPage')
        } }
      ]
    );
  }

  return <ScrollView
    style={styles.container}
    stickyHeaderIndices={[]}
    onMomentumScrollEnd={(event:any)=>{}}>
      
      <MyCell
      style={{marginTop:0}}
      title='关于' 
      showBottomBorder={false}
      showRightArrow={true}
      onPress={()=>{
      }}/>

      


                

      <Button
        style={{marginTop:100,marginLeft:20,marginRight:20}}
        title={'退出登录'}
        type="default"
        onPress={() => {
          onLoginOut()
        }}
      />

      
    </ScrollView>;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  }
});

export default inject("AppStore","AppVersions")(observer(SetPage));
