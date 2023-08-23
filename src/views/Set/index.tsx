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
  Toast
} from '../../component/teaset/index';
import PropTypes, { number } from 'prop-types';
import CustomListRow from '../../component/CustomListRow';
import NavigationBar from '../../component/NavigationBar';
import { login_out } from "../../api/user";
import MyCell from '../../component/MyCell';
import AsyncStorage from '@react-native-async-storage/async-storage';



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
          AppStore.setUserInfo(null);
          navigation.dispatch(StackActions.popToTop());//清除内部导航堆栈
          navigation.replace('LoginPage',{
            hidBackBtn: true
          })
          // navigation.popToTop()
          await AsyncStorage.removeItem('chatToken');
        } }
      ]
    );
  }

  return <ScrollView
    style={styles.container}
    stickyHeaderIndices={[]}
    onMomentumScrollEnd={(event:any)=>{}}>
      
      {
        Platform.OS == 'android' && <MyCell
        style={{marginTop:0}}
        title='关于' 
        showBottomBorder={false}
        showRightArrow={true}
        rightValue={'版本号'+AppVersions.versionName}
        onPress={()=>{
          navigation.navigate('VersionPage');
        }}/>
      }

      


                

      <Button
        style={{marginHorizontal:10,marginTop:50,height: 44}}
        title={'退出登录'}
        type="primary"
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
