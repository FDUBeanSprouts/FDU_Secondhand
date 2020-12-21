//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  data: {
    goodId: '',
    comment: '',
    goodsList: [],
    commentsList: [],
    cmLen: 0,
    seller: '卖家',
    swiperCurrent: 0,
    star: 0,
    sold: false,
  },

  /**
   * 生命周期函数 —— 监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const key = options.key;
    wx.cloud.callFunction({
      name: 'getGoodById',
      data: {
        goodId: key
      },
      success(res) {
        console.log('成功加载商品', res.result.data);
        let newList = res.result.data
        wx.cloud.callFunction({
          name: 'getUrlsByPicIds',
          data: {
            picIdList: [newList.coverMiddle]
          },
          success(newres) {
            console.log('成功加载图片', newres)
            newList.coverMiddle = newres.result.data.urlList[0]
            wx.cloud.callFunction({
              name: 'getUserById',
              data: {
                userId: newList.sellerId
              },
              success(newres1) {
                console.log('成功加载用户名', newres1)
                newList['sellerName'] = newres1.result.data.name
                wx.cloud.callFunction({
                  name: 'checkFavoriteByUserIdAndGoodId',
                  data: {
                    goodId: key
                  },
                  success(newres2) {
                    console.log('成功加载收藏状态', newres2)
                    const flag = newres2.result.data.flag
                    let starStatus = 0
                    if (flag)
                      starStatus = 1
                    that.setData({
                      goodId: key,
                      goodsList: [newList],
                      seller: newres1.result.data.name,
                      star: starStatus,
                      sold: res.result.data.sold
                    });
                  }
                })
              }
            })
          }
        })
      },
    }),
      wx.cloud.callFunction({
        name: 'getCommentsByGoodId',
        data: {
          goodId: key,
        },
        success(res) {
          console.log('成功获取留言', res)
          const comments = res.result.data
          const l = comments.length
          comments.sort(function(a, b) {
            return b.time - a.time
          })
          for (let i = 0; i < l; i++) {
            const t = comments[i].time
            const date = new Date(t + 8 * 3600 * 1000)
            const new_t = date.toJSON().substr(0, 19)
              .replace('T', ' ').replace(/-/g, '.')
            comments[i].time = new_t
          }
          for (let i = 0; i < l; i++) {
            const picId = comments[i].userInfo.picId
            wx.cloud.callFunction({
              name: 'getUrlsByPicIds',
              data: {
                picIdList: [picId]
              },
              success(res) {
                console.log('成功加载评论头像', res.result.data.urlList)
                comments[i].userInfo.picId = res.result.data.urlList[0]
              }
            })
            if (i == l - 1) {
              that.setData({
                commentsList: comments,
                cmLen: l
              })
            }
          }
        }
      })
    wx.cloud.callFunction({
      name: 'addHistory',
      data: {
        goodId: key,
      },
      success(res) {
        console.log('成功加入历史记录', res);
      },
    })
  },

  // 收藏
  setFavor(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'setFavorite',
      data: {
        goodId: id,
      },
      success(res) {
        if (res.result.statusCode == 400) {
          console.log('收藏失败')
          wx.showToast({
            title: '不能收藏自己的',
            duration: 2000,
            icon: 'none'
          })
        }
        else {
          console.log('成功收藏', res);
          wx.showToast({
            title: '收藏成功',
            duration: 2000,
            icon: 'none',
          })
          that.setData({
            star: 1
          })
        }
      },
      fail(res) {
        console.log('收藏失败', res)
        wx.showToast({
          title: '不能收藏自己的',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  // 收藏取消
  delFavor(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'delFavorite',
      data: {
        goodId: id,
      },
      success(res) {
        console.log('成功取消收藏', res);
        wx.showToast({
          title: '取消收藏成功',
          duration: 2000,
          icon: 'none',
        })
        that.setData({
          star: 0
        })
      },
    })
  },

  // 加购
  addCart(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'addCart',
      data: {
        goodId: id,
      },
      success(res) {
        if (res.result.statusCode == 400) {
          console.log('加购失败')
          wx.showToast({
            title: '不能加购自己的',
            duration: 2000,
            icon: 'none',
          })
        }
        else {
          console.log('成功加购', res);
          wx.showToast({
            title: '加购成功',
            duration: 2000,
            icon: 'none',
          })
        }
      },
      fail(res) {
        console.log('加购失败', res)
        wx.showToast({
          title: '不能加购自己的',
          duration: 2000,
          icon: 'none',
        })
      }
    })
  },

  // 结算
  addOrder(e) {
    var that = this;
    const id = that.data.goodId;
    wx.cloud.callFunction({
      name: 'addOrder',
      data: {
        goodId: id,
      },
      success(res) {
        if (res.result.statusCode == 400) {
          console.log('下单失败')
          wx.showToast({
            title: '不能买自己的',
            duration: 2000,
            icon: 'none',
          })
        }
        else {
          console.log('成功下单', res);
          wx.showToast({
            title: '下单成功',
            duration: 2000,
            icon: 'none',
          })
        }
      },
      fail(res) {
        console.log('下单失败', res)
        wx.showToast({
          title: '不能买自己的',
          duration: 2000,
          icon: 'none',
        })
      }
    })
  },

  descInput: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },

  // 发布留言
  doPost: function () {
    var that = this;
    const id = that.data.goodId
    const c = that.data.comment
    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        goodId: id,
        content: c
      },
      success: function (res) {
        console.log('成功发布留言：', res)
        wx.showToast({
          title: '发布成功',
          duration: 2000,
          icon: 'none',
          success: function() {
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/details/index?key=' + id
              })
            }, 1000)
          }
        });
      },
    })
  },

  // 跳转个人页
  jumpTo: function(e) {
    const userId = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: '/pages/userPage/userPage?sellerId=' + userId
    })
  },

  gotoFenlei(e) {
    var text=e.currentTarget.dataset.text;
    let str = JSON.stringify(text)
    console.log('goto: '+ str);
    wx.navigateTo({
      url: '/pages/category/category?str=' + str,
    })
  }
})