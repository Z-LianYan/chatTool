
import React, {Component,PureComponent} from 'react';
import {
    ScrollView,
    NativeModules,
    Text as Txt,
    View as Vw,
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

import { BaseOverlay } from '../BaseOverlay';
import {Overlay} from '../teaset';
import { scaleView as sv,scaleText as st } from '../../utils/scaleSize';
import { SystemUpdataContent } from './SystemUpdataContent';
import { View,Text } from '../../component/customThemed';


export class SystemUpdataOverlay extends BaseOverlay{
    
     async show(isClickCheck:boolean){
        let overlayView = (
          <Overlay.View
          onCloseRequest={()=>{}}
          style={{
              alignItems: 'center', justifyContent: 'center',
          }}>
            <View style={{width:sv(500), borderRadius:sv(24),paddingHorizontal:sv(40),paddingVertical:sv(40)}}>
              <SystemUpdataContent  
              isClickCheck={isClickCheck}
              hide={()=>{
                    this.hide();
              }}/>
            </View>
          </Overlay.View>
        );
      this.overlayKey=Overlay.show(overlayView);
    }

    hide(){
        Overlay.hide(this.overlayKey)
    }
}
