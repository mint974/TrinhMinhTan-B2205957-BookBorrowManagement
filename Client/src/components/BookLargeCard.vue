<template>
  <div class="large-card d-flex align-items-center rounded-4 shadow-sm text-white">
    <img :src="image" alt="" class="large-img rounded-4 me-3" />

    <div>
      <h5 class="fw-bold">{{ title }}</h5>
      <p class="m-0">{{ subtitle }}</p>
      <small class="opacity-75">{{ status }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookLargeCard",
  props: {
    image: String,
    title: String,
    subtitle: String,
    status: String
  }
};
</script>

<style scoped>
.large-card {
  width: 320px;
  height: 140px;
  padding: 15px;
  background: linear-gradient(120deg, #2a3b4d, #0f1c29);
}
.large-img {
  width: 90px;
  height: 120px;
  object-fit: cover;
}
.large-card:hover {
  transform: translateY(-4px);
  transition: 0.2s;
}
</style>
