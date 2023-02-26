# About
这是用于配合自动化测试项目的demo微信小程序.
# 功能
每隔30s获取电量信息,监听network type变换.将系统信息以http request header X-SYS-INFO 发送给server,主要是为了验证集成sdk的系统信息数据采集功能。sysInfo样例: X-Sys-Info: {"version":"8.0.5","brand":"devtools","model":"iPhone 5","SDKVersion":"2.19.4","NetworkType":"wifi","BatteryInfo":{"level":100,"isCharging":true}}

配合后端echo server将收到的信息以response header['X-SYS-INFO']的方式原样返回，即可在UI进行呈现，测试用例可从UI回显进行验证。说明:以response header而不是body返回的主要原因是,downloadfile api是无法通过echo server的response body data来返回这些信息，所以就通过response header echo。

配合network intercept功能，也可难集成sdk的系统信息数据采集功能的正确性。
# 页面功能
## 主页面
目的:用于测试wx.request的hook 以及数据收集功能.
### 测试request
| 输入样例                                                                     | 用途                                                |
|------------------------------------------------------------------------------|-----------------------------------------------------|
| 空                                                                           | 向app.js globalData.DEFAULT_DOMAIN的根路径发送GET请求                                       |
| {"url":"https://exampl.com/path","header":{"Header-A":"abc"},"method":"GET"}                                                                           | 向指定url发送对应的请求，参数配置参照小程序API文档                                      |
### 测试数据收集功能
| 输入样例                                                                     | 用途                                                |
|------------------------------------------------------------------------------|-----------------------------------------------------|
| 空                                                                           | 重置所有数据收集功能的配置                                       |
| 1,2 | 重置数据收集功能针对key为1和2的配置|
| 1 | 重置数据收集功能针对key为1的配置|
| {"key":"1","data":"something"} | 配置数据收集功能key为1 |

## UpDownLoad页面
目的：用于测试hook wx.uploadfile, wx.downloadfile功能.
输入样例: 参照小程序官方集成文档,本页面的输入样例与主页面的测试request功能使用方式相似.