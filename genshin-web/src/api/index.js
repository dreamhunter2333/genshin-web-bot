import request from '@/utils/request';

export default class api {
    /**
     * 接口测试
     * @param {*} uid 
     * @param {*} command 
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