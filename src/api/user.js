import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login-in',
    method: 'post',
    data,
  })
}

export function register(data) {
  return request({
    url: '/api/register',
    method: 'post',
    data,
  })
}

export function getInfo(type = 'student') {
  return request({
    url: `/api/${type}/info`,
    method: 'get',
  })
}

export function logout(type = 'student') {
  return request({
    url: `/api/${type}/login-out`,
    method: 'post',
  })
}

/**
 * 聊天历史记录
 * @param string type student|teacher
 * @param Object params
 * @returns
 */
export function getChatHistory(type, params) {
  return request({
    url: `/api/${type}/chat-messages`,
    method: 'get',
    params,
  })
}

/**
 * 管理员推送的消息
 * @param {*} params
 * @returns
 */
export function getAdminMessageList(type, params) {
  return request({
    url: `/api/${type}/admin-messages`,
    method: 'get',
    params,
  })
}
