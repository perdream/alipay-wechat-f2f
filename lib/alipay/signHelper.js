/**
 * 生成签名内容
 * @param req_params {Objexct} 预创建 公有参数
 * @param sy_pri_config {Object} 预创建请求参数 
 */

 function getSignContent(req_params,sy_pri_config){
    const tmp = [];

    Object.keys(req_params).forEach(function (key) {
        tmp[key] = req_params[key];
    });
    Object.keys(apiParams).forEach(function (key) {
        tmp[key] = sy_pri_config[key];
    });
    //支付宝要求参数从小到达排序
    tmp = sortObject(tmp);

    //格式化参数对象‘&’拼接
    return formatParams(tmp,true,false);
 };

/**
 * 根据Object键名来排序
 * @param   {Object} obj 需要排序的Object
 * @returns {Object}
 */
function sortObject (obj) {
    return Object.keys(obj).sort().reduce((r, k) => (r[k] = obj[k], r), {});
};

/**
 * 将Params Object对象格式化为`a=1&b=2`姓氏
 * @param   {Object}   params         params
 * @param   {Boolean}  skipEmptyValue 是否跳过 value 为空的object
 * @param   {Boolean}  urlEncodeValue 是否将value进行url编码
 * @returns {String}
 */
function formatParams (params, skipEmptyValue, urlEncodeValue) {
    var content = "";

    Object.keys(params).forEach(function (key, idx) {
        var value = params[key];
        if (value == "" && skipEmptyValue) {
            return;
        }

        if (urlEncodeValue) {
            value = encodeURIComponent(value);
        }

        if (idx == 0) {
            content += `${key}=${value}`;
        } else {
            content += `&${key}=${value}`;
        }
    });
    return content;
};

/**
 * 生成签名
 * @param   {String} content     签名内容
 * @param   {String} privateKey  私钥
 * @returns {String} 
 */
function getSign (content, privateKey) {
    var cryptoSign = crypto.createSign("RSA-SHA256");
    cryptoSign.update(content, "utf8");
    return cryptoSign.sign(privateKey, "base64");
};


module.exports = {
    getSignContent,
    getSign,
    formatParams
}