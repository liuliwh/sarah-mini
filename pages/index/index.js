// index.js
// 获取应用实例
// {"key": "1", "data": "usersInfo1", "methodList": ["__PH__undefined__PH__"]}
import {
  sdk_integrate
} from "../../app"
import {
  translatePlaceHolder
} from '../../utils/util'
const app = getApp()
const COUNT_KEYS = 5

Page({
  data: {
    echo: '',
    inputValue: ''
  },
  _clearCustomData(ids) {
    let res = ids.map((i) => {
      return sdk_integrate.setDataCollector({
        slotID: `${i}`,
        data: ''
      })
    })
    this._echoResult(res)
  },
  _setCustomData(val) {
    let parsed = JSON.parse(val)
    let obj = translatePlaceHolder(parsed)
    let res = sdk_integrate.setDataCollector(obj)
    res['input'] = obj
    this._echoResult(res)
  },
  sendRequest(val) {
    // 参考https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
    let requestInput;
    try {
      requestInput = JSON.parse(val || '{}')
    } catch (e) {
      this._echoResult({
        error: `input error, ${val}`
      })
      return
    }
    requestInput.url = requestInput.url || `${app.globalData.DEFAULT_DOMAIN}/${Date.now()}`
    let reqObj = this.makeRequest(requestInput)
    reqObj.success = (res) => {
      this._processRequestEchoResult(res, reqObj)
    }
    reqObj.fail = (res) => {
      this._echoResult(res, reqObj)
    }
    wx.request(reqObj)
  },
  dispatch(e) {
    this.setData({
      echo: ''
    })
    const val = e.detail.value.customRequest
    const button_type = e.detail.target.dataset.type
    if (button_type == 'setCustomData') {
      this.setCustomData(val)
    } else if (button_type == 'sysInfo') {
      this._echoResult(app.globalData.sysInfo)
    } else {
      this.sendRequest(val)
    }
  },
  _echoResult(resp) {
    this.setData({
      echo: JSON.stringify(resp)
    })
  },
  _processRequestEchoResult(resp, reqObj) {
    let data = {
      data: resp.data,
      statusCode: resp.statusCode,
      header: resp.header,
      cookies: resp.cookies,
    }
    this._echoResult(data)
  },
  setCustomData(val) {
    let trimed = val.trim()
    if (trimed.length == 0) {
      this._clearCustomData([...Array(COUNT_KEYS).keys()].map(i => i+1))
    } else if (/^[\d\s,]+$/.test(trimed)) {
      let keys = trimed.split(',').map(item => item.trim())
      this._clearCustomData(keys)
    } else {
      this._setCustomData(val)
    }
  },
  makeRequest(req) {
    let header = req.header || {}
    header['X-IS-AJAX'] = true
    header['X-SYS-INFO'] = JSON.stringify(app.globalData.sysInfo)
    req['header'] = header
    if (('data' in req) && req.data == 'ArrayBuffer') {
      let s = 'He w!or0@#%?)'
      let abuffer = new ArrayBuffer(s.length)
      let view = new Uint8Array(abuffer)
      for (let i in s) {
        view[i] = s.charCodeAt(i)
      }
      req.data = view
      header['is_arraybuffer'] = true
    }
    return req
  }
})