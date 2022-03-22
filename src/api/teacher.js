import request from '@/utils/request'

/**
 * 学校列表
 * @param {*} params
 * @returns
 */
export function getSchoolList(params) {
  return request({
    url: '/api/teacher/schools',
    method: 'get',
    params,
  })
}

/**
 * 申请学校列表
 * @param {*} params
 * @returns
 */
export function getApplySchoolList(params) {
  return request({
    url: '/api/teacher/schools-apply',
    method: 'get',
    params,
  })
}

/**
 * 申请学校
 * @param {*} data
 * @returns
 */
export function applySchool(data) {
  return request({
    url: '/api/teacher/schools',
    method: 'post',
    data,
  })
}

/**
 * 取消申请学校
 * @param number id
 * @returns
 */
export function deleteApplySchool(id) {
  return request({
    url: `/api/teacher/schools/${id}`,
    method: 'delete',
  })
}

/**
 * 邀请教师
 * @param {*} data
 * @returns
 */
export function invitationTeacher(data) {
  return request({
    url: `/api/teacher/invitation`,
    method: 'post',
    data,
  })
}

/**
 * 可以邀请的教师列表
 * @param {*} params
 * @returns
 */
export function getTeacherInvitationList(params) {
  return request({
    url: '/api/teacher/teachers-invitation',
    method: 'get',
    params,
  })
}

/**
 * 教师列表
 * @param {*} params
 * @returns
 */
export function getTeacherList(params) {
  return request({
    url: '/api/teacher/teachers',
    method: 'get',
    params,
  })
}

/**
 * 学生列表
 * @param {*} params
 * @returns
 */
export function getStudentList(params) {
  return request({
    url: '/api/teacher/students',
    method: 'get',
    params,
  })
}

/**
 * 我的被关注学生列表
 * @param {*} params
 * @returns
 */
export function getFollowStudentList(params) {
  return request({
    url: '/api/teacher/students-follow',
    method: 'get',
    params,
  })
}

/**
 * 添加学生
 * @param {*} data
 * @returns
 */
export function addStudent(data) {
  return request({
    url: `/api/teacher/students`,
    method: 'post',
    data,
  })
}

/**
 * 发送通知
 * @param {*} data
 * @returns
 */
export function sendMessage(data) {
  return request({
    url: `/api/teacher/messages`,
    method: 'post',
    data,
  })
}
