// miniprogram/pages/my/myCart/myCart.js
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:false,    // 全选状态，默认全选

  },
  onShow() {
    var that = this
    wx.cloud.callFunction({
      name: 'getCartByUserId',
      data:{
        userId: 'fakeuserid1',
      },
      success(res) {
        console.log('成功',res.result.data)
        if(res.result.data){
        var carts=[]
        for (let i = 0; i < res.result.data.length; i++)
        {
          carts.push({'_id':res.result.data[i]._id,'title':res.result.data[i].intro,'image':res.result.data[i].coverMiddle,'price':res.result.data[i].price,'selected':false,'seller_id':res.result.data[i].sellerId})
        }
        that.setData({
          carts: carts,
        });
          if(res.result.data.length){
          that.setData({
            hasList: true,
          });
        }
      }
      },
    })
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    console.log(carts[index].seller_id)
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    wx.cloud.callFunction({
      name: 'delCart',
      data:{
        goodId:carts[index]._id,
        userId: 'fakeuserid1',
      },
      success(res) {
        console.log('成功');
      },
    })
    carts.splice(index,1);
    this.setData({
      carts : carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  
  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total +=  carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  gotoDetails(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var goodId = carts[index]._id
    console.log(goodId)
    wx.navigateTo({
      url: '/pages/details/index?key=' + goodId
    })
},
// 结算
addtoOrder(e)
{
  let carts = this.data.carts;                  // 获取购物车列表
  for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中
        console.log(carts[i]._id)
        wx.cloud.callFunction({
          name: 'addOrder',
          data: {
            goodId: carts[i]._id,
            userId:"fakeuserid1"
          },
          success(res) {
            console.log('成功', res);
            wx.showToast({
              title: '等待卖家确认',
              duration: 2000,
            })
          },
        })
      }
    }
    
}
})

