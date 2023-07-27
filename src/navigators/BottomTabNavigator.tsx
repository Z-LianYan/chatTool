



import * as React from 'react';
import { observer, inject } from 'mobx-react'
import {Text, View, Image,useColorScheme,TouchableHighlight,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { 
  Button,
  Carousel,
  NavigationBar,
  Theme
} from '../component/teaset/index';

import MyTabBar from '../component/TabBar';
import ChatPage from '../views/ChatPage';
import AddressBookPage from '../views/AddressBookPage';
import FindPage from '../views/FindPage';
import MePage from '../views/MePage';
const routes=[
  {
    component: ChatPage, 
    name: "ChatPage", 
    options: {
      // tabBarBadge:1,
      title:'聊天',
      headerShown:false,//是否隐藏头部导航
    } 
  },
  { 
    component: AddressBookPage, 
    name:"AddressBookPage",
    options:{
      // tabBarBadge:1,
      title:'通讯录',
    }
  },
  { 
    component: FindPage, 
    name: "FindPage", 
    options: {
      // tabBarBadge:3,
      title:'发现',
      headerShown:false,//是否隐藏头部导航
    } 
  },
  { 
    component: MePage, 
    name: "MePage", 
    options: {
      // tabBarBadge:3,
      title:'我',
      headerShown:false,//是否隐藏头部导航
    } 
  }
]


const Tab = createBottomTabNavigator();

function tabBarScreen(props:any){
  return routes.map((item)=>{
    return <Tab.Screen 
    key={item.name} 
    name={item.name}
    component={item.component} 
    options={{
      ...item.options,
    }}/>
  })
}


function BottomTabNavigator(props:any) {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
    initialRouteName="HomePage"
    tabBar={_props => <MyTabBar {..._props} />}
    screenOptions={({ route }) => ({
      headerShown:true,//是否隐藏头部导航
      // tabBarIcon: ({ focused, color, size }) => {
      //   let iconName; 

      //   if (route.name === 'HomePage') {
      //     iconName = focused
      //       ? FIlM_ACTIVE_ICON
      //       : FIlM_ICON;
      //   } else if (route.name === 'CinemaPage') {
      //     iconName = focused ? CINEMA_ACTIVE_ICON : CINEMA_ICON;
      //   }else if (route.name === 'MinePage') {
      //     iconName = focused ? MINE_ACTIVE_ICON : MINE_ICON;
      //   }
      //   return <TouchableHighlight onPress={()=>{
      //     // console.log(12345)
      //   }}>
      //     <Image
      //       style={{width:20,height:20}}
      //       source={iconName}
      //     />
      //   </TouchableHighlight>;
      // },
      tabBarActiveTintColor: '#e54847',//激活的颜色
      tabBarInactiveTintColor: '#333',//未必激活的颜色

      headerTitleAlign:'center',//头部标题居中
      tabBarLabelStyle:{
        marginBottom:5
      },
      tabBarStyle:{
      },
      headerStyle: { 
        backgroundColor: colorScheme=='dark'?'#000':Theme.primaryColor,
        borderBottomWidth:1,
        borderBottomColor:colorScheme=='dark'?'#1a1b1c':Theme.primaryColor
      },
      headerTitleStyle: {
        // fontSize: 18,
        color:'#fff' 
      }
    })}
    
    >
      {tabBarScreen(props)}
    </Tab.Navigator>
  );
}
export default BottomTabNavigator;