import md5 from './md5.min';


export function formatTimestamp(timestamp) {
    // 创建一个 Date 对象，传入时间戳
    const date = new Date(timestamp);

    // 获取年份
    const year = date.getFullYear();

    // 获取月份，注意 getMonth() 返回值是 0 - 11，所以要加 1
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // 获取日期
    const day = String(date.getDate()).padStart(2, '0');

    // 获取小时
    const hours = String(date.getHours()).padStart(2, '0');

    // 获取分钟
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 获取秒数
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 返回格式化后的时间字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const translateFunc = (q = '', from = 'auto', to) => {
    const appid = 20250530002370144;
    const key = 'Mup1WjjkyIIULd4UfLlg';
    const salt = Date.now();
    const sign = md5(`${appid}${q}${salt}${key}`)

    return new Promise((resove, reject) => {
        if (!q) resove({ trans_result: '' });
        wx.request({
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                q, from, to, appid, salt, sign
            },
            success(res) {
                if (res.statusCode === 200 && res.data.trans_result?.length > 0) {
                    const trans_result = res.data.trans_result[0].dst
                    const trans_source = res.data.trans_result[0].src
                    resove({ trans_result, trans_source, timer: formatTimestamp(Date.now()) })
                }
                reject('暂无翻译结果')
            },
            fail(e) {
                reject(e.errMsg)
            }
        })
    })
}

