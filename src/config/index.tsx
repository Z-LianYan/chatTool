
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
  ...dev,
  STATUS_BAR_HEIGHT : Platform.OS === "android"?  StatusBar.currentHeight : StatusBarManager.HEIGHT,
}

process.env.NODE_ENV=='development'?config = {
  ...config,
  ...dev
}: config = {
  ...config,
  ...prod
}

export default config;