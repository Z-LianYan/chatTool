
import * as React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  useColorScheme,
} from 'react-native';
 
import store from '../store';
/**
 * 自定义hook
 * @param props
 * @param colorName
 */
export function useThemeColor(props:any, colorName:string) {
  const theme:any = useColorScheme();
  const colorFromProps = props[theme];


  // console.log('Colors[theme][colorName]=====>>',Colors[theme],Colors[theme][colorName],colorName)
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return store.MyThemed[theme][colorName];
    //这里Colors ts会报错的：元素隐式具有 "any" 类型，因为类型为 "any" 的表达式不能用于索引类型 需要在tsconfig.json 里设置 "suppressImplicitAnyIndexErrors":true 就可以啦
  }
}
 
/**
 * 自定义Text组件，使其自动适配暗黑模式
 * @param props 参数
 * @returns {*}
 * @constructor
 */
export function Text(props:any) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  //使用hook获取当前的主题颜色
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'ftCr');
  //设置前景色
  return <DefaultText style={[{color}, style]} {...otherProps} />;
}
 
export function View(props:any) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'bg',
  );
 
  //设置背景色
  return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}