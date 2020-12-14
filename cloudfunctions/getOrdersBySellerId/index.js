/**
 * API
 *   获取用户作为卖方的所有订单
 * 参数
 *   userId （可选）用户ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 数据
 */

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


exports.main = async (event, context) => {
  // 参数检查
  const openid = cloud.getWXContext().OPENID
  var userId = event.userId;
  if (userId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: db.command.eq(openid)
      }).get()
      console.log(userResult)
      userId = userResult.data[0]._id
      if (userId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'can not get userid'
      }
    }
  }

  // 数据库操作
  try {
    // 查询这个卖家发布的所有商品
    const goodQueryResult = await cloud.callFunction({
      name: 'getGoodBySellerId',
      data: { userId: userId }
    })
    console.log(goodQueryResult.result)

    // 对每个商品，都查询已经生成的订单
    let orderList = []
    for (let good of goodQueryResult.result.data) {
      let orderQueryResult = await db.collection('order').where({
        goodId: db.command.eq(good._id)
      }).get()
      orderList = orderList.concat(orderQueryResult.data)
    }
    console.log(orderList)

    return {
      statusCode: 200,
      statusMsg: 'get orders ok',
      data: orderList
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'get orders fail'
    }
  }
}