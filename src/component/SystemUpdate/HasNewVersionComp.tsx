

import React, { Component, PureComponent } from 'react';
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
import { scaleView as sv, scaleText as st } from '../../utils/scaleSize';

type IProps = {
    hide: () => void,
    lastVersion: any,
    updateHandler: () => void,
}
type IState = {}
export class HasNewVersionComp extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }
    calcPackageSize(num: number) {
        return parseInt(num / 1024 / 1024 + '') + 'MB';
    }
    render() {
        console.log('this.props.lastVersion---->>', this.props.lastVersion);
        return <>
            <Text style={{ fontFamily: 'PingFang SC', color: '#334466', marginTop: sv(0) }}>发现最新版本v{this.props.lastVersion.versionName}，约{this.calcPackageSize(this.props.lastVersion.size)}</Text>
            <View style={{ height: sv(10) }}></View>
            {
                this.props.lastVersion.remark.split(/\n/g).map((txt: string, idx: number) => {
                    return <Text style={{ fontFamily: 'PingFang SC', color: '#334466', marginTop: sv(0) }} key={idx}>{txt}</Text>
                })
            }
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: sv(60) }}>
                <TouchableOpacity style={{ width: sv(168), height: sv(58), backgroundColor: '#F5F9FD', alignItems: 'center', justifyContent: 'center', borderRadius: sv(8) }}
                    onPress={() => {
                        this.props.hide();
                    }}
                >
                    <Text style={{ fontSize: st(26), fontFamily: 'PingFang SC', color: '#334466' }}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: sv(168), height: sv(58), backgroundColor: '#E63141', alignItems: 'center', justifyContent: 'center', borderRadius: sv(8), marginLeft: sv(24) }}
                    onPress={() => {
                        this.props.updateHandler()
                    }}
                >
                    <Text style={{ fontSize: st(26), fontFamily: 'PingFang SC', color: '#FBFDFF' }}>立即更新</Text>
                </TouchableOpacity>
            </View>
        </>
    }
}
