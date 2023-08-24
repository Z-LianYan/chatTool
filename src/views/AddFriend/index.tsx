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



const AddFriend = ({AppStore,MyThemed,navigation,AppVersions}:any) => {
    
  const colorScheme = useColorScheme();

  const [value, setValue] = useState()

  useEffect(()=>{
  })


  return <ScrollView
    style={styles.container}
    stickyHeaderIndices={[]}
    onMomentumScrollEnd={(event:any)=>{}}>
      
      {/* <MyCell
      style={{marginTop:0}}
      title='关于' 
      showBottomBorder={false}
      showRightArrow={true}
      rightValue={'版本号'+AppVersions.versionName}
      onPress={()=>{
        navigation.navigate('VersionPage');
      }}/> */}
      {/* <View>
        <Input
        size='lg'
        value={value}
        onChangeText={(text:any)=>{
          setValue(text);
        }}
        style={{backgroundColor: MyThemed[colorScheme||'light'].ftCr}}
        />
      </View> */}


      <TouchableOpacity activeOpacity={0.6}>
        <View style={styles.inputWrapper}>
            {/* <Image 
            style={{
              width: 25,height:25,
              tintColor: MyThemed[colorScheme||'light'].ftCr
            }} 
            source={SEARCH2X}/> */}
            <Text style={{
              ...styles.inputeText,
              color: MyThemed[colorScheme||'light'].ftCr2
            }}>账号/手机号</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.inputBom}>
        我的微信号：{AppStore.userInfo.mobile_phone}
        <Image 
        style={{
          width: 15,
          height: 15,
          marginHorizontal: 10,
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
  inputWrapper:{
    
  },
  inputeText:{
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
  },
  inputBom:{
    textAlign: 'center',
    marginTop: 20
  }
});

export default inject("AppStore","MyThemed")(observer(AddFriend));
