import axios from 'axios'
import { useMessage } from 'naive-ui'
import qs from 'qs'


const message = useMessage()

// 记录和显示错误
function errorLog(error) {
  message.error({
    content: error.message,
  })
}

const baseURL = 'http://localhost:8000';
const service = axios.create({
  baseURL: baseURL+'/api/',
  timeout: 1000000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.method === 'get'? config.params = { ...config.params, ...config.data }: (config.data = (config.headers['Content-Type'] === 'application/x-www-form-urlencoded'? qs.stringify(config.data): config.data));
    return config;
  },
  error => {
    // 发送失败
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
		if (res.code && res.code !== 1) {
			// `token` 过期或者账号已在别处登录
			if ((res.code + '').includes('401')) {
				// 清除浏览器全部临时缓存

        message.error({
          content: '您已被登出，请重新登录',
        })
			} else {
				message.error(res.message)
			}
			return Promise.reject(service.interceptors.response.error)
		} else {
			return response.data.result
		}
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误'; break;
        case 401: error.message = '未授权，请登录';
          break;
        case 403: error.message = '拒绝访问'; break;
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break;
        case 408: error.message = '请求超时'; break;
        case 500:{
          const msg = error.response.data.message;

          const str = 'NormalException: ';

          if (msg.indexOf(str) > 0) {
            error.message = msg.substr((msg.indexOf(str)) + str.length, msg.length);
          } else {
            error.message = '服务器内部错误';
          }
        }
          break;
        case 501: error.message = '服务未实现'; break;
        case 502: error.message = '网关错误'; break;
        case 503: error.message = '服务不可用'; break;
        case 504: error.message = '网关超时'; break;
        case 505: error.message = 'HTTP版本不受支持'; break;
        default: break;
      }
    }
    errorLog(error);
    return Promise.reject(error);
  }
);
export default service;