

import {
  Text as DefaultText,
  View as DefaultView,
  useColorScheme,
} from 'react-native';

import { observer, inject } from 'mobx-react';

import { useThemeColor } from './themedUtil';


function View(props:any) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'ctBg',
    props.MyThemed
  );
  //设置背景色
  return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}

export default inject("MyThemed")(observer(View));