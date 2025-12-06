<template>
  <div class="author-card d-flex align-items-center p-3 bg-white rounded shadow-sm">
    <div class="author-img-wrapper">
      <img v-if="imageUrl" :src="imageUrl" class="author-img rounded-circle" alt="author" @error="onImageError" />
      <div v-else class="author-img-placeholder rounded-circle d-flex align-items-center justify-content-center">
        <i class="fas fa-user fa-2x text-muted"></i>
      </div>
    </div>
    <div class="ms-3 flex-grow-1 author-info">
      <h6 class="fw-bold m-0 author-name">{{ name }}</h6>
      <small class="text-muted">
        <i class="fas fa-book me-1"></i>
        {{ books || 0 }} quyển sách
      </small>
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
  },
  data() {
    return {
      imageError: false
    };
  },
  computed: {
    imageUrl() {
      if (this.imageError) return null;
      if (!this.image) return null;
      // Nếu là URL đầy đủ thì dùng luôn
      if (this.image.startsWith('http')) return this.image;
      // Nếu là path thì thêm base URL
      return `http://localhost:5000/${this.image}`;
    }
  },
  methods: {
    onImageError() {
      this.imageError = true;
    }
  }
};
</script>

<style scoped>
.author-card {
  min-height: 90px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.author-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.author-img-wrapper {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.author-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.author-img-placeholder {
  width: 60px;
  height: 60px;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
}

.author-info {
  min-width: 0;
}

.author-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
