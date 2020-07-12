/**
 * 获取时间戳
 */

function getTimeStamp() {
    var date  = new Date();
    var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day   = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mins  = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var sec   = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${date.getFullYear()}-${month}-${day} ${hours}:${mins}:${sec}`;
};

module.exports = getTimeStamp