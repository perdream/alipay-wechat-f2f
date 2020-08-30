const getTimeStamp = require("../../util/getTimeStamp");
const {alipay_f2f_conf} = require("../../config/index");
const signHelper = require("./signHelper");
import axios from "axios";

/**
 * 请求阿里统一收单线下交易接口
 * @param ali_config 预创建API 公有参数
 * @param pri_config 预创建 请求参数
 * @retur {Promise}
 */

async function execute_precreate (ali_config,pri_config){
    return new Promise((resolve,reject)=>{
        const req_params = {
            // app_id : config.alipay_f2f_conf.app_id,
            // method : config.alipay_f2f_conf.precreate_method,
            app_id : ali_config.app_id,
            method : alipay_f2f_conf.precreate_method,
            format : "JSON",
            charset : "utf-8",
            "sign_type" : "RSA2",
            timestamp : getTimeStamp(),
            version : "1.0",
            notify_url : ali_config.notifyUrl,
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
        let requestUrl = alipay_f2f_conf.gatewayUrl + "?";
        requestUrl += signHelper.formatParams(req_params,false,true);
        requestUrl += `&sign=${encodeURIComponent(sign)}`;

        //向预创建订单接口发送请求
        axios({
            url:requestUrl,
            method:'POST',
            data:{
                biz_content: apiParamsContent
            }
        }).then(res=>{
            const backJson = res.data; 
            //验证签名
            const backSign = backJson['sign'];
            if(backSign == undefined){
                return reject({message:'请求网关未返回签名'})
            }
            //获取接口返回对象中key为‘alipay_trade_precreate_response’的数据
            const rootName = alipay_f2f_conf.precreate_method.replace(/\./g, "_")+'_response';
            if(backJson.rootName != undefined){
                //返回数据的签名校验
                try{
                    if(!signHelper.verifyContent(backJson[rootName],backSign,ali_config.alipayPublicKey)){
                        return reject({message:'返回值签名验证失败'})
                    }
                    return resolve(backJson[rootName]);
                }catch(error){
                    reject({message:'返回值签名验证出现异常'})
                }
            }
        }).catch(error=>{
            reject({message:'请求支付宝网关时发生错误'})
        })
    })
};

module.exports = {
    execute_precreate
}