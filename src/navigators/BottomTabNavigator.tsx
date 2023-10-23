



import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {Text, View, Image,useColorScheme,TouchableHighlight,TouchableOpacity, Platform} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import { 
  Button,
  Carousel,
  NavigationBar,
  Theme
} from '../component/teaset/index';

import MyTabBar from '../component/TabBar';
import ChatListPage from '../views/ChatListPage';
import AddressBookPage from '../views/AddressBookPage';
import FindPage from '../views/FindPage';
import MePage from '../views/MePage';
const routes=[
  {
    component: ChatListPage, 
    name: "ChatListPage", 
    options: {
      // title:'聊天',
      headerTitle:'聊天',
      tabBarLabel: '聊天',
      headerShown:true,//是否隐藏头部导航
    } 
  },
  { 
    component: AddressBookPage, 
    name:"AddressBookPage",
    options:{
      // title:'通讯录',
      headerTitle:'通讯录',
      tabBarLabel: '通讯录',
    }
  },
  { 
    component: FindPage, 
    name: "FindPage", 
    options: {
      // title:'发现',// title 可用作 headerTitle 标题 tabBarLabel
      headerTitle:'发现',
      tabBarLabel: '发现',
      headerShown: true,//是否隐藏头部导航
      isShowDot: true,// 显示有消息点 (这个是自定义属性，不是组件本身的 )
    } 
  },
  { 
    component: MePage, 
    name: "MePage", 
    options: {
      // title:'我',
      headerTitle:'我',
      tabBarLabel: '我',
      headerShown:false,//是否隐藏头部导航
    } 
  }
]


const Tab = createBottomTabNavigator();

function tabBarScreen(props:any){
  const { AppStore } = props;
  return routes.map((item)=>{
    return <Tab.Screen 
    key={item.name} 
    name={item.name}
    component={item.component} 
    options={{
      ...item.options,
      tabBarBadge: AppStore.tabBar[item.name].msgCnt,
      headerTitle: item.options.headerTitle + (AppStore.tabBar[item.name||'']?.msgCnt?`(${AppStore.tabBar[item.name||''].msgCnt})`:'')
    }}/>
  })
}


function BottomTabNavigator(props:any) {//AppStore
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
    initialRouteName="ChatListPage"
    tabBar={_props => <MyTabBar {..._props} />}
    screenOptions={({ route }) => ({
      // headerShown:true,//是否隐藏头部导航
      headerTitleAlign:'center',//头部标题居中
      headerStyle: { 
        backgroundColor: props.MyThemed[colorScheme||'light'].bg,
        // borderBottomWidth:1,
        // borderBottomColor: props.MyThemed[colorScheme||'light'].hdbrBmCr
        height: Platform.OS === "android"?90:50
      },
      headerTitleStyle: {
        fontSize: 18,
        color: props.MyThemed[colorScheme||'light'].ftCr,
        fontWeight: 'bold'
      },
    })}
    >
      {tabBarScreen(props)}
    </Tab.Navigator>
  );
}
export default inject("AppStore","MyThemed")(observer(BottomTabNavigator));