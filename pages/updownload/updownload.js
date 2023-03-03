// pages/updownload/updownload.js
const app = getApp()
const fs = wx.getFileSystemManager()

Page({

  /**
   * Page initial data
   */
  data: {
    echo: '',
    inputValue: ''
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
  _upload(reqObj) {
    reqObj.success = (res) => {
      this._processRequestEchoResult(res)
    }
    reqObj.fail = (res) => {
      this._echoResult(res)
    }
    reqObj['filePath'] = `${wx.env.USER_DATA_PATH}/hello`
    reqObj['name'] = 'file'
    fs.access({
      path: reqObj['filePath'],
      success: (res) => {
        // 文件存在
        wx.uploadFile(reqObj)
      },
      fail: (res) => {
        // 文件不存在
        fs.writeFile({
          filePath: reqObj['filePath'],
          data: 'some text or arrayBuffer',
          encoding: 'utf8',
          success(res) {
            wx.uploadFile(reqObj)
          },
          fail(res) {
            this._echoResult({
              echo: 'failed to create file.'
            })
          }
        })
      }
    })
  },
  dispatch(e) {
    this.setData({
      echo: '',
    })
    const val = e.detail.value.customRequest
    let reqObj;
    try {
      reqObj = JSON.parse(val || '{}')
    } catch (e) {
      this._echoResult({
        error: `input error, ${val}`
      })
      return
    }
    this._makeRequest(reqObj)
    const button_type = e.detail.target.dataset.type
    if (button_type == 'upload') {
      reqObj.url = reqObj.url || `${app.globalData.DEFAULT_DOMAIN}/a_dummy`
      this._upload(reqObj)
    } else if (button_type == 'download') {
      // https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html
      reqObj.url = reqObj.url || `${app.globalData.DEFAULT_DOMAIN}/a_dummy`
      this._download(reqObj)
    }else if (button_type == 'request') {
      reqObj.url = reqObj.url || `${app.globalData.DEFAULT_DOMAIN}/${Date.now()}`
      this._request(reqObj)
    }
  },
  _request(reqObj) {
    reqObj.success = (res) => {
      this._processRequestEchoResult(res, reqObj)
    }
    reqObj.fail = (res) => {
      this._echoResult(res, reqObj)
    }
    wx.request(reqObj)
  },
  _download(reqObj) {
    reqObj.success = (res) => {
      const filePath = reqObj['filePath'] || res.tempFilePath
      fs.getFileInfo({
        filePath: filePath,
        success: (fileRes) => {
          console.log(res)
          let finalResult = {
            data: {
              size: fileRes.size,
              digest: fileRes.digest,
            },
            statusCode: res.statusCode,
            header: res.header,
            cookies: res.cookies,
          }
          this._processRequestEchoResult(finalResult)
          fs.unlink({
            filePath: filePath
          })
        }
      })
    }
    reqObj.fail = (res) => {
      this._echoResult(res)
    }
    wx.downloadFile(reqObj)
  },
  _makeRequest(reqObj) {
    let header = reqObj.header || {}
    header['X-IS-AJAX'] = true
    header['X-SYS-INFO'] = JSON.stringify(app.globalData.sysInfo)
    reqObj['header'] = header
  },
  _echoResult(res) {
    this.setData({
      echo: JSON.stringify(res)
    })
  }
})