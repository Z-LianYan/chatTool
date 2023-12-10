
import {
  Platform,
  StatusBar,
  NativeModules,
} from 'react-native';

// const {  StatusBarManager } = NativeModules;
// export const STATUS_BAR_HEIGHT = Platform.OS === "android"?  StatusBar.currentHeight : StatusBarManager.HEIGHT

// export const HOST = process.env.NODE_ENV=='development'?'http://192.168.0.26:7002':'http://film.imgresource.com.cn'

export default {
  HOST: 'http://192.168.0.101:7002'
}