/**
 * 订单号生成方法
 */

 const config = require("../config/index");

const getTradeNo = function(){
    const time = Date.now().toString();
    const random = (((0.1 + Math.random())*100000).toString()).slice(1,5);
    return  config.salt + time + random;
};

module.exports = getTradeNo