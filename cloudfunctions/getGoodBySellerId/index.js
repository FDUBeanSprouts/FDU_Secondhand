/**
 * API
 *   通过卖家ID获取商品信息
 * 参数
 *   userId （可选）卖家ID；若不填则默认为当前用户
 * 返回
 *   statusCode 状态码
 *   statusMsg 状态信息
 *   data 商品信息
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
    const queryResult = await db.collection('second-hand-good').where({
      sellerId: db.command.eq(userId)
    }).get()
    console.log(queryResult)
    return {
      statusCode: 200,
      statusMsg: 'ok',
      data: queryResult.data
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      statusMsg: 'fail',
    }
  }
}