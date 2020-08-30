/**
 * 微信面对面支付
 */
const wxpay_util = require('./../util/wxpay_util')
const {wxpay_f2f_conf} = require('./../config/index')

class wechat_f2f {
    constructor(wx_config) {
        this._config = {};
        this._config['appid'] = wx_config['appid'];
        this._config['mch_id'] = wx_config['mch_id'];
        this._config['notify_url'] = wx_config['notify_url'];
        this._config['wx_trade_type'] = wx_config['wx_trade_type'];
        this._config['spbill_create_ip'] = '127.0.0.1';
        this._config['body'] = wx_config['body'];
        this._config['nonce_str'] = wx_config['nonce_str'];
        this._config['out_trade_no'] = wx_config['out_trade_no'];
        this._config['total_fee'] = wx_config['total_fee'];

        //拼接API密钥生成sign
        const sign = wxpay_util.getSign(this._config, wx_config['wx_key']);
        this._config['sign'] = sign;
    }

    //统一请求统一下单接口
    static send_unifiedorder() {
        //接口的参数是xml格式，所以进行以下转换
        let obj_xml = wxpay_util.buildXML(this._config);
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: wxpay_f2f_conf.wx_united_url,
                headers: {
                    'content-type': 'text/html',
                },
                data: obj_xml
            }).then(async res => {
                let tmp = await WXpay_Util.parseXML(res.data);
                resolve(tmp)
            }).catch(async error => {
                reject(error)
            })
        })
    }

    //向微信查询订单状态
    static async  wx_orderquery(param) {
        let obj = {
            appid: param['wx_appid'],
            mch_id: param['wx_mch_id'],
            nonce_str: wxpay_util.getNonceStr(),
            out_trade_no: param['order_number'], //订单号
        }
        //拼接API密钥生成sign
        const sign = wxpay_util.getSign(obj, param['wx_key']);
        obj['sign'] = sign;
        //接口的参数是xml格式，所以进行以下转换
        const obj_xml = wxpay_util.buildXML(obj);
        return new Promise((resolve,reject)=>{
            axios({
                method: 'post',
                url: wxpay_f2f_conf.wx_order_query,
                headers: {
                    'content-type': 'text/html',
                },
                data:obj_xml
            }).then(async res=>{
                let tmp = await WXpay_Util.parseXML(res.data);
                resolve(tmp)
            }).catch(async error=>{
                reject(error)
            })
        })
        
    }
};

modules.exports = wechat_f2f