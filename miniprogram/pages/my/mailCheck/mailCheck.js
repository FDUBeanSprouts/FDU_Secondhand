// miniprogram/pages/my/mySetting/mySetting.js
const app = getApp()
var auth=app.globalData.auth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonLoading: false,
    button2Loading: false,
    studentId: '',
    passWord:'',
    authorized:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var studentId = that.data.studentId;
    var passWord = that.data.passWord;
    console.log(auth)
    wx.getStorage({  //异步获取缓存值studentId
      key: 'studentId',
      success: function (res) {
        that.setData({
          studentId: res.data
        })

      }
    })
    wx.getStorage({  //异步获取缓存值studentId
      key: 'passWord',
      success: function (res) {
        that.setData({
          passWord: res.data
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ipnutStudentId: function (e) {
    var num = e.detail.value;
    var reg = /^([A-Za-z0-9_\-\.])+\@fudan.edu.cn$/;
    if (reg.test(num)) {
      this.setData({
        studentId: num
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '邮箱有误',
      })
    }

  },
  inputPassWord: function (e) {
    var num = e.detail.value;
    this.setData({
      passWord: num
    })
      this.setData({
        passWord: num
      })

    
  },
  bindSubmit: function () {
    var that = this;
    this.setData({
      buttonLoading: true
    })
    var that = this;
    var studentId = that.data.studentId;
    var passWord = that.data.passWord;
    //调用云函数，去获取后端返回的状态
    wx.cloud.callFunction({
      name: 'sendmail',
      data:{
        studentMail:studentId
      },
      success(res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '验证码发送成功',
        })
      },
    })
    this.setData({
      buttonLoading: false,
    })
  },
  verifySubmit: function () {
    var that = this;
    this.setData({
      button2Loading: true
    })
    var that = this;
    var studentId = that.data.studentId;
    var passWord = that.data.passWord;
    //检查验证码是否正确
    wx.cloud.callFunction({
      name: 'verifycode',
      data:
      {
        studentMail: studentId,
        enteredCode: passWord,
      },
      success(res) {
        console.log(res);
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '提示',
            content: '验证码错误',
          })
        }
        else
        {
          //成功则保存邮箱信息
          wx.setStorage({
            key: 'studentId',
            data: studentId,
          })
          wx.showModal({
            title: '提示',
            content: '验证成功',
            success: function (res) {
              this.setData({
                auth:true,
              })
              if (res.confirm) {
                console.log('用户点击确定')
                wx.setStorage({
                  key: 'passWord',
                  data: '',
                  success()
                  {
                    wx.navigateBack()
                  }
                })
              } else {
                console.log('用户点击取消')
              }
              
            }
          })
        }
        this.setData({
          button2Loading: false,
        })
      },
    })
  },
})