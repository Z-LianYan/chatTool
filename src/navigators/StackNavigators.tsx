import React,{useEffect} from 'react';


import {createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { getHeaderTitle } from '@react-navigation/elements';
import {Image,useColorScheme,TouchableHighlight,TouchableOpacity} from 'react-native';

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
const routes=[
    { 
        component: BottomTabNavigator, 
        name: "AppTabBar", 
        options: {
            headerShown:false
        } 
    },
    
]

function renderStackItems(){
    return routes.map((item)=>{
        return <Stack.Screen
            key={item.name} 
            name={item.name}
            component={item.component} 
            options={item.options}
        />
    })
}



function StackNavigators(){
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
                return <Text>1234</Text>
            },
            // headerRight:()=>{
            //     return <Text>Right</Text>
            // },
            headerStyle:{
                // backgroundColor:colorScheme=='dark'?'#000':Theme.primaryColor,
                backgroundColor:colorScheme=='dark'?'#000':'blue',
                borderBottomWidth:1,
                borderBottomColor:colorScheme=='dark'?'#1a1b1c':Theme.primaryColor,
                
            },
            headerTitleStyle: {
                color: '#fff'
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
        initialRouteName="AppTabBar"
        >
        {renderStackItems()}
    </Stack.Navigator>
}

export default StackNavigators;