// pages/message/chatrm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    i:0,
    inputMessage : '',
    histMess : [
    ],
    Mess : [],
    timer : '',
    messages: '',
    speakee: '',
    setInter: '',
    touchStart: 0,
    touchEnd: 0,
    ifshow: false,
    delId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      speakee: options.sellerId
    })
    var that = this;
    that.data.setInter = setInterval(
      function() {
        var result = '';
        wx.cloud.callFunction({
          name: 'getMessages',
          data: {
            thisUserId: 'fakeuser1',
            anotherUserId: 'fakeuser2'
          },
          success(res) {
            if(res.result.statusMsg=='wrong code')
            {
              wx.showModal({
                title: '消息提示',
                content: '添加消息失败',
              })
            }
            else{
              console.log(res);
              that.setData({
                messages: res.result.data
              })
            }
          },
        })
      },500
    )
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  renewMess(e){
    var result = '';
    var that = this;
    wx.cloud.callFunction({
      name: 'getMessages',
      data: {
        thisUserId: 'fakeuser1',
        anotherUserId: 'fakeuser2'
      },
      success(res) {
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '消息提示',
            content: '添加消息失败',
          })
        }
        else{
          that.setData({
            messages: res.result.data,
            ifshow: false,
          })
        }
      },
    });
    this.notShow();
  },

  notShow: function(){
    this.setData({
      ifshow: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.setInter);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.setInter);
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

  onClick: function(){

  },

  formSubmit(e){
  },

  textChange(e){
    this.setData({
      inputMessage : e.detail.value,
    });
  },

  touchStart: function(e){
    var that = this;
    this.setData({
      touchStart : e.timeStamp
    })
  },

  touchEnd: function(e){
    var that = this;
    this.setData({
      touchEnd : e.timeStamp
    })
  },

  longtapDelete:function(e){
    var that = this;
    that.setData({
      ifshow: true,
      delId: e.currentTarget.dataset.index
    })
  },

  inputRenew(e){
    var history = this.data.histMess;
    history.push({
      message: this.data.inputMessage,
      response: 'this is a response'
    });
    var i = this.data.i;
    console.log('the inputMessage is '+this.data.inputMessage);
    wx.cloud.callFunction({
      name: 'addMessage',
      data: {
        senderId: 'fakeuser1',
        receiverId: 'fakeuser2',
        content: this.data.inputMessage
      },
      success(res) {
        console.log(res);
        if(res.result.statusMsg=='wrong code')
        {
          wx.showModal({
            title: '消息提示', 
            content: '添加消息失败',
          })
        }
      },
    })
    this.setData({
      inputMessage : '',
      i : i+1,
      histMess : history
    });
  },
})


/*

    <view class="input-box2">
      {{item.content}}
    </view>

*/