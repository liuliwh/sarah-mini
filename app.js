// app.js
const sdk_integrate = require('/utils/sdk_wx_data.js');
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
        let _res = {}
        names.forEach((v) => _res[v]=res[v])
        this.globalData.sysInfo = _res
      }
    })
  },
})

module.exports = {
  sdk_integrate
}
