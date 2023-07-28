



import * as React from 'react';
import { observer, inject } from 'mobx-react';
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
import { CINEMA_ACTIVE_ICON, CINEMA_ICON, FIlM_ACTIVE_ICON, FIlM_ICON, MINE_ACTIVE_ICON, MINE_ICON } from '../assets/image';
import MyThemed from '../constants/MyThemed';
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
      isShowDot: true,//显示有消息点
    } 
  },
  { 
    component: MePage, 
    name: "MePage", 
    options: {
      tabBarBadge:3,
      title:'我',
      headerShown:false,//是否隐藏头部导航
    } 
  }
]


const Tab = createBottomTabNavigator();

function tabBarScreen(props:any){
  return routes.map((item)=>{
    // if(item.name==='FindPage') 
    return <Tab.Screen 
    key={item.name} 
    name={item.name}
    component={item.component} 
    options={{
      ...item.options,
      tabBarBadge: props.AppStore.tabBar[item.name].badge
    }}/>
  })
}


function BottomTabNavigator(props:any) {//AppStore
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
    initialRouteName="ChatPage"
    tabBar={_props => <MyTabBar {..._props} />}
    screenOptions={({ route }) => ({
      // headerShown:true,//是否隐藏头部导航
      headerTitleAlign:'center',//头部标题居中
      headerStyle: { 
        backgroundColor: MyThemed[colorScheme||'light'].bg,
        // borderBottomWidth:1,
        // borderBottomColor:config.theme[colorScheme||'light'].headerborderBottomColor
      },
      headerTitleStyle: {
        // fontSize: 18,
        color: MyThemed[colorScheme||'light'].ftCr
      }
    })}
    >
      {tabBarScreen(props)}
    </Tab.Navigator>
  );
}
export default inject("AppStore")(observer(BottomTabNavigator));