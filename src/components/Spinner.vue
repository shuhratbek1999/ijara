<template>
  <div class="spinner">
    <div class="spinner-circle"></div>
  </div>
</template>

<script setup>
// Oddiy loading spinner
</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(0, 123, 255, 0.3);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
