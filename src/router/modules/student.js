/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const student = {
  path: '/student',
  component: Layout,
  redirect: 'noRedirect',
  name: 'SchoolManage',
  meta: {
    title: '我的',
    icon: 'component',
    roles: ['student'],
  },
  children: [
    {
      path: 'info',
      component: () => import('@/views/student/index'),
      name: 'StudentSchoolInfo',
      meta: { title: '个人信息', roles: ['student'] },
    },
    {
      path: 'teacher',
      component: () => import('@/views/student/teacher'),
      name: 'StudentTeachers',
      meta: { title: '教师', roles: ['student'] },
    },
  ],
}

export default student
