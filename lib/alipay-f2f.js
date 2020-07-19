/**
 * 支付宝扫码支付
 */

const getTradeNo = require("../util/getTradeNo");
const aop = require("../lib/alipay/aop")



 class alipay_f2f{
     //初始化公有餐素
     constructor(ali_config){
        this._config = {};
        this._config["appid"] = ali_config["appid"]
        this._config["notifyUrl"] = ali_config["notifyUrl"]
        /* 默认为沙盒 详见 https://openhome.alipay.com/platform/appDaily.htm */
        this._config["gatewayUrl"] = ali_config["gatewayUrl"]
        this._config["merchantPrivateKey"] = ali_config["merchantPrivateKey"]
        this._config["alipayPublicKey"] = ali_config["alipayPublicKey"]
    }

    /**
     *创建二维码订单（可返回支付URL和二维码图片） 
     *@param {Object} options 支付宝统一shoudan单线下交易预创建接口请求参数
     *      必填 out_trade_no  String  商户订单号,64个字符以内、只能包含字母、数字、下划线；需保证在商户端不重复
     *      必填 total_amount  Price   订单总金额，单位为元，精确到小数点后两位
     *      必填 subject       String  订单标题
     *      可选 body          String  订单描述
     *      可选 timeout_express String  该笔订单允许的最晚付款时间，逾期将关闭交易,取值范围：1m～15d
     *      可选 qr_code_timeout_express 扫码超时
     * @return {Promise}
     */

     createORCodeOrUrl(options){
         return new Promise((resolve,reject)=>{
             const out_trade_no = options['out_trade_no'] || getTradeNo();
             const total_amount = options['total_amount'];
             const subject = options['subject'];
             const body = options['body'] || '';
             const timeout_express = options['timeout_express'] || 5;
             const qr_code_timeout_express = options['qr_code_timeout_express'] || 5;

            if(out_trade_no == ""){
                return reject({
                    message:"out_trade_no 商户订单号不能为空"
                })
            };

            if(total_amount == ""){
                return reject({
                    message:"total_amount 订单金额不能为空"
                })
            };

            if(subject == ""){
                return reject({
                    message:"subject 订单标题不能为空"
                })
            };

            timeExpress = parseInt(timeout_express);
            if (isNaN(timeExpress)) {
                return reject({
                    message: "timeout_express 参数非法."
                });
            }
            timeExpress = timeExpress + "m";
            qrExpress = parseInt(qr_code_timeout_express);
            if (isNaN(qrExpress)) {
                return reject({
                    message: "qr_code_timeout_express 参数非法."
                });
            }
            qrExpress = qrExpress + "m";

            const alipayRequestData = {
                "subject" : subject,
                "body" : body,
                "out_trade_no" : out_trade_no,
                "total_amount" : total_amount,
                "timeout_express" : timeExpress,
                "qr_code_timeout_express" : qrExpress
            };

            //请求统一收单线下交易预创建接口
            aop.execute_precreate(this._config,alipayRequestData).then(res=>{
                resolve(res)
            }).catch(error=>{
                reject(error)
            });
         })
     }
 };

 module.export = alipay_f2f;
 