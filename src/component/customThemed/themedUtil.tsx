

import {
  Text as DefaultText,
  View as DefaultView,
  useColorScheme,
} from 'react-native';
/**
 * 自定义hook
 * @param props
 * @param colorName
 */
export function useThemeColor(props:any, colorName:string,MyThemed:any) {
    const theme:any = useColorScheme();
    const colorFromProps = props[theme];
    
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return MyThemed[theme][colorName];
      //这里Colors ts会报错的：元素隐式具有 "any" 类型，因为类型为 "any" 的表达式不能用于索引类型 需要在tsconfig.json 里设置 "suppressImplicitAnyIndexErrors":true 就可以啦
    }
  }