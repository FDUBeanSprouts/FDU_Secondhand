//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    navList: [{
        icon: '/images/nav-icon/书.png',
        events: 'goToFenlei',
        text: '二手书籍'
      },
      {
        icon: '/images/nav-icon/数码家电.png',
        events: 'goToFenlei',
        text: '数码家电'
      },
      {
        icon: '/images/nav-icon/生活用品.png',
        events: 'goToFenlei',
        text: '生活用品'
      },
      {
        icon: '/images/nav-icon/护肤美妆.png',
        events: 'goToFenlei',
        text: '护肤美妆'
      },
      {
        icon: '/images/nav-icon/更多.png',
        events: 'goToFenlei',
        text: '更多'
      },
    ],
    goodsList: [{
      coverMiddle: '/images/goods/01.jpg',
      events: 'goToBangDan',
      intro: '数字设计',
      price: '￥15',
      nums: '3',
      seller: '草莓屁屁',
      tag: '二手书籍'
    },
    {
      coverMiddle: '/images/goods/02.jpg',
      events: 'goToBangDan',
      intro: '蓝牙耳机',
      price: '￥360',
      nums: '8',
      seller: '奈寒',
      tag: '数码产品'
    },
    {
      coverMiddle: '/images/goods/03.jpg',
      events: 'goToBangDan',
      intro: '美宝莲卸妆水',
      price: '￥69',
      nums: '1',
      seller: '豆',
      tag: '护肤化妆'
    },
    {
      coverMiddle: '/images/goods/04.jpg',
      events: 'goToBangDan',
      intro: '美宝莲口红',
      price: '￥80',
      nums: '4',
      seller: '茜茜子',
      tag: '护肤美妆'
    },
  ],
    swiperCurrent: 0,
  },

  /**
   * 生命周期函数 —— 监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = 'https://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?code=43_310000_3100&device=android&version=5.4.45';

    // 调用自己封装的工具函数，在utils中
    utils.myRequest({
      url: url,
      methods: 'GET',
      success: function(result){
        that.setData({
          showitem: true,
          guess: result.data.paidArea.list,
          xiaoshuocontent: result.data.hotRecommends.list[0].list,
          xiangshengcontent: result.data.hotRecommends.list[2].list,
          lishicontent: result.data.hotRecommends.list[3].list
        })
      },
      fail: function() {
        that.setData({
          showitem: false
        })
      }
    });
  },
  // 宫格导航改变事件
  goToBangDan: function() {
    wx.navigateTo({
      url: '/pages/classification/classification',
    })
  },
  // 上新推荐改变事件
  gotoDetails(e) {
    var url = e.currentTarget.dataset.coverimg;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/details/index',
    })
    //wx.navigateTo({
    //  url: '/pages/details/details?url=' + url + '&title=' + title,
    //})
  }
})
