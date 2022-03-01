/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const schoolManage = {
  path: '/school',
  component: Layout,
  redirect: 'noRedirect',
  name: 'SchoolManage',
  meta: {
    title: '学校管理',
    icon: 'component',
    roles: ['teacher'],
  },
  children: [
    {
      path: 'info',
      component: () => import('@/views/school/teacherInfo'),
      name: 'teacherInfo',
      meta: { title: '个人信息', roles: ['teacher'] },
    },
    {
      path: 'list',
      component: () => import('@/views/school/index'),
      name: 'SchoolList',
      meta: { title: '学校列表', roles: ['teacher'] },
    },
    {
      path: 'apply',
      component: () => import('@/views/school/apply'),
      name: 'SchoolApply',
      meta: { title: '我的学校申请', roles: ['teacher'] },
    },
    {
      path: 'follow',
      component: () => import('@/views/school/follow'),
      name: 'SchoolStudentFollow',
      meta: { title: '我的关注学生', roles: ['teacher'] },
    },
  ],
}

export default schoolManage
