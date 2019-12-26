import request from '@/utils/request'
import { productid, systemid } from '@/utils/config'

export function login(data) {
  return request({
    url: '/user-login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param {*} sessionid 描述 string
 */
export function getInfo(sessionid) {
  return request({
    url: '/user-info',
    method: 'post',
    data: { sessionid }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 获取用户权限信息
 * @param {*} role_no 角色编号，如果不传递将按照第一个角色信息返回
 */
export function get_auth_info(role_no) {
  return request({
    url: '/get-auth-info',
    method: 'post',
    data: {
      clienttype: '3',
      productid,
      role_no,
      systemid
    }
  })
}
