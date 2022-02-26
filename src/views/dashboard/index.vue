<template>
  <div class="dashboard-container">
    <h1 class="title" style="text-align: center">欢迎使用 {{ value }}</h1>
  </div>
</template>

<style lang="scss" scoped>
.title {
  margin: 50px auto;
}
</style>
<script>
export default {
  data() {
    return {
      value: new Date(),
    }
  },
}
</script>
