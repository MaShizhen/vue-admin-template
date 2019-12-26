import axios from 'axios'
import { /** MessageBox, */ Message } from 'element-ui'
import store from '@/store'
import { getSessionid } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent 在请求之前做一些逻辑处理

    if (store.getters.sessionid) {
      // let each request carry sessionid
      // ['X-Sessionid'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['sessionid'] = getSessionid()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      Message({
        message: response.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      /**
       * 登录状态判断
      // 50008: Illegal sessionid; 50012: Other clients logged in; 50014: Sessionid expired;
      if (response.status === 50008 || response.status === 50012 || response.status === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetSessionid').then(() => {
            location.reload()
          })
        })
      }
       */

      return Promise.reject(new Error(response.message || 'Error'))
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
