// pages/interval/interval.js
const app = getApp()
let intervalID = undefined
let counter = 0
Page({

  /**
   * Page initial data
   */
  data: {
    echo: '',
    inputValue: ''
  },
  dispatch(e) {
    this.setData({
      echo: '',
    })
    const val = e.detail.value.customRequest
    const button_type = e.detail.target.dataset.type
    if (button_type == 'set_url_prefix') {
      this.setData({inputValue: val})
    } else if (button_type == 'start') {
      this._start_interval()
    } else if (button_type == 'stop') {
      this._clearInterval()
    }
  },
  _start_interval() {
    let prefix = this.data.inputValue || app.globalData.DEFAULT_DOMAIN
    if (prefix.length == 0) {
      this.setData({echo:'请输入urlprefix'})
      return
    }
    if (intervalID) {
      console.log('Interval已经启动，忽略此请求')
      return
    }
    intervalID = setInterval(() => this._sendRequest(), 5*1000)
  },
  _sendRequest() {
    let prefix = this.data.inputValue || app.globalData.DEFAULT_DOMAIN
    wx.request({
      'url': `${prefix}/${Date.now()}`,
      'header': {
        'X-IS-AJAX': true,
        'X-SYS-INFO':JSON.stringify(app.globalData.sysInfo)
      },
      complete: (res) => {
        counter += 1
        this._echoResult({
          counter,
          sysInfo: app.globalData.sysInfo
        })
      }
    })
  },
  _echoResult(res) {
    this.setData({echo: JSON.stringify(res)})
  },
  _clearInterval() {
    if (intervalID) {
      console.log('clear interval')
      clearInterval(intervalID)
      intervalID = undefined
    }
  },
  onHide() {
    this._clearInterval()
  }

})