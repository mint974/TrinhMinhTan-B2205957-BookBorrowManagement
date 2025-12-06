<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isAuthPage() {
      return this.$route.path === '/login' || this.$route.path === '/register';
    }
  }
}
</script>
