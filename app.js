// app.js
const sdk_integrate = require('/utils/sdk_wx4f7faed91cc7062c_2303.js');
App({
  globalData: {
    sysInfo: {},
    DEFAULT_DOMAIN: ''
  },
  onLaunch() {
    this.getSys()
    wx.getNetworkType().then(v => {this.globalData.sysInfo['NetworkType'] = v['networkType']})
    wx.onNetworkStatusChange((res) => {
      this.globalData.sysInfo['NetworkType']= res.networkType
    })
    setInterval(() => {
      wx.getBatteryInfo().then(v => {this.globalData.sysInfo['BatteryInfo'] = {
        level: v['level'],
        isCharging: v['isCharging']
      }})
    },30*1000)
  },
  getSys() {
    const names = ['version','brand','model','SDKVersion','host']
    wx.getSystemInfoAsync({
      success: (res) => {
        names.forEach((v) => {this.globalData.sysInfo[v] = res[v]})
      }
    })
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
  },
})

module.exports = {
  sdk_integrate
}
