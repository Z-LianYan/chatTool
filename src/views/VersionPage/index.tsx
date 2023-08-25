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
import { 
  APP_LOGO
} from '../../assets/image';
import { SystemUpdataOverlay } from '../../component/SystemUpdate/SystemUpdataOverlay';
const VersionPage = ({app,navigation,AppVersions}:any) => {
    
  const colorScheme = useColorScheme();

  const [versionCode, setVersionCode] = React.useState('');
  const [versionName, setVersionName] = React.useState('');

  useEffect(()=>{
    console.log('res===>>哈哈哈哈哈');
    AppVersions.checkAppUpdate().then((res:any)=>{
      console.log('res===>>',res);
      setVersionCode(res?.versionCode);
      setVersionName(res?.versionName);
    });
    
  },[])

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
          app.setUserInfo(null);
          // navigation.replace('LoginPage')
        } }
      ]
    );
  }

  return <View style={styles.container}>
    {/* <NavigationBar 
    onBack={()=>{
      navigation.goBack()
    }}
    title={'设置'}/> */}
    <ScrollView
    stickyHeaderIndices={[]}
    onMomentumScrollEnd={(event:any)=>{}}>
      <View style={styles.headWrapper}>
        <Image
          style={{width:50,height:50}}
          source={APP_LOGO}
        />
        <Text style={styles.headTxt}>版本号 {AppVersions.versionName}</Text>
      </View>
      
      <CustomListRow 
      bottomSeparator="indent" 
      title={'检测更新'} 
      accessory= {(versionCode==AppVersions.versionCode||!versionName)?'none':'indicator'}
      detail={(versionCode==AppVersions.versionCode||!versionName)?'已是最新版本':`有版本更新v${versionName}`} 
      onPress={()=>{{
        if(versionCode && versionCode!=AppVersions.versionCode) new SystemUpdataOverlay().show(false);
      }}}/>

    </ScrollView>
  </View>;
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  headWrapper:{
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'blue',
    paddingVertical: 20,
  },
  headTxt:{
    marginTop: 10,
  }
});

export default inject("AppStore","AppVersions")(observer(VersionPage));