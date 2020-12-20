//my.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {
      nickName: '',
      picId: '', 
    },
    authorized:false,
    loaded:0,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      that.setData({
        userInfo: app.globalData.userInfo,
      })
    } 
    if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log('授权')
      app.userInfoReadyCallback = res => {
        console.log(res)
        var tmp=res.userInfo
        console.log(tmp)
        var nickName = 'userInfo.nickName';
        var picId='userInfo.picId';
        that.setData({
          [nickName]: tmp.nickName,
          [picId]: tmp.avatarUrl,
        });
      }
  
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfos
          that.setData({
            userInfo: res.userInfo,
          })
          console.log('在没有 open-type=getUserInfo 版本的兼容处理')
        }
      })
    }
    //调用addUser,只有新用户能成功入user库
    wx.cloud.callFunction({
      name: 'addUser',
      data:{
        name:that.data.userInfo.nickName,
        picId:that.data.userInfo.picId,
        gender:0,
      },
      success(res) {
        console.log('成功添加用户', res);
        that.onShow();
      },
      fail: console.error,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
   console.log(that.data)
   /*
   wx.getStorage({  //异步获取缓存值studentId
    key: 'authorized',
    success: function (res) {
      console.log('成功获取用户授权信息',res)
      that.setData({
        authorized: res.data
      })

    }
  })*/
  //检查用户是否授权
/*wx.getSetting({
  success:function(res)
  {
    if (res.authSetting['scope.userInfo']) 
    {
      console.log(res)
    }
    else{
      console.log('not valid')
    }
  },
  fail: console.error,
})*/
 //更新用户自定义头像昵称
 wx.cloud.callFunction({
  name: 'getUserById',
  data:{
    // userId:"fakeuserid1",
  },
  success(res) {
    console.log('成功获取用户信息', res.result.data);
    var nickName = 'userInfo.nickName';
    var picId='userInfo.picId';
    that.setData({
      [nickName]: res.result.data.name,
      [picId]: res.result.data.picId,
      loaded:1,
      authorized:res.result.data.authorized,
    });
    //console.log(that.data.userInfo)
  },
  fail: console.error,
})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  onPullDownRefresh(){

  },

    //授权相关，备用
/*wx.getSetting({
  success:function(res)
  {
    if (res.authSetting['scope.userInfo']) 
    {
      console.log(res)
    }
    else{
      console.log('not valid')
    }
  },
  fail: console.error,
})
  bindGetUserInfo: function(e) {
    var that = this;
    var nickName = that.data.userInfo.nickName;
    var picId = that.data.userInfo.picId;
    
    if (e.detail.userInfo) {
       //用户按了允许授权按钮
       var userInfo = e.detail.userInfo;
      that.setData({
        nickName: userInfo.nickName
      })
      that.setData({
        picId : userInfo.picId
      })
      try {//同步设置nickName
        wx.setStorageSync('nickName', userInfo.nickName)
      } catch (e) {
      }
      
      wx.setStorage({
        key: 'picId',
        data: userInfo.picId,
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '请授权登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              delta: 1
            })
          } else {
            console.log('用户点击取消')
            wx.navigateBack({
              delta: 1
            })
          }
          
        }
      })
    }
  },
  bindClear: function (e) {
    var that = this;
    var nickName = 'userInfo.nickName';
    var picId = 'userInfo.picId';
   
    try {//同步设置nickName
      wx.setStorageSync('nickName', '')
    } catch (e) {
    }
    wx.setStorage({
      key: 'picId',
      data: '',
    })
    that.setData({
      [nickName]: '个人信息',
      [picId]: ''
    })
    wx.showModal({
      title: '提示',
      content: '退出账号成功',
      success: function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
  */
cartTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'myCart/myCart'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
addressTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({
      url:'addressAdmin/addressAdmin'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能修改',
    icon:'none',
    duration: 3000,
  })
}
},
postTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'myPost/myPost'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
sellTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'mySell/mySell'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
buyTap(e){
  var that=this;
  if(that.data.authorized==true)
  {
    wx.navigateTo({

      url:'myBuy/myBuy'
  })
}
else
{
  wx.showToast({
    title: '认证用户才能查看',
    icon:'none',
    duration: 3000,
  })
}
},
modifyTap(e){
  var that=this;
  wx.navigateTo({
      url:'modifyUser/modifyUser'
  })
},
mailTap(e){
  var that=this;
  if(that.data.authorized==false)
  {
    wx.navigateTo({

      url:'mailCheck/mailCheck'
  })
}
else
{
  wx.showToast({
    title: '已认证',
    icon:'success',
    duration: 3000,
  })
}
},
uploadPic(e)
{
  var that=this;
  var nickName = that.data.userInfo.nickName;
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      wx.showLoading({
        title: '上传中',
      })
      wx.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        success: (res) => {
          console.log(res)
          wx.cloud.callFunction({
            name: 'updateUserInfo',
            data: {
              file: res.data,
              name: nickName
            },
            success: function(res) {
              //console.log(res.result)
              if (res.result.statusCode==200)
              {
                console.log(res)
                wx.showToast({
                  icon: 'none',
                  title: '上传成功',
                })
                that.onShow();//刷新头像
                console.log('刷新成功')
              }
              else
              {
                console.error('[上传文件] 失败')
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
              }
            },
            fail: console.error,
            complete: () => {
              wx.hideLoading()
            }
          })
        }
      })
    },
    fail: console.error
  })
}
}
)
