import React,{useEffect, useState} from 'react';


import {createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { getHeaderTitle } from '@react-navigation/elements';
import {Image,useColorScheme,TouchableHighlight,TouchableOpacity} from 'react-native';
import { observer, inject, PropTypes } from 'mobx-react';

const Stack = createStackNavigator();
import {
    Text,
    View
  } from 'react-native';
import { 
    Button,
    Carousel,
    NavigationBar,
    Theme,
} from '../component/teaset/index';

import BottomTabNavigator from './BottomTabNavigator';
// import InitPage from '../views/InitPage';
import LoginPage from '../views/Login/index';
import InitPage from '../views/InitPage';
import Set from '../views/Set';
import { BACK_ICON } from '../component/teaset/icons';
import VerifyCodeLogin from '../views/Login/VerifyCodeLogin';
import RegisterPage from '../views/Register/index';
import VersionPage from '../views/VersionPage/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { any } from 'prop-types';
import AddFriend from '../views/AddFriend';
import UserDetail from '../views/UserDetail';
import SetRemarkLabel from '../views/SetRemarkLabel';
import SetLabel from '../views/SetLabel';
import NewFriendsList from '../views/NewFriendsList';
import ChatPage from '../views/ChatPage';

const routes=[
    { 
        component: BottomTabNavigator, 
        name: "AppTabBar", 
        options: {
            headerShown:false
        } 
    },
    { 
        component: LoginPage, 
        name:"LoginPage",
        options: {
            headerShown:true,
            title:'登录',
        } 
    },
    ,
    { 
        component: VerifyCodeLogin, 
        name:"VerifyCodeLogin",
        options: {
            headerShown:true,
            title:'登录',
        } 
    },

    { 
        component: RegisterPage, 
        name:"RegisterPage",
        options: {
            headerShown:true,
            title:'注册',
        } 
    },
    { 
        component: InitPage, 
        name:"InitPage",
        options: {
            headerShown:false,
            title:'',
        } 
    },
    { 
        component: Set, 
        name:"Set",
        options: {
            headerShown:true,
            title:'设置',
        } 
    },
    { 
        component: VersionPage, 
        name:"VersionPage",
        options: {
            headerShown:true,
            title:'版本',
        } 
    },
    { 
        component: AddFriend, 
        name:"AddFriend",
        options: {
            headerShown:true,
            title:'添加朋友',
        } 
    },
    { 
        component: UserDetail, 
        name: "UserDetail",
        options: {
            headerShown: false,
            title: '',
            headerStyle:{
            }
        } 
    },
    { 
        component: SetRemarkLabel, 
        name: "SetRemarkLabel",
        options: {
            headerShown: false,
            title: '',
            headerStyle:{
            }
        } 
    },
    { 
        component: SetLabel, 
        name: "SetLabel",
        options: {
            headerShown: false,
            title: '',
            headerStyle:{
            }
        } 
    },
    { 
        component: NewFriendsList, 
        name: "NewFriendsList",
        options: {
            headerShown: true,
            title: '新朋友',
            headerStyle:{
            }
        } 
    },
    { 
        component: ChatPage, 
        name: "ChatPage",
        options: {
            headerShown: true,
            title: '',
            headerStyle:{
            }
        } 
    }
    
]

function renderStackItems(MyThemed:any){
    return routes.map((item:any)=>{
        // if(item.name==='UserDetail') item.options = {
        //     ...item.options,
        //     headerStyle:{
        //         ...item.options.headerStyle,
        //         backgroundColor: MyThemed?.ctBg,
        //     }
            
        // }
        return <Stack.Screen
            key={item.name} 
            name={item.name}
            component={item.component} 
            options={item.options}
        />
    })
}



function StackNavigators(props:any){
    const { MyThemed } = props;
    let navigation:any = useNavigation();
    const colorScheme = useColorScheme();
    return <Stack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,//切换路由时的显示和隐藏的动画方式
            headerShown:true,//是否隐藏头部导航
            headerLeft:()=>{
                // return <Ionicons 
                // name={'md-chevron-back-sharp'} 
                // size={30} 
                // color={colorScheme=='dark'?'#fff':'#fff'} 
                // onPress={()=>{
                //     navigation.goBack()
                // }}/>
                return <TouchableOpacity 
                activeOpacity={0.6}
                style={{paddingLeft:10,paddingTop: 8,}}
                onPress={()=>{
                    navigation.goBack()
                }}>
                    <Image 
                    style={{width:20,height:20,tintColor: MyThemed[colorScheme||'light'].ftCr}}
                    source={BACK_ICON}
                    />
                </TouchableOpacity>
            },
            // headerRight:()=>{
            //     return <Text>Right</Text>
            // },
            headerStyle:{
                backgroundColor: MyThemed[colorScheme||'light'].bg,
                // borderBottomWidth:1,
                // borderBottomColor: MyThemed[colorScheme||'light'].hdbrBmCr
            },
            headerTitleStyle: {
                color: MyThemed[colorScheme||'light'].ftCr
            },
            // headerTintColor:'#000',//头部导航标题颜色
            headerTitleAlign:'center',//头部标题居中
            
            // header: ({ navigation, route, options, back }) => {
            //     const title = getHeaderTitle(options, route.name);
                
            //     return (
            //         <Text>custom header -- {route.name}</Text>
            //     );
            // }
            headerBackTitle:' ',//返回键右侧的文字 置为 空，配置了此项 ，ios端显示，android不显示，不配置此项android端会默认显示screen name
        }}
        // initialRouteName={props?.AppStore?.userInfo?"AppTabBar":"InitPage"}
        initialRouteName={props?.token?"AppTabBar":"InitPage"}
        >
        {renderStackItems(MyThemed[colorScheme||'light'])}
    </Stack.Navigator>
}
export default inject("AppStore","MyThemed")(observer(StackNavigators));

