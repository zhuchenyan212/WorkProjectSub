//app.js
var $ = require("utils/http.js");
App({
  data: {
    host: '',
    toolips: {
      title: '',
      hideToolips: true, //提示框先设置隐藏
    },
    loading: {
      loadingHidden: false, // loading
      content: '加载中...'
    }
  },

  onLaunch: function() {
    this.getUserInfo();
  },

  //获取用户信息
  getUserInfo: function() {
    var that = this;
    wx.setStorageSync('domain', 'https://jgj.jiaguanjiazx.com:8081');

    // 用户登录
    wx.login({
      success: res => {
        if (res.errMsg == "login:ok") {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/index/login',
            method: 'GET',
            data: {
              code: res.code,
            },
          }).then(res => {
            console.log('=====获取到用户的token========');
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  //提示框弹窗
  showMsg: function(that, title, time) {
    var _time = time || 2000
    that.setData({
      toolips: {
        hideToolips: false,
        title: title
      }
    });
    setTimeout(() => {
      that.setData({
        toolips: {
          hideToolips: true,
          title: ""
        }
      })
    }, _time);
  },

  showToast: function(that, content, time) {
    var _time = time || 2000
    that.setData({
      loading: {
        loadingHidden: false,
        content: content
      }
    });
    setTimeout(() => {
      that.setData({
        loading: {
          loadingHidden: true,
          content: ""
        }
      })
    }, _time);
  },

  //防止多次点击
  buttonClicked: function(that) {
    that.setData({
      buttonClicked: true
    })
    setTimeout(() => {
      that.setData({
        buttonClicked: false
      })
    }, 1000)
  },

  //复制文本到剪切板
  setClipboard: function(self, text) {
    var that = this;
    wx.setClipboardData({
      data: text,
      success: function() {
        wx.getClipboardData({
          success: function(res) {
            that.showMsg(self, "文本已复制", 1200);
          }
        })
      }
    })
  },

  //多选框选中事件
  checkboxChange: function(that, index) {
    let listArr = that.data.list,
      n = parseInt(0); //选中的初始值;//当前对象索引值
    listArr[index].checked = !listArr[index].checked;
    for (var i = 0; i < listArr.length; i++) {
      if (listArr[i].checked) n++;
    }
    if (n == listArr.length) {
      that.data.selectedAllStatus = true;
    } else {
      that.data.selectedAllStatus = false;
    }
    that.setData({
      selectedAllStatus: that.data.selectedAllStatus,
      list: listArr
    });
  },

  //全选框点击事件
  bindSelectAll: function(that) {
    let selectedAllStatus = that.data.selectedAllStatus,
      listArr = that.data.list;
    selectedAllStatus = !selectedAllStatus;
    for (var i = 0; i < listArr.length; i++) {
      listArr[i].checked = selectedAllStatus
    }
    that.setData({
      selectedAllStatus: selectedAllStatus,
      list: listArr
    })
  },

  //计算浮点数相乘的方法
  //浮点数相乘
  mul: function(a, b) {
    var c = 0,
      d = a.toString(),
      e = b.toString();
    try {
      c += d.split(".")[1].length;
    } catch (f) {}
    try {
      c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  }
})