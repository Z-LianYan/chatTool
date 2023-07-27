import { PixelRatio, Dimensions } from 'react-native';
// import { myConfig } from 'src/config';
const { width, height } = Dimensions.get('window');
let fontScale = PixelRatio.getFontScale();
let pixelRatio = PixelRatio.get();
const defaultPixel = pixelRatio;
// const defaultWidth = myConfig.scaleSize.defaultWidth;
// const defaultHeight = myConfig.scaleSize.defaultHeight;;

// scaleSize:{
//     defaultWidth:1920,
//     defaultHeight:1200,
// },
console.log('width--->>>>>>',width)
console.log('height--->>>>>>',height)
const w2 = height / defaultPixel;
const h2 = width / defaultPixel;
const _scaleHeight = height / 1200;

const scale = Math.min(height / h2, width / w2);   //获取缩放比例
console.log("window",width,height,defaultPixel,scale);
export const scaleView = function (size:number) {
    const {width, height} = Dimensions.get('window');
	// var scale = Math.min(height / h2, width / w2); 
    size = Math.round(size * scale + 0.5);
    // console.info(size);
    return (size / defaultPixel)*1.1;
}
export const scaleText = function (size:number) {
    // var scale = Math.min(height / h2, width / w2); 
    // console.info(size);
    size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return( size / defaultPixel/2)
}