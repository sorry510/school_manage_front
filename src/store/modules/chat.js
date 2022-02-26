const state = {
  studentIds: new Set(), // 当前弹框的students
  teacherIds: new Set(), // 当前弹框的teachers
}

const mutations = {
  ADD_STUDENT_ID: (state, id) => {
    state.studentIds.add(id)
  },
  DELETE_STUDENT_ID: (state, id) => {
    state.studentIds.delete(id)
  },
  ADD_TEACHER_ID: (state, id) => {
    state.teacherIds.add(id)
  },
  DELETE_TEACHER_ID: (state, id) => {
    state.teacherIds.delete(id)
  },
}

const actions = {
  addStudentId({ commit }, id) {
    commit('ADD_STUDENT_ID', id)
  },
  deleteStudentId({ commit }, id) {
    commit('DELETE_STUDENT_ID', id)
  },
  addTeacherId({ commit }, id) {
    commit('ADD_TEACHER_ID', id)
  },
  deleteTeacherId({ commit }, id) {
    commit('DELETE_TEACHER_ID', id)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
