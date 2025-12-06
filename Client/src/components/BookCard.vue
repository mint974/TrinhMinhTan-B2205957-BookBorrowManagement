<template>
  <div class="book-card shadow-sm p-2 rounded-4 bg-white">
    <img :src="image" class="book-img rounded-3 mb-2" alt="book cover" />

    <h6 class="fw-bold">{{ title }}</h6>
    <small class="text-muted">{{ author }}</small>

    <span class="badge mt-2 px-3 py-1 rounded-pill bg-light text-dark">
      {{ category }}
    </span>
  </div>
</template>

<script>
export default {
  name: "BookCard",
  props: {
    image: String,
    title: String,
    author: String,
    category: String
  }
};
</script>

<style scoped>
.book-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.book-card {
  width: 150px;
  transition: transform 0.2s;
}
.book-card:hover {
  transform: translateY(-6px);
}
</style>
