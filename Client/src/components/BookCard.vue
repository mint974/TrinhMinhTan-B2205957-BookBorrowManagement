<template>
  <div class="book-card shadow-sm p-2 rounded-4 bg-white" @click="$emit('click')">
    <img :src="image" class="book-img rounded-3 mb-2" alt="book cover" />

    <h6 class="fw-bold book-title">{{ title }}</h6>
    <small class="text-muted d-block book-author">{{ author }}</small>

    <span class="badge mt-2 px-3 py-1 rounded-pill bg-light text-dark book-category">
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
  },
  emits: ['click']
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
  height: 280px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  cursor: pointer;
}
.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
.book-title {
  font-size: 0.9rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  min-height: 2.6em;
  margin-bottom: 0.5rem;
}
.book-author {
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.5rem;
}
.book-category {
  font-size: 0.75rem;
  margin-top: auto;
}
</style>
