/**
 * API：
 *   发布商品
 * 参数说明：
 *   coverMiddle 图片url
 *   desc 商品描述
 *   intro 商品名
 *   price 商品价格
 *   sellerId （可选）作为卖家的用户ID；若不填则为当前用户
 *   tag 商品类别
 * 返回说明：
 *   statusCode 状态码 成功时为200
 *   statusMsg 状态信息
 */

const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // 参数检查
  var sellerId = event.sellerId;
  if (sellerId == null) {
    try {
      userResult = await db.collection('user').where({
        openid: _.eq(cloud.getWXContext().OPENID)
      }).get()
      console.log(userResult)
      sellerId = userResult.data[0]._id
      if (sellerId == null) throw 'openid may not exist'
    } catch (err) {
      console.log(err)
      return {
        statusCode: 500,
        statusMsg: 'can not get userid'
      }
    }
  }
  if (event.coverMiddle == null || event.desc == null || event.intro == null || event.price == null || event.tag == null) {
    return {
      statusCode: 400,
      statusMsg: 'coverMiddle, desc, intro, price and tag can not be null'
    }
  }

  // 数据库操作
  try {
    const addResult = await db.collection('second-hand-good').add({
      data: {
        coverMiddle: event.coverMiddle,
        desc: event.desc,
        intro: event.intro,
        price: event.price,
        tag: event.tag,
        sellerId: sellerId,
        date: new Date().getTime(),
        nums: 0,
        sold: false
      }
    })
    console.log(addResult)
    return {
      statusCode: 200,
      statusMsg: 'add good ok',
      data: {
        goodId: addResult._id
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      statusMsg: 'add good fail',
    }
  }
  // .then((res) => {
  //   return {
  //     statusCode: 200,
  //     statusMsg: 'ok'
  //   }
  // }).catch((err) => {
  //   return {
  //     statusCode: 500,
  //     statusMsg: err
  //   }
  // })
}