/**
 * 登录鉴权，获取token登录态
 * @author jialong
 * @version 1.0.0 | 2018-05-11
 */
import wepy from 'wepy'
import config from 'config'

const loginHost = config.loginHost
const loginUrl = `${loginHost}/wechat/getOpenId`
const errorObj = {
  err: 9999,
  msg: '网络请求错误，请稍后重试',
  status: 'failed'
}
const getToken = param => {
  const { appName, version } = config
  param = {
    ...param,
    appName,
    version
  }
  return wepy.request({
    url: loginUrl,
    data: param,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST'
  }).then(res => {
    const { statusCode } = res
    if (statusCode !== 200) {
      return ''
    } else {
      let resData = res.data || {}
      if (resData.code !== 0) {
        return ''
      }
      let token = resData.data || ''
      return token
    }
  }).catch((errorRes = {}) => {
    const { msg = '网络请求错误，请稍后重试' } = errorRes
    wepy.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
    return ''
  })    
}

export { getToken }
