<template>
  <div class="home-layout d-flex">
    <SidebarMenu />

    <div class="main-content flex-grow-1 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold">Thư viện sách</h2>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            class="form-control" 
            placeholder="Tìm kiếm sách..." 
          />
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Sách mới nhất -->
        <div class="mb-5">
          <h5 class="fw-bold mb-3">
            <i class="fas fa-book-open me-2 text-primary"></i>
            Sách mới nhất
          </h5>
          <div v-if="newBooks.length > 0" class="row g-4">
            <div v-for="book in newBooks.slice(0, 6)" :key="book._id" class="col-md-4 col-lg-2">
              <BookCard v-bind="book" @click="navigateToBook(book._id)" />
            </div>
          </div>
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Chưa có sách nào
          </div>
        </div>

        <!-- Danh mục sách -->
        <div class="mb-5">
          <h5 class="fw-bold mb-3">
            <i class="fas fa-layer-group me-2 text-success"></i>
            Danh mục sách
          </h5>
          <div v-if="categories.length > 0" class="d-flex gap-2 flex-wrap">
            <span 
              v-for="category in categories" 
              :key="category._id" 
              class="badge bg-light text-dark border px-3 py-2"
              style="cursor: pointer;"
            >
              {{ category.TenDanhMuc }}
            </span>
          </div>
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Chưa có danh mục nào
          </div>
        </div>

        <!-- Tác giả nổi bật -->
        <div class="mb-5">
          <h5 class="fw-bold mb-3">
            <i class="fas fa-user-edit me-2 text-warning"></i>
            Tác giả nổi bật
          </h5>
          <div v-if="authors.length > 0" class="row g-3">
            <div v-for="author in authors.slice(0, 4)" :key="author._id" class="col-md-6 col-lg-3">
              <AuthorCard v-bind="author" />
            </div>
          </div>
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Chưa có tác giả nào
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from "@/components/SidebarMenu.vue";
import BookCard from "@/components/BookCard.vue";
import AuthorCard from "@/components/AuthorCard.vue";
import BookService from "@/services/book.service";

export default {
  components: {
    SidebarMenu,
    BookCard,
    AuthorCard,
  },

  data() {
    return {
      loading: true,
      searchQuery: '',
      newBooks: [],
      categories: [],
      authors: [],
    };
  },

  async mounted() {
    await this.loadData();
  },

  methods: {
    async loadData() {
      try {
        this.loading = true;
        
        // Load sách
        const booksResponse = await BookService.getAll();
        const allBooks = booksResponse || [];

        // Map dữ liệu sách để hiển thị với BookCard
        this.newBooks = allBooks.map(book => ({
          _id: book._id,
          image: book.AnhBia ? `http://localhost:5000/${book.AnhBia}` : 'https://via.placeholder.com/150x200?text=No+Image',
          title: book.TenSach,
          author: book.TacGia?.HoTen || 'Chưa rõ',
          category: book.DanhMuc?.TenDanhMuc || 'Chưa phân loại'
        }));

        // Trích xuất danh mục từ sách
        const categoriesSet = new Set();
        allBooks.forEach(book => {
          if (book.DanhMuc && book.DanhMuc.TenDanhMuc) {
            categoriesSet.add(JSON.stringify({
              _id: book.DanhMuc._id,
              TenDanhMuc: book.DanhMuc.TenDanhMuc
            }));
          }
        });
        this.categories = Array.from(categoriesSet).map(item => JSON.parse(item));

        // Trích xuất tác giả từ sách và đếm số sách của mỗi tác giả
        const authorsMap = new Map();
        allBooks.forEach(book => {
          if (book.TacGia && book.TacGia.HoTen) {
            const tacGiaId = book.TacGia._id;
            if (authorsMap.has(tacGiaId)) {
              const author = authorsMap.get(tacGiaId);
              author.books += 1;
            } else {
              authorsMap.set(tacGiaId, {
                _id: book.TacGia._id,
                name: book.TacGia.HoTen,
                image: book.TacGia.HinhAnh || '',
                books: 1
              });
            }
          }
        });
        this.authors = Array.from(authorsMap.values());

      } catch (error) {
        console.error('Lỗi khi load dữ liệu:', error);
      } finally {
        this.loading = false;
      }
    },

    navigateToBook(bookId) {
      this.$router.push(`/sach/${bookId}`);
    }
  }
};
</script>

<style scoped>
.home-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  overflow-y: auto;
  max-height: 100vh;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  padding-left: 40px;
  border-radius: 25px;
  border: 1px solid #ddd;
}

.search-box input:focus {
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  border-color: #667eea;
}

.badge {
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.badge:hover {
  background-color: #667eea !important;
  color: white !important;
  transform: translateY(-2px);
}
</style>
