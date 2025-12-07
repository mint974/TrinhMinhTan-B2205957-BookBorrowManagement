<template>
  <div class="dashboard-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">
        <i class="fas fa-chart-line me-2"></i>
        Bảng điều khiển
      </h2>
      <button class="btn btn-outline-primary" @click="loadDashboard" :disabled="loading">
        <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
        Làm mới
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-gradient-primary">
            <div class="stat-icon">
              <i class="fas fa-book fa-2x"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ stats.totalBooks }}</h3>
              <p class="stat-label">Tổng số sách</p>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-gradient-success">
            <div class="stat-icon">
              <i class="fas fa-users fa-2x"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ stats.totalReaders }}</h3>
              <p class="stat-label">Tổng độc giả</p>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-gradient-info">
            <div class="stat-icon">
              <i class="fas fa-user-tie fa-2x"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ stats.totalStaff }}</h3>
              <p class="stat-label">Tổng nhân viên</p>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-gradient-warning">
            <div class="stat-icon">
              <i class="fas fa-book-reader fa-2x"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ stats.currentlyBorrowed }}</h3>
              <p class="stat-label">Đang mượn</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Borrows & Popular Books -->
      <div class="row g-3">
        <!-- Recent Borrows -->
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Phiếu mượn gần đây
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="recentBorrows.length === 0" class="text-center py-5 text-muted">
                <i class="fas fa-inbox fa-3x mb-3"></i>
                <p>Chưa có phiếu mượn nào</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Độc giả</th>
                      <th>Sách</th>
                      <th>Ngày mượn</th>
                      <th>Ngày hẹn trả</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="borrow in recentBorrows" :key="borrow._id">
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-user-circle me-2 text-muted"></i>
                          <span>{{ borrow.MaDocGia?.HoLot }} {{ borrow.MaDocGia?.Ten }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <img 
                            :src="getBookImage(borrow.MaSach)" 
                            alt="Book cover"
                            class="book-thumbnail me-2"
                          />
                          <span>{{ borrow.MaSach?.TenSach }}</span>
                        </div>
                      </td>
                      <td>{{ formatDate(borrow.NgayMuon) }}</td>
                      <td>{{ formatDate(borrow.NgayHenTra) }}</td>
                      <td>
                        <span 
                          class="badge" 
                          :class="getStatusClass(borrow.TrangThai)"
                        >
                          {{ borrow.TrangThai }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Books -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="fas fa-fire me-2 text-danger"></i>
                Sách phổ biến
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="popularBooks.length === 0" class="text-center py-5 text-muted">
                <i class="fas fa-book fa-3x mb-3"></i>
                <p>Chưa có dữ liệu</p>
              </div>
              <div v-else class="popular-books-list">
                <div 
                  v-for="(book, index) in popularBooks" 
                  :key="book._id"
                  class="popular-book-item"
                >
                  <div class="rank-badge">{{ index + 1 }}</div>
                  <img 
                    :src="getBookImage(book)" 
                    alt="Book cover"
                    class="book-cover"
                  />
                  <div class="book-info flex-grow-1">
                    <h6 class="book-title mb-1">{{ book.TenSach }}</h6>
                    <small class="text-muted">{{ book.MaTacGia?.HoTen || 'N/A' }}</small>
                    <div class="borrow-count">
                      <i class="fas fa-chart-line me-1"></i>
                      {{ book.borrowCount }} lượt mượn
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BookService from "@/services/sach.service";
import ReaderService from "@/services/docgia.service";
import NhanVienService from "@/services/nhanvien.service";
import BorrowService from "@/services/theodoimuonsach.service";

const loading = ref(true);
const stats = ref({
  totalBooks: 0,
  totalReaders: 0,
  totalStaff: 0,
  currentlyBorrowed: 0
});
const recentBorrows = ref([]);
const popularBooks = ref([]);

const loadDashboard = async () => {
  try {
    loading.value = true;
    
    // Load all data in parallel
    const [books, readers, staff, borrows] = await Promise.all([
      BookService.getAll(),
      ReaderService.getAll(),
      NhanVienService.getAll(),
      BorrowService.getAll()
    ]);

    // Calculate statistics - handle different response formats
    // Some services return { data: [...], pagination: {...} }
    // Some services return array directly
    const booksData = Array.isArray(books) ? books : (books.data || []);
    const readersData = readers.data || [];
    const staffData = Array.isArray(staff) ? staff : (staff.data || []);
    const borrowsData = borrows.data || [];

    stats.value = {
      totalBooks: booksData.length,
      totalReaders: readersData.length,
      totalStaff: staffData.length,
      currentlyBorrowed: borrowsData.filter(b => 
        b.TrangThai === 'Đang mượn' || 
        b.TrangThai === 'Đã duyệt'
      ).length
    };

    // Get recent borrows (last 10)
    recentBorrows.value = borrowsData
      .sort((a, b) => new Date(b.NgayMuon) - new Date(a.NgayMuon))
      .slice(0, 10);

    // Calculate popular books
    const bookBorrowCount = {};
    borrowsData.forEach(borrow => {
      if (borrow.MaSach?._id) {
        const bookId = borrow.MaSach._id;
        bookBorrowCount[bookId] = (bookBorrowCount[bookId] || 0) + 1;
      }
    });

    // Get top 5 popular books
    const booksWithCount = booksData
      .map(book => ({
        ...book,
        borrowCount: bookBorrowCount[book._id] || 0
      }))
      .filter(book => book.borrowCount > 0)
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);

    popularBooks.value = booksWithCount;

  } catch (error) {
    console.error('Error loading dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const getBookImage = (sach) => {
  if (!sach?.AnhBia) {
    return 'https://via.placeholder.com/80x120?text=No+Image';
  }
  return `http://localhost:5000/${sach.AnhBia}`;
};

const getStatusClass = (status) => {
  const statusMap = {
    'Chờ duyệt': 'bg-warning text-dark',
    'Đã duyệt': 'bg-info',
    'Đang mượn': 'bg-primary',
    'Đã trả': 'bg-success',
    'Quá hạn': 'bg-danger',
    'Từ chối': 'bg-secondary'
  };
  return statusMap[status] || 'bg-secondary';
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN');
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Stat Cards */
.stat-card {
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon {
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.stat-label {
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Card Styling */
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

/* Book Thumbnail */
.book-thumbnail {
  width: 40px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

/* Popular Books */
.popular-books-list {
  max-height: 500px;
  overflow-y: auto;
}

.popular-book-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.popular-book-item:last-child {
  border-bottom: none;
}

.popular-book-item:hover {
  background-color: #f8f9fa;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.book-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.book-info {
  min-width: 0;
}

.book-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.borrow-count {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 600;
}

/* Table Styles */
.table {
  font-size: 0.9rem;
}

.table thead th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table tbody tr {
  transition: background-color 0.2s;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-value {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 0.85rem;
  }
  
  .book-cover {
    width: 50px;
    height: 70px;
  }
}
</style>
