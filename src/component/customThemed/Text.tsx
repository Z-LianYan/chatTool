

import {
  Text as DefaultText,
  View as DefaultView,
  useColorScheme,
} from 'react-native';

import { observer, inject } from 'mobx-react';

import { useThemeColor } from './themedUtil';


/**
 * 自定义Text组件，使其自动适配暗黑模式
 * @param props 参数
 * @returns {*}
 * @constructor
 */
export function Text(props:any) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  //使用hook获取当前的主题颜色
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'ftCr',props.MyThemed);
  //设置前景色
  return <DefaultText style={[{color}, style]} {...otherProps} />;
}

export default inject("MyThemed")(observer(Text));