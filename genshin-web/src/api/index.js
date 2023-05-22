import request from '@/utils/request';

export default class api {
    /**
     * 未来预测
     * @param {*} type 可选值3，7，24。分别代表未来3天预测，未来7天预测，24h预测。默认为24h预测。
     * @param {*} date 
     * @param {*} data_type :数据类型，可选值为'usage'或'carbon'
     * @returns 
     */
    static async GetGenshin(uid, command) {
        return request({ 
            url: `genshin/`,
            body: JSON.stringify({
                uid: uid.value,
                command: command,
            }),
            method: 'post',
        })
    }
}  