<template>
  <div class="borrow-history-layout d-flex">
    <SidebarMenu />

    <div class="main-content flex-grow-1 p-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold">
          <i class="fas fa-history me-2"></i>
          Lịch sử mượn sách
        </h2>
        <button 
          class="btn btn-outline-primary"
          @click="loadBorrowHistory"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
          Làm mới
        </button>
      </div>

      <!-- Ban Alert if exists -->
      <div v-if="banInfo" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
        <i class="fas fa-ban fa-2x me-3"></i>
        <div>
          <h5 class="alert-heading mb-1">Tài khoản bị cấm mượn sách</h5>
          <p class="mb-0">
            Bạn đã bị cấm mượn sách đến ngày <strong>{{ formatDate(banInfo) }}</strong> do trả sách trễ.
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Borrow History Content -->
      <div v-else>
        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="stat-card bg-primary text-white">
              <i class="fas fa-book-reader fa-2x mb-2"></i>
              <h3>{{ stats.dangMuon }}</h3>
              <p class="mb-0">Đang mượn</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-success text-white">
              <i class="fas fa-check-circle fa-2x mb-2"></i>
              <h3>{{ stats.daTra }}</h3>
              <p class="mb-0">Đã trả</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-warning text-white">
              <i class="fas fa-clock fa-2x mb-2"></i>
              <h3>{{ stats.quaHan }}</h3>
              <p class="mb-0">Quá hạn</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-info text-white">
              <i class="fas fa-list fa-2x mb-2"></i>
              <h3>{{ borrows.length }}</h3>
              <p class="mb-0">Tổng phiếu mượn</p>
            </div>
          </div>
        </div>

        <!-- Borrow List -->
        <div v-if="borrows.length > 0" class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 10%">Ảnh bìa</th>
                    <th style="width: 25%">Tên sách</th>
                    <th style="width: 12%">Ngày mượn</th>
                    <th style="width: 12%">Ngày hẹn trả</th>
                    <th style="width: 12%">Ngày trả thực tế</th>
                    <th style="width: 12%">Phí phạt</th>
                    <th style="width: 12%">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(borrow, index) in borrows" :key="borrow._id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <img 
                        :src="getBookImage(borrow.MaSach)" 
                        class="book-thumbnail"
                        alt="Book cover"
                      />
                    </td>
                    <td>
                      <strong>{{ borrow.MaSach?.TenSach || 'N/A' }}</strong>
                      <br>
                      <small class="text-muted">{{ borrow.MaSach?.MaSach }}</small>
                    </td>
                    <td>{{ formatDate(borrow.NgayMuon) }}</td>
                    <td>{{ formatDate(borrow.NgayTra) }}</td>
                    <td>
                      {{ borrow.NgayTraThucTe ? formatDate(borrow.NgayTraThucTe) : '-' }}
                    </td>
                    <td>
                      <span v-if="borrow.PhiPhat > 0" class="text-danger fw-bold">
                        {{ formatCurrency(borrow.PhiPhat) }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusClass(borrow.TrangThai)">
                        {{ borrow.TrangThai }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-book fa-4x text-muted mb-3"></i>
          <h5 class="text-muted">Chưa có lịch sử mượn sách</h5>
          <button @click="goToBooks" class="btn btn-primary mt-3">
            <i class="fas fa-search me-2"></i>
            Tìm sách để mượn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import SidebarMenu from '@/components/SidebarMenu.vue';
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';
import { useToast } from 'vue-toastification';

export default {
  name: 'BorrowHistory',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const loading = ref(true);
    const borrows = ref([]);
    const banInfo = ref(null);

    const stats = computed(() => {
      return {
        dangMuon: borrows.value.filter(b => 
          b.TrangThai === 'Đang mượn' || 
          b.TrangThai === 'Đã duyệt' || 
          b.TrangThai === 'Chờ duyệt'
        ).length,
        daTra: borrows.value.filter(b => b.TrangThai === 'Đã trả').length,
        quaHan: borrows.value.filter(b => b.TrangThai === 'Quá hạn').length
      };
    });

    const loadBorrowHistory = async () => {
      try {
        loading.value = true;
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const docGiaId = user._id || user.id;

        if (!docGiaId) {
          return;
        }

        const data = await TheoDoiMuonSachService.getByDocGia(docGiaId);
        borrows.value = data || [];

        // Check if user has ban info from the first populated record
        if (borrows.value.length > 0 && borrows.value[0].MaDocGia?.NgayBiCam) {
          const ngayBiCam = new Date(borrows.value[0].MaDocGia.NgayBiCam);
          if (ngayBiCam > new Date()) {
            banInfo.value = ngayBiCam;
          }
        }
      } catch (error) {
        // Error handled silently or show toast
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
        'Chờ duyệt': 'bg-warning',
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

    const formatCurrency = (amount) => {
      if (!amount) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    const goToBooks = () => {
      router.push('/books');
    };

    onMounted(() => {
      loadBorrowHistory();
    });

    return {
      loading,
      borrows,
      banInfo,
      stats,
      getBookImage,
      getStatusClass,
      formatDate,
      formatCurrency,
      goToBooks
    };
  }
};
</script>

<style scoped>
.borrow-history-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  overflow-y: auto;
  max-height: 100vh;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.stat-card p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.book-thumbnail {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table th {
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

.badge {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
}

.payment-amount {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 8px;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header .btn-close {
  filter: brightness(0) invert(1);
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}
</style>
