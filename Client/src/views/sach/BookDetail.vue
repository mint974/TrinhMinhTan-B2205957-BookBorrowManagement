<template>
  <div class="book-detail-layout d-flex">
    <SidebarMenu />

    <div class="main-content flex-grow-1 p-4">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Book Detail Content -->
      <div v-else-if="book" class="book-detail-container">
        <!-- Back Button -->
        <button @click="goBack" class="btn btn-outline-secondary mb-4">
          <i class="fas fa-arrow-left me-2"></i>
          Quay lại
        </button>

        <!-- Confirm Modal -->
        <AlertModal
          ref="confirmModal"
          modalId="borrowConfirmModal"
          type="confirm"
          title="Xác nhận mượn sách"
          :message="confirmMessage"
          confirmText="Xác nhận"
          cancelText="Hủy"
          :showCancel="true"
          @confirm="handleBorrowConfirm"
        />

        <div class="row">
          <!-- Book Image -->
          <div class="col-md-4">
            <div class="book-image-wrapper">
              <img 
                :src="bookImage" 
                :alt="book.TenSach"
                class="book-image rounded shadow-lg"
                @error="onImageError"
              />
            </div>
            
            <!-- Borrow Button -->
            <button 
              @click="borrowBook" 
              class="btn btn-primary w-100 mt-3 btn-lg"
              :disabled="!canBorrow"
            >
              <i class="fas fa-hand-holding me-2"></i>
              {{ canBorrow ? 'Mượn sách' : 'Hết sách' }}
            </button>
          </div>

          <!-- Book Info -->
          <div class="col-md-8">
            <div class="book-info">
              <h2 class="book-title mb-3">{{ book.TenSach }}</h2>
              
              <div class="book-meta mb-4">
                <span class="badge bg-primary me-2">
                  <i class="fas fa-tag me-1"></i>
                  {{ book.DanhMuc?.TenDanhMuc || 'Chưa phân loại' }}
                </span>
                <span class="badge bg-success">
                  <i class="fas fa-box me-1"></i>
                  Còn {{ book.SoQuyen || 0 }} quyển
                </span>
              </div>

              <div class="info-section mb-4">
                <h5 class="section-title">
                  <i class="fas fa-info-circle me-2"></i>
                  Thông tin sách
                </h5>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">
                      <i class="fas fa-pen-fancy me-2 text-primary"></i>
                      Tác giả:
                    </span>
                    <span class="info-value">
                      {{ book.TacGia?.HoTen || 'Chưa rõ' }}
                      <span v-if="book.TacGia?.ButDanh" class="text-muted">
                        ({{ book.TacGia.ButDanh }})
                      </span>
                    </span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">
                      <i class="fas fa-building me-2 text-warning"></i>
                      Nhà xuất bản:
                    </span>
                    <span class="info-value">
                      {{ book.NhaXuatBan?.TenNXB || 'Chưa rõ' }}
                    </span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">
                      <i class="fas fa-calendar-alt me-2 text-info"></i>
                      Năm xuất bản:
                    </span>
                    <span class="info-value">{{ book.NamXuatBan }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">
                      <i class="fas fa-barcode me-2 text-secondary"></i>
                      Mã sách:
                    </span>
                    <span class="info-value">{{ book.MaSach }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">
                      <i class="fas fa-dollar-sign me-2 text-success"></i>
                      Đơn giá:
                    </span>
                    <span class="info-value text-success fw-bold">
                      {{ formatCurrency(book.DonGia) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="info-section" v-if="book.MoTa">
                <h5 class="section-title">
                  <i class="fas fa-align-left me-2"></i>
                  Mô tả
                </h5>
                <p class="book-description">{{ book.MoTa }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Books Section -->
        <div v-if="relatedBooks.length > 0" class="related-books mt-5">
          <h5 class="section-title mb-4">
            <i class="fas fa-book-open me-2"></i>
            Sách liên quan
          </h5>
          <div class="row g-4">
            <div v-for="relatedBook in relatedBooks" :key="relatedBook._id" class="col-md-2">
              <BookCard 
                v-bind="relatedBook"
                @click="navigateToBook(relatedBook._id)"
                style="cursor: pointer;"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Book Not Found -->
      <div v-else class="text-center py-5">
        <i class="fas fa-exclamation-circle fa-4x text-muted mb-3"></i>
        <h4>Không tìm thấy sách</h4>
        <button @click="goBack" class="btn btn-primary mt-3">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import SidebarMenu from '@/components/SidebarMenu.vue';
import BookCard from '@/components/BookCard.vue';
import AlertModal from '@/components/AlertModal.vue';
import BookService from '@/services/book.service';
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';

export default {
  name: 'BookDetail',
  components: {
    SidebarMenu,
    BookCard,
    AlertModal
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const loading = ref(true);
    const book = ref(null);
    const relatedBooks = ref([]);
    const imageError = ref(false);
    
    // Modal refs
    const confirmModal = ref(null);
    
    // Modal messages
    const confirmMessage = ref('');

    const bookImage = computed(() => {
      if (imageError.value) {
        return 'https://via.placeholder.com/400x600?text=No+Image';
      }
      if (book.value?.AnhBia) {
        return `http://localhost:5000/${book.value.AnhBia}`;
      }
      return 'https://via.placeholder.com/400x600?text=No+Image';
    });

    const canBorrow = computed(() => {
      return book.value && book.value.SoQuyen > 0;
    });

    const loadBookDetail = async () => {
      try {
        loading.value = true;
        imageError.value = false; // Reset image error state
        const bookId = route.params.id;
        const response = await BookService.get(bookId);
        book.value = response;

        // Load related books (cùng danh mục)
        if (book.value.DanhMuc?._id) {
          await loadRelatedBooks();
        }
      } catch (error) {
        console.error('Error loading book detail:', error);
        book.value = null;
      } finally {
        loading.value = false;
      }
    };

    const loadRelatedBooks = async () => {
      try {
        const allBooks = await BookService.getAll();
        const filtered = allBooks
          .filter(b => 
            b._id !== book.value._id && 
            b.DanhMuc?._id === book.value.DanhMuc?._id
          )
          .slice(0, 6)
          .map(b => ({
            _id: b._id,
            image: b.AnhBia ? `http://localhost:5000/${b.AnhBia}` : 'https://via.placeholder.com/150x200?text=No+Image',
            title: b.TenSach,
            author: b.TacGia?.HoTen || 'Chưa rõ',
            category: b.DanhMuc?.TenDanhMuc || 'Chưa phân loại'
          }));
        relatedBooks.value = filtered;
      } catch (error) {
        console.error('Error loading related books:', error);
      }
    };

    const borrowBook = async () => {
      if (!canBorrow.value) return;

      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const docGiaId = user._id || user.id;

      if (!docGiaId) {
        toast.warning('Vui lòng đăng nhập để mượn sách');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
        return;
      }

      confirmMessage.value = `Bạn có chắc muốn mượn sách "<strong>${book.value.TenSach}</strong>"?`;
      confirmModal.value.show();
    };

    const handleBorrowConfirm = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const docGiaId = user._id || user.id;

        await TheoDoiMuonSachService.create({ 
          MaDocGia: docGiaId, 
          MaSach: book.value._id 
        });
        
        toast.success(`Đã gửi yêu cầu mượn sách: ${book.value.TenSach}. Yêu cầu đang chờ nhân viên duyệt.`, {
          timeout: 5000
        });
        
        // Reload book detail to update available quantity
        await loadBookDetail();
      } catch (error) {
        console.error('Error borrowing book:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi mượn sách';
        toast.error(errorMessage);
      }
    };

    const formatCurrency = (amount) => {
      if (!amount) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    const onImageError = () => {
      imageError.value = true;
    };

    const goBack = () => {
      router.push('/');
    };

    const navigateToBook = (bookId) => {
      router.push(`/sach/${bookId}`);
      // Scroll to top when navigating to new book
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Watch route params to reload when clicking related books
    watch(() => route.params.id, (newId, oldId) => {
      if (newId && newId !== oldId) {
        loadBookDetail();
      }
    });

    onMounted(() => {
      loadBookDetail();
    });

    return {
      loading,
      book,
      relatedBooks,
      bookImage,
      canBorrow,
      borrowBook,
      handleBorrowConfirm,
      formatCurrency,
      onImageError,
      goBack,
      navigateToBook,
      // Modal refs
      confirmModal,
      // Modal messages
      confirmMessage
    };
  }
};
</script>

<style scoped>
.book-detail-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  overflow-y: auto;
  max-height: 100vh;
}

.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.book-image-wrapper {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: cover;
  display: block;
}

.book-info {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.3;
}

.book-meta .badge {
  font-size: 0.9rem;
  padding: 8px 16px;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.info-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.info-value {
  color: #212529;
  font-size: 1rem;
}

.book-description {
  color: #495057;
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 0;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
}

.related-books {
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .book-title {
    font-size: 1.5rem;
  }

  .book-info {
    margin-top: 20px;
  }
}
</style>
