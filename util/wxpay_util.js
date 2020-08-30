const crypto = require('crypto');
const xml2js = require('xml2js');

class WXpay_Util {

    //生成随机字符串
    static getNonceStr = (length = 16) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let noceStr = '', maxPos = chars.length;
        while (length--) noceStr += chars[Math.random() * maxPos | 0];
        return noceStr;
    };

    //订单号生成
    static getTradeNo = (salt = 'default') => {
        const time = Date.now().toString();
        const random = (((0.1 + Math.random()) * 100000).toString()).slice(1, 5);
        return salt + time + random;
    }

    //将参数集合拼接成url键值对的形式
    static toQueryString = (obj) => Object.keys(obj)
        .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
        .sort()
        .map(key => key + '=' + obj[key])
        .join('&');

    //三种加密
    static md5 = (str, encoding = 'utf8') => crypto.createHash('md5').update(str, encoding).digest('hex');
    static sha256 = (str, key, encoding = 'utf8') => crypto.createHmac('sha256', key).update(str, encoding).digest('hex');
    static encryptRSA = (key, hash) => crypto.publicEncrypt(key, new Buffer(hash)).toString('base64');


    //生成签名
    static getSign = (params, wx_key, type = 'MD5') => {
        const stringA = this.toQueryString(params)
        let str = stringA + '&key=' + wx_key;
        switch (type) {
            case 'MD5':
                return WXpay_Util.md5(str).toUpperCase();
            case 'HMAC-SHA256':
                return WXpay_Util.sha256(str, wx_key).toUpperCase();
            default:
                throw new Error('signType Error');
        }
    }

    //拼接xml
    static buildXML = (obj, rootName = 'xml') => {
        const opt = { xmldec: null, rootName, allowSurrogateChars: true, cdata: true };
        return new xml2js.Builder(opt).buildObject(obj);
    };

    //解析xml (统一下单接口返回xml结构数据)
    static parseXML = async (xml) => new Promise((resolve, reject) => {
        const opt = { trim: true, explicitArray: false, explicitRoot: false };
        xml2js.parseString(xml, opt, (err, res) => err ? reject(new Error('XMLDataError')) : resolve(res || {}));
    });

    //安全签名校验
    static signVerify(jsonData, total_fee, wx_key) {
        return Promise((resolve, reject) => {
            if (jsonData.result_code == 'SUCCESS') {
                let obj = {
                    appid: jsonData.appid,
                    bank_type: jsonData.bank_type,
                    cash_fee: jsonData.cash_fee,
                    fee_type: jsonData.fee_type,
                    is_subscribe: jsonData.is_subscribe,
                    mch_id: jsonData.mch_id,
                    nonce_str: jsonData.nonce_str,
                    openid: jsonData.openid,
                    out_trade_no: jsonData.out_trade_no,
                    result_code: jsonData.result_code,
                    return_code: jsonData.return_code,
                    time_end: jsonData.time_end,
                    total_fee: jsonData.total_fee,
                    trade_type: jsonData.trade_type,
                    transaction_id: jsonData.transaction_id
                };

                //拼接API密钥生成sign
                const sign = wxpay_util.getSign(obj, wx_key);

                //检验sign 签名和订单金额是否一致
                if (sign == jsonData.sign && total_fee == (jsonData.total_fee) * 1) {
                    resolve(this.parseXML({
                        'return_code':'SUCCESS'
                    }))
                }else{
                    reject(this.parseXML({
                        'return_code':'FAIL'
                    }))
                }
            }else{
                reject(this.parseXML({
                    'return_code':'FAIL'
                }))
            }
        })
    }
}

module.export = WXpay_Util;