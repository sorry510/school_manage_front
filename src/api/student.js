import request from '@/utils/request'

/**
 * 关注教师
 * @param {*} data
 * @returns
 */
export function like(data) {
  return request({
    url: `/api/student/like`,
    method: 'post',
    data,
  })
}

/**
 * 取消关注教师
 * @param {*} data
 * @returns
 */
export function unlike(data) {
  return request({
    url: `/api/student/unlike`,
    method: 'post',
    data,
  })
}

/**
 * 教师列表
 * @param {*} params
 * @returns
 */
export function getTeacherList(params) {
  return request({
    url: '/api/student/teachers',
    method: 'get',
    params,
  })
}

/**
 * 学生信息
 * @param {*} params
 * @returns
 */
export function getStudentInfo(params) {
  return request({
    url: '/api/student/student-info',
    method: 'get',
    params,
  })
}
