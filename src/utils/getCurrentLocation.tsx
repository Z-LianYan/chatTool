import { 
    init, 
    Geolocation,
    start,
    stop,
    setLocatingWithReGeocode,
    setNeedAddress,
    addLocationListener 
} from "react-native-amap-geolocation";

/**
 * 获取当前位置
 */
 export async function getCurrentLocation() {
    try {
      // android 请求权限
    //   if (IS_ANDROID) {
    //     const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //       return
    //     }
    //   }
  
      // 初始化 sdk
      await init({
        ios: "9bd6c82e77583020a73ef1af59d0c759",
        android: "4aebbdd0faddd3134a5f60a955c928ff",
      })
  
      // 监听定位变化，监听到城市位置信息之后，resolve 并停止定位
      const locationPromise = new Promise(resolve => {
        setLocatingWithReGeocode(true)
        setNeedAddress(true)
        addLocationListener((location:any) => {
          if (location && location.adCode) {
            resolve(location)
            stop()
          }
        })
      })
  
      // 超时，20 秒之后直接 resolve
      const timeoutPromise = new Promise((resolve:any) => {
        setTimeout(() => {
          stop()
          resolve()
        }, 20 * 1000)
      })
  
      start()
      return Promise.race([locationPromise, timeoutPromise])
    } catch (err) {
      console.warn(err)
    }
  }