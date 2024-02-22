

import React, {Component,PureComponent} from 'react';
import {
    ScrollView,
    NativeModules,
    Text,
    View,
    ActivityIndicator,
    Animated,
    PushNotificationIOS,
    Platform,
    DeviceEventEmitter,
    InteractionManager,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput
} from 'react-native'
import store from '../../store';
import { scaleView as sv,scaleText as st } from '../../utils/scaleSize';
import { HasNewVersionComp } from './HasNewVersionComp';
import { VersionUpdatingComp } from './VersionUpdatingComp';
import { checkAppUpdate } from '../../api/appVersions';
type IProps= {
    hide:()=>void,
    isClickCheck:boolean,
}
type IState={
    lastVersion:any,
    step:number,
}
export class SystemUpdataContent extends Component<IProps,IState> {

    constructor(props:any){
        super(props);
        this.state={
            lastVersion:null,
            step:1,
        }
    }
    async componentDidMount(): Promise<void> {
        let lastVersion:any = await checkAppUpdate()                      
        if(!this.props.isClickCheck){
            if(!lastVersion){
                return this.props.hide();
            }
            if(lastVersion && lastVersion.versionCode <= store.AppVersions.versionCode){
                    this.setState({
                        lastVersion:lastVersion,
                    })
                  return this.props.hide();
            }
        }
        
        let updateComMap:any={}
        let type=0 // 没有新版本。
        if(lastVersion && lastVersion.versionCode <= store.AppVersions.versionCode){
            this.setState({
                step:3,
                lastVersion:lastVersion,
            })
        }else{
            if(!lastVersion){
                this.setState({
                    step:3,
                    lastVersion:lastVersion,
                })
            }else{
                this.setState({
                    step:1,
                    lastVersion:lastVersion,
                })
            }
        }
    }
    
    render(){
        let {lastVersion,step} =this.state;
        if(!lastVersion &&  step!=3){
            return  <>
                <Text style={{fontFamily:'PingFang SC',color:'#334466',fontSize:st(25),fontWeight:"700"}}>检查更新</Text>                
                <View style={{height:sv(30)}}></View>
                <>
                    <Text>检查更新中...</Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:sv(80)}}>
                        <TouchableOpacity style={{width:sv(160),height:sv(68),backgroundColor:'#F5F9FD',alignItems:'center',justifyContent:'center',borderRadius:sv(8)}}
                        onPress={()=>{
                            this.props.hide();
                        }}
                    >
                        <Text style={{fontSize:st(26),fontFamily:'PingFang SC',color:'#334466'}}>关闭</Text>
                    </TouchableOpacity>
                    </View>
                </>
            </>
        }
        return <>
             <Text style={{fontFamily:'PingFang SC',color:'#334466',fontSize:st(25),fontWeight:"700"}}>{lastVersion && step==2?'下载中...':'检查更新'}</Text>                
                <View style={{height:sv(30)}}></View>
                {step==3?(<>
                    <Text>此v{store.AppVersions.versionName}版本为最新版本</Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:sv(80)}}>
                        <TouchableOpacity style={{width:sv(160),height:sv(68),backgroundColor:'#F5F9FD',alignItems:'center',justifyContent:'center',borderRadius:sv(8)}}
                        onPress={()=>{
                            this.props.hide();
                        }}
                    >
                        <Text style={{fontSize:st(26),fontFamily:'PingFang SC',color:'#334466'}}>关闭</Text>
                    </TouchableOpacity>
                    </View>
                </>
                ):null}
                {(lastVersion && step==1) &&<HasNewVersionComp
                lastVersion={lastVersion}
                updateHandler={()=>{
                    this.setState({
                        step:2,
                    })
                }}
                hide={()=>{
                    return this.props.hide();
                }}/>}
                {(lastVersion && step==2) && <VersionUpdatingComp 
                lastVersion={lastVersion}
                hide={()=>{
                    return this.props.hide();
                }}/>}
        </>
    }
}
