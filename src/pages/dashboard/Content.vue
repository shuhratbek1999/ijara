<template>
    <router-view></router-view>
</template>

<script>
export default {
    
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.container-fluid {
  padding: 10px;
}
.content {
  margin-top: -50px;
}
</style>