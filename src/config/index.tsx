
import {
  Platform,
  StatusBar,
  NativeModules,
} from 'react-native';

import dev from './dev';
import prod from './prod';

const {  StatusBarManager } = NativeModules;

let config = {
  // HOST: '',
  STATUS_BAR_HEIGHT : Platform.OS === "android"?  StatusBar.currentHeight : StatusBarManager.HEIGHT,//状态栏高度
  ...dev,
}

process.env.NODE_ENV=='development1'?config = {
  ...config,
  ...dev
}: config = {
  ...config,
  ...prod
}

export default config;