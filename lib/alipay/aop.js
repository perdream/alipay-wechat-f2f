const getTimeStamp = require("../../util/getTimeStamp");
const config = require("../../config/index");
const signHelper = require("./signHelper")

/**
 * 请求阿里统一收单线下交易接口
 * @param ali_config 预创建API 公有参数
 * @param pri_config 预创建 请求参数
 * @retur {Promise}
 */

function execute_precreate (ali_config,pri_config){
    return new Promise((resolve,reject)=>{
        const req_params = {
            app_id : config.alipay_f2f_conf.app_id,
            method : config.alipay_f2f_conf.precreate_method,
            format : "JSON",
            charset : "utf-8",
            "sign_type" : "RSA2",
            timestamp : getTimeStamp(),
            version : "1.0",
            notify_url : config.alipay_f2f_conf.notifyUrl,
        };
        
        //预创建请求参数序列化 赋值 biz_content
        const stringfy_req_params = JSON.stringify(pri_config);

        //生成签名内容
        const signContent = signHelper.getSignContent(req_params,{biz_content:stringfy_req_params})

        //生成签名
        let sign = null;
        try{
            sign = signHelper.getSign(signContent,ali_config.merchantPrivateKey)
        }catch(error){
            return reject({ message: "生成请求签名时错误"});
        };

        //将公有参数拼接到Get请求url
        let requestUrl = ali_config.gatewayUrl + "?";
        requestUrl += signHelper.formatParams(req_params,false,true);
        requestUrl += `&sign=${encodeURIComponent(sign)}`;

        //向预创建订单接口发送请求
        //TODO
    })
};

module.exports = {
    execute_precreate
}