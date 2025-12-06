<template>
  <div class="author-card d-flex align-items-center mb-3">
    <img :src="image" class="author-img rounded-circle" alt="author" />
    <div class="ms-3">
      <h6 class="fw-bold m-0">{{ name }}</h6>
      <small class="text-muted">{{ books }} Books</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthorCard",
  props: {
    image: String,
    name: String,
    books: Number
  }
};
</script>

<style scoped>
.author-img {
  width: 45px;
  height: 45px;
  object-fit: cover;
}
</style>
