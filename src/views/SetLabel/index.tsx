import React, { useState,useEffect, useRef, useCallback } from 'react';
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
  View as Vw,
  Alert
} from 'react-native';

import { 
  NavigationContainer,
  DarkTheme,
  DefaultTheme, 
} from '@react-navigation/native';
// import { View } from '../../component/customThemed';
import { ADD_ICON, FRIENDCIRCLE, MAN_AVATAR, QRCODE, RIGHT_ARROW, SETICON, WOMAN_AVATAR } from '../../assets/image';
import MyCell from '../../component/MyCell';
import { 
  View,
  Text
} from '../../component/customThemed';
import { Button, Input } from '../../component/teaset';
import NavigationBar from '../../component/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runInAction } from 'mobx';
import AddEditLabel from './AddEditLabel';
import { delFriendsLabel, getFriendsLabelList } from '../../api/friendsLabel';
import { editFriends } from '../../api/friends';
const SetLabel = ({ 
  MyThemed,
  AppStore,
  navigation,
  route
}:any) => {
    
  const colorScheme = useColorScheme();
  const { params } = route;
  const { search_user_info } = params;
  const search_user_id = search_user_info?.user_id;
  const { userInfo } = AppStore;
  const [labels,setLabels] = useState<any>([]);
  const [selectLabels,setSelectLabels] = useState<any>([]);
  const addEditLabelRef:{current:any} = useRef();
  let [formData,setFormData] = useState<any>({})
  console.log('search_user_info====>>',search_user_info);
  useEffect(()=>{
    
    (async function(){
      await getLabelList();
    })()
    const unsubscribe = navigation.addListener('state', async() => {
      // 处理路由变化的逻辑
      let info:any = await AsyncStorage.getItem('remarkLabel');
      info = info?JSON.parse(info):{};
      // setFormData({
      //   ...info
      // })
      formData = {
        labels: search_user_info.labels||(info[search_user_id]?.labels ? info[search_user_id]?.labels:[]),
        f_user_name_remark: search_user_info?.f_user_name_remark||info[search_user_id]?.f_user_name_remark,
        des: search_user_info?.des || info[search_user_id]?.des,
      };
      
      // setSelectLabels((info && info[search_user_id]?.labels) ? info[search_user_id]?.labels:[])
      setSelectLabels(formData?.labels ? JSON.parse(JSON.stringify(formData?.labels)):[])
      setFormData({
        ...formData
      })
    });
    return unsubscribe;
  },[route?.params?.search_user_info]);
  const getLabelList = useCallback(async ()=>{
    const result:any = await getFriendsLabelList({});
    console.log('label---',result);
    setLabels([
      ...result.rows
    ]);
  },[])
  
  return <ScrollView style={{
    ...styles.container,
    // backgroundColor: MyThemed[colorScheme||'light'].ctBg
  }}>
    <NavigationBar
    backgroundColor={MyThemed[colorScheme||'light'].bg}
    onBack={()=>{
      navigation.goBack()
    }}
    title={'从全部标签中添加'}
    rightView={<View  style={{paddingRight:10}}>
      <Button title="保存" type="primary" onPress={async ()=>{
        let info:any = await AsyncStorage.getItem('remarkLabel');
        console.log('info===>>>',info)
        info = info?JSON.parse(info):{};
        info[search_user_id] = {
          ...info[search_user_id],
          labels: selectLabels,
        }
        if(search_user_info?.isFriends){
          await editFriends({
            label_ids: selectLabels.map((item:any)=>item.label_id),
            friends_id: search_user_info?.friends_id
          });
        }
        
        await AsyncStorage.setItem('remarkLabel',JSON.stringify(info));
        
        info[search_user_id] = {
          ...info[search_user_id],
          des: formData.des,
          f_user_name_remark: formData.f_user_name_remark,
        }
        navigation.navigate({//向上一个页面传递参数
          name: 'SetRemarkLabel',
          params:{
            search_user_info: {
              ...search_user_info,
              ...info[search_user_id],
              msg: search_user_info.msg
            },
          },
          merge: true,
        })
        // navigation.goBack();
      }}/>
    </View>}/>
    <View style={{
      ...styles.alreadySelectLabelContainer,
      backgroundColor: MyThemed[colorScheme||'light'].ctBg,
      flexWrap: 'wrap'
    }}>
      {
        selectLabels.map((item:any,index:number)=>{
          return <TouchableOpacity 
          activeOpacity={0.6}
          key={item.label_id+'selectLabel'+Math.random()}
          style={{
            ...styles.labelTxtWrapper,
            backgroundColor: item.selected? MyThemed[colorScheme||'light'].primaryColor:'#cde9da',
          }}
          onPress={()=>{
            let idx = selectLabels.findIndex((it:any)=>it.selected==true);
            if(idx!==-1 && idx!==index)  delete selectLabels[idx].selected;
            if(selectLabels[index].selected){
              selectLabels.splice(index,1);
            }else{
              selectLabels[index].selected = true;
            }
            setSelectLabels(JSON.parse(JSON.stringify([
              ...selectLabels
            ])));
          }}>
            <Text style={{
              ...styles.labelTxt,
              color: item.selected?'#fff': MyThemed[colorScheme||'light'].primaryColor,
            }}>
              {item.label_name} {item.selected?'x':''}
            </Text>
          </TouchableOpacity>
        })
      }
      
      {
        !selectLabels.length && <Text style={{
          ...styles.labelTxtWrapper,
          color: MyThemed[colorScheme||'light'].ftCr2
        }}>选择标签</Text>
      }
    </View>

    <Vw style={{flexDirection:'row',justifyContent:'space-between',paddingVertical: 20, paddingHorizontal: 10}}>
      <Text>全部标签<Text style={{fontSize: 10}}>(双击删除标签，长按编辑)</Text></Text>
      {/* <Text onPress={()=>{
        console.log('99999==>>')
      }}>
        编辑
        <Image style={styles.rightArrow} source={RIGHT_ARROW}/>
      </Text> */}
    </Vw>
    {
      !labels.length && <Vw style={{}}>
        <Text style={{height:100,lineHeight: 100,textAlign:'center',color: MyThemed[colorScheme||'light'].ftCr2}}>没有标签</Text>
      </Vw>
    }
    
    <Vw style={{
      ...styles.alreadySelectLabelContainer,
      flexWrap: 'wrap'
    }}>
      {
        labels.map((item:any,index:number)=>{
          return <TouchableOpacity 
          activeOpacity={0.6}
          key={item.label_id+'selectLabel'}
          style={{
            ...styles.labelTxtWrapper,
            backgroundColor: selectLabels.some((it:any)=>it.label_id==item.label_id)? MyThemed[colorScheme||'light'].primaryColor:MyThemed[colorScheme||'light'].ctBg,
          }}
          onPress={()=>{
            const handlerSelectLabels = ()=>{
              let idx = selectLabels.findIndex((it:any)=>item.label_id==it.label_id);
              console.log('idx=======>>',idx);
              if(idx===-1){
                selectLabels.push(item);
              }else{
                selectLabels.splice(idx,1);
              };
              setSelectLabels(JSON.parse(JSON.stringify([
                ...selectLabels
              ])));
              (this as any).isTimer = '';
            }
            if(!(this as any).isTimer){
              (this as any).timer = setTimeout(() => {
                handlerSelectLabels();
              }, 300);
              (this as any).isTimer = 'duble';
            }else{
              clearTimeout((this as any).timer);
              (this as any).isTimer = '';
              Alert.alert(
                `你确定删除"${item.label_name}"标签吗？`,
                "",
                [
                  {
                    text: "取消",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "确定", onPress: async () => {
                    await delFriendsLabel({label_id:item.label_id});
                    await getLabelList();
                    handlerSelectLabels();
                  }}
                ]
              );
            }

          }}
          onLongPress={()=>{
            addEditLabelRef?.current.open(async ()=>{
              await getLabelList()
            },item,'edit');
          }}
          >
            <Text style={{
              ...styles.labelTxt,
              color: selectLabels.some((it:any)=>it.label_id==item.label_id)?'#fff':MyThemed[colorScheme||'light'].ftCr2,
            }}>
              {item.label_name}
            </Text>
          </TouchableOpacity>
        })
      }
    </Vw>
    <Vw style={{
      ...styles.alreadySelectLabelContainer,
    }}>
      <Button 
      title={<Text style={{
        color: MyThemed[colorScheme||'light'].ftCr2,
      }}>
        <Image 
        style={{
          width: 14,
          height: 14,
          tintColor: MyThemed[colorScheme||'light'].ftCr2
        }} 
        source={ADD_ICON}/>
        新建标签
      </Text>} 
      type="default" 
      style={{width: 100,height: 40,marginTop: 30,borderRadius: 20,borderColor: MyThemed[colorScheme||'light'].ftCr2}}
      onPress={()=>{
        addEditLabelRef?.current.open(async ()=>{
          await getLabelList()
        });
      }}/>
    </Vw>
    

    <AddEditLabel ref={addEditLabelRef}/>
  </ScrollView>
};

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  alreadySelectLabelContainer:{
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  labelTxtWrapper:{
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10
  },
  labelTxt:{
  },
  rightArrow:{
    width: 15,
    height: 15,
  }
});

export default inject("AppStore","MyThemed")(observer(SetLabel));
