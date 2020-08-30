const salt = "accelerator"

//阿里面对面支付公有参数
const alipay_f2f_conf = {
    //应用id(
    // "ali_appid" :"appid",

    //支付成功通知地址
    // "notifyUrl" : "http(s)://perdream.cn...",

    /* 应用RSA私钥 请勿忘记 ----BEGIN RSA PRIVATE KEY----- 与 -----END RSA PRIVATE KEY-----  */
    // "merchantPrivateKey": "",
    
    /* 支付宝公钥 如果为空会使用默认值 请勿忘记 -----BEGIN PUBLIC KEY----- 与 -----END PUBLIC KEY----- */
    // "alipayPublicKey": "",
    
    /* 支付宝支付网关 如果为空会使用沙盒网关 */
    "gatewayUrl": "https://openapi.alipay.com/gateway.do",

    /*支付宝统一收单线下交易预创建接口*/
    "precreate_method" : "alipay.trade.precreate"
};

const wxpay_f2f_conf = {
    //统一下单接口
    'wx_united_url':'https://api.mch.weixin.qq.com/pay/unifiedorder',

    //查询订单接口
    'wx_order_query':'https://api.mch.weixin.qq.com/pay/orderquery'
}

module.exports = {
    salt,
    alipay_f2f_conf,
    wxpay_f2f_conf
}