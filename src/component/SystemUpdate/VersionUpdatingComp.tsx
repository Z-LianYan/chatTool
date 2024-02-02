

import React, {Component,PureComponent} from 'react';
import {
    ScrollView,
    AsyncStorage,
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
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
    downloadAndInstallApk,
  } from 'react-native-update';
  import { 
    Button,
    Carousel,
    // NavigationBar,
    Theme,
    ListRow,
    Toast,
    Input,
    Overlay
  } from '../../component/teaset/index';
import { scaleView as sv,scaleText as st } from '../../utils/scaleSize';
import currency from 'currency.js';
import { forHorizontalIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators';
// import ToastUtil from 'src/utils/ToastUtil';
// import { ShadowButton } from '../../components/ShadowButton';
type IProps= {
    hide:()=>void,
    lastVersion:any,
}
type IState={
    download_url:string,
    progress:number,
    totalsize:number,
    receivedsize:number,
    diffsize:number,
    isShowRetryBtn:boolean,
}
export class VersionUpdatingComp extends Component<IProps,IState> {
    private timer:any;
    private lastDownloadTime:number=0;
    constructor(props:any){
        super(props);
        this.state={
            download_url:props.lastVersion?.download_url||"",
            totalsize:props.lastVersion.package_size||0,
            receivedsize:0,
            progress:0,
            diffsize:0,
            isShowRetryBtn:false,
        }
    }
    async componentDidMount(){
        console.log('------------>>',this.state.download_url)
        if(this.state.download_url){
           this.downloadApp();
        }
    }
    downloadApp(){
         try{
            downloadAndInstallApk({
                url: this.state.download_url,
                onDownloadProgress: ({ received, total }) => {
                    // 已下载的字节数received, 总字节数total
                    var progress = currency((received/total)*100).value;
                    console.log("received-this.state.receivedsize",received, this.state.receivedsize);
                    this.lastDownloadTime=Date.now();
                    if(progress==100){
                        clearInterval(this.timer);
                    }
                    this.setState({
                        progress:progress,
                        receivedsize:received,
                        diffsize:received-this.state.receivedsize,
                    })
                    // Toast.message("已下载:"+progress+"%");                  
    
                    // this.setState({
                    //   received,
                    //   total,
                    // });
                },
            }); 
            this.timer = setInterval(()=>{
                console.log("Date.now()-this.lastDownloadTime",Date.now()-this.lastDownloadTime);
                if(this.lastDownloadTime && (Date.now()-this.lastDownloadTime)>6000){
                    this.lastDownloadTime=0;
                    this.setState({
                        isShowRetryBtn:true,
                        progress:0,
                        receivedsize:0,
                        diffsize:0,
                    })
                    // ToastUtil.fail("下载失败！");
                    console.log('下载失败！')
                    
                    clearInterval(this.timer);
                }
            },500)
        }catch(err){
            console.log("downloadAndInstallApk-err:",err);
        }
    }
    componentWillUnmount(): void {
        clearInterval(this.timer);
    }
    calcPackageSize(num:number){
        // let numkb=num/1024/1024
        // if(numkb>0){
        //     return numkb
        // }
        return currency(num/1024/1024+'').value+'MB';
    }
    render(){
        return <>
           
           <View style={{
            backgroundColor: '#F5F9FD',
            height:sv(24),
            width:sv(400),
            borderRadius:sv(6),
            marginBottom:sv(12),
            overflow:"hidden",
           }}>
                <View style={{width:this.state.progress+'%',height:'100%',backgroundColor:"#05c160"}}></View>
           </View>
           <Text style={{fontSize:st(23),color:"#334466",fontWeight:"600",fontFamily:"PingFang SC"}}>{this.calcPackageSize(this.state.receivedsize)}/{this.calcPackageSize(this.state.totalsize)}，下载速度:{this.calcPackageSize(this.state.diffsize)}/s</Text>
            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:sv(80)}}>
                
                
                {this.state.isShowRetryBtn?<Button 
                    style={{width:sv(246),height:sv(70),backgroundColor:'#05c160',borderWidth: 0,}} 
                    titleStyle={{color:'#fff'}} 
                    title="重新下载" 
                    size="md"
                    onPress={()=>{
                        this.downloadApp();
                        this.lastDownloadTime=Date.now();
                        this.setState({
                            isShowRetryBtn:false,
                        })
                    }}/>:null}

                    {this.state.progress==100?<View style={{flexDirection: 'row'}}>
                        <Button 
                        style={{width:sv(200),height:sv(70),backgroundColor:'#ccc',borderWidth: 0,}} 
                        titleStyle={{color:'#334466'}} 
                        title="取消" 
                        size="md"
                        onPress={()=>{
                            // this.downloadApp();
                            // this.lastDownloadTime=Date.now();
                            // this.setState({
                            //     isShowRetryBtn:false,
                            // })
                            this.props.hide()
                        }}/>
                        <Button 
                        style={{width:sv(200),height:sv(70),backgroundColor:'#05c160',borderWidth: 0, marginLeft: 10}} 
                        titleStyle={{color:'#fff'}} 
                        title="重新下载" 
                        size="md"
                        onPress={()=>{
                            this.downloadApp();
                            this.lastDownloadTime=Date.now();
                            this.setState({
                                isShowRetryBtn:false,
                            })
                        }}/>
                    </View>:null}
                
            </View>
        </>
    }
}
