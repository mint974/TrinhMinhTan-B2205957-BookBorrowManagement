<template>
  <div id="app">
    <template v-if="hideLayout">
      <router-view />
    </template>
    <template v-else>
      <div class="admin-layout">
        <Sidebar />
        <div class="main-content">
          <Navbar />
          <div class="content-wrapper">
            <router-view />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

const route = useRoute();
const hideLayout = computed(() => route.meta.hideLayout || false);
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8f9fa;
}

#app {
  min-height: 100vh;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 1.5rem;
}

@media (max-width: 991.98px) {
  .main-content {
    margin-left: 70px;
  }

  .content-wrapper {
    padding: 1rem;
  }
}
</style>
