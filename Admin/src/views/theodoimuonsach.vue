<template>
    <div class="borrow-management-container">
        <!-- Page Header -->
        <PageHeader 
            title="Quản Lý Mượn Sách"
            subtitle="Quản lý yêu cầu mượn sách và theo dõi tình trạng"
            icon="fas fa-book-reader"
        />

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stat-card bg-warning bg-opacity-10 border-warning">
                    <div class="stat-icon bg-warning">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ statistics.choDuyet || 0 }}</h3>
                        <p>Chờ duyệt</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card bg-primary bg-opacity-10 border-primary">
                    <div class="stat-icon bg-primary">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ statistics.dangMuon || 0 }}</h3>
                        <p>Đang mượn</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card bg-danger bg-opacity-10 border-danger">
                    <div class="stat-icon bg-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ statistics.quaHan || 0 }}</h3>
                        <p>Quá hạn</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card bg-success bg-opacity-10 border-success">
                    <div class="stat-icon bg-success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ statistics.daTra || 0 }}</h3>
                        <p>Đã trả</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mb-3 d-flex gap-2">
            <button @click="checkOverdue" class="btn btn-warning" :disabled="loading">
                <i class="fas fa-sync me-2"></i>
                Kiểm tra quá hạn
            </button>
            <button @click="loadBorrows" class="btn btn-secondary" :disabled="loading">
                <i class="fas fa-redo me-2"></i>
                Tải lại
            </button>
        </div>

        <!-- Search & Filters -->
        <SearchFilter 
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tên sách, tên độc giả..."
            @search="filterBorrows"
            @reset="resetSearch"
        >
            <template #filters>
                <div class="col-md-2">
                    <select class="form-select" v-model="filterTrangThai" @change="filterBorrows">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Chờ duyệt">Chờ duyệt</option>
                        <option value="Đã duyệt">Đã duyệt</option>
                        <option value="Từ chối">Từ chối</option>
                        <option value="Đang mượn">Đang mượn</option>
                        <option value="Đã trả">Đã trả</option>
                        <option value="Quá hạn">Quá hạn</option>
                    </select>
                </div>
            </template>
        </SearchFilter>

        <!-- Borrows Table -->
        <DataTable
            title="Danh Sách Mượn Sách"
            :columns="columns"
            :data="filteredBorrows"
            :loading="loading"
            itemName="phiếu mượn"
            @view="viewBorrow"
            @edit="editBorrow"
        >
            <!-- Custom actions - không có nút xóa -->
            <template #actions="{ item }">
                <div class="d-flex justify-content-center gap-1">
                    <button 
                        class="btn btn-outline-primary btn-sm" 
                        @click="viewBorrow(item)"
                        title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button 
                        class="btn btn-outline-warning btn-sm" 
                        @click="editBorrow(item)"
                        title="Cập nhật trạng thái">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </template>
            <!-- Ảnh bìa sách -->
            <template #AnhBia="{ item }">
                <div class="book-cover">
                    <img 
                        v-if="item.MaSach?.AnhBia"
                        :src="`http://localhost:5000/${item.MaSach.AnhBia}`" 
                        :alt="item.MaSach?.TenSach"
                        class="img-thumbnail"
                        style="width: 50px; height: 70px; object-fit: cover;"
                    />
                    <div v-else class="no-cover-small">
                        <i class="fas fa-book text-muted"></i>
                    </div>
                </div>
            </template>

            <!-- Sách -->
            <template #Sach="{ item }">
                <div>
                    <div class="fw-semibold">{{ item.MaSach?.TenSach || 'N/A' }}</div>
                    <small class="text-muted">{{ item.MaSach?.MaSach || '' }}</small>
                </div>
            </template>

            <!-- Độc giả -->
            <template #DocGia="{ item }">
                <div class="d-flex align-items-center">
                    <img 
                        v-if="item.MaDocGia?.Avatar"
                        :src="`http://localhost:5000/${item.MaDocGia.Avatar}`"
                        class="rounded-circle me-2"
                        style="width: 35px; height: 35px; object-fit: cover;"
                    />
                    <div v-else class="avatar-placeholder me-2">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">{{ getDocGiaName(item.MaDocGia) }}</div>
                        <small class="text-muted">{{ item.MaDocGia?.MaDocGia || '' }}</small>
                    </div>
                </div>
            </template>

            <!-- Ngày mượn -->
            <template #NgayMuon="{ value }">
                <span>{{ formatDate(value) }}</span>
            </template>

            <!-- Ngày hẹn trả -->
            <template #NgayTra="{ value, item }">
                <div>
                    <div>{{ formatDate(value) }}</div>
                    <small v-if="isOverdue(value, item.TrangThai)" class="text-danger">
                        <i class="fas fa-exclamation-circle"></i> Trễ hạn
                    </small>
                </div>
            </template>

            <!-- Ngày trả thực tế -->
            <template #NgayTraThucTe="{ value }">
                <span v-if="value">{{ formatDate(value) }}</span>
                <span v-else class="text-muted">--</span>
            </template>

            <!-- Phí phạt -->
            <template #PhiPhat="{ value }">
                <span v-if="value && value > 0" class="text-danger fw-bold">
                    {{ formatCurrency(value) }}
                </span>
                <span v-else class="text-muted">--</span>
            </template>

            <!-- Trạng thái -->
            <template #TrangThai="{ value }">
                <span :class="getStatusBadgeClass(value)">
                    {{ value }}
                </span>
            </template>
        </DataTable>

        <!-- View Modal -->
        <div class="modal fade" id="viewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-info-circle me-2"></i>
                            Chi tiết phiếu mượn sách
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedBorrow">
                        <div class="row">
                            <!-- Thông tin sách -->
                            <div class="col-md-6 mb-3">
                                <h6 class="text-primary"><i class="fas fa-book me-2"></i>Thông tin sách</h6>
                                <div class="info-group">
                                    <img 
                                        v-if="selectedBorrow.MaSach?.AnhBia"
                                        :src="`http://localhost:5000/${selectedBorrow.MaSach.AnhBia}`"
                                        class="img-thumbnail mb-2"
                                        style="width: 120px; height: 160px; object-fit: cover;"
                                    />
                                    <p><strong>Tên sách:</strong> {{ selectedBorrow.MaSach?.TenSach }}</p>
                                    <p><strong>Mã sách:</strong> {{ selectedBorrow.MaSach?.MaSach }}</p>
                                    <p><strong>Đơn giá:</strong> {{ formatCurrency(selectedBorrow.MaSach?.DonGia) }}</p>
                                </div>
                            </div>

                            <!-- Thông tin độc giả -->
                            <div class="col-md-6 mb-3">
                                <h6 class="text-primary"><i class="fas fa-user me-2"></i>Thông tin độc giả</h6>
                                <div class="info-group">
                                    <img 
                                        v-if="selectedBorrow.MaDocGia?.Avatar"
                                        :src="`http://localhost:5000/${selectedBorrow.MaDocGia.Avatar}`"
                                        class="img-thumbnail rounded-circle mb-2"
                                        style="width: 80px; height: 80px; object-fit: cover;"
                                    />
                                    <p><strong>Họ tên:</strong> {{ getDocGiaName(selectedBorrow.MaDocGia) }}</p>
                                    <p><strong>Mã độc giả:</strong> {{ selectedBorrow.MaDocGia?.MaDocGia }}</p>
                                    <p><strong>Email:</strong> {{ selectedBorrow.MaDocGia?.Email }}</p>
                                    <p><strong>Điện thoại:</strong> {{ selectedBorrow.MaDocGia?.DienThoai }}</p>
                                    <p v-if="selectedBorrow.MaDocGia?.NgayBiCam">
                                        <strong class="text-danger">Ngày bị cấm:</strong> 
                                        <span class="text-danger">{{ formatDate(selectedBorrow.MaDocGia.NgayBiCam) }}</span>
                                    </p>
                                </div>
                            </div>

                            <!-- Thông tin mượn trả -->
                            <div class="col-12">
                                <h6 class="text-primary"><i class="fas fa-calendar me-2"></i>Thông tin mượn trả</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Ngày mượn:</strong> {{ formatDate(selectedBorrow.NgayMuon) }}</p>
                                        <p><strong>Ngày hẹn trả:</strong> {{ formatDate(selectedBorrow.NgayTra) }}</p>
                                        <p><strong>Ngày trả thực tế:</strong> 
                                            <span v-if="selectedBorrow.NgayTraThucTe">
                                                {{ formatDate(selectedBorrow.NgayTraThucTe) }}
                                            </span>
                                            <span v-else class="text-muted">Chưa trả</span>
                                        </p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Trạng thái:</strong> 
                                            <span :class="getStatusBadgeClass(selectedBorrow.TrangThai)">
                                                {{ selectedBorrow.TrangThai }}
                                            </span>
                                        </p>
                                        <p><strong>Phí phạt:</strong> 
                                            <span v-if="selectedBorrow.PhiPhat > 0" class="text-danger fw-bold">
                                                {{ formatCurrency(selectedBorrow.PhiPhat) }}
                                            </span>
                                            <span v-else class="text-success">Không</span>
                                        </p>
                                        <p v-if="selectedBorrow.LyDoTuChoi">
                                            <strong class="text-danger">Lý do từ chối:</strong><br>
                                            <span class="text-danger">{{ selectedBorrow.LyDoTuChoi }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Status Modal -->
        <div class="modal fade" id="editModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="fas fa-edit me-2"></i>
                            Cập nhật trạng thái phiếu mượn
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedBorrow">
                        <form @submit.prevent="updateStatus">
                            <!-- Thông tin hiện tại -->
                            <div class="alert alert-info">
                                <p class="mb-1"><strong>Sách:</strong> {{ selectedBorrow.MaSach?.TenSach }}</p>
                                <p class="mb-1"><strong>Độc giả:</strong> {{ getDocGiaName(selectedBorrow.MaDocGia) }}</p>
                                <p class="mb-0">
                                    <strong>Trạng thái hiện tại:</strong> 
                                    <span :class="getStatusBadgeClass(selectedBorrow.TrangThai)">
                                        {{ selectedBorrow.TrangThai }}
                                    </span>
                                </p>
                            </div>

                            <!-- Trạng thái mới -->
                            <div class="mb-3">
                                <label class="form-label required">Trạng thái mới</label>
                                <select class="form-select" v-model="formData.TrangThai" required>
                                    <option value="">-- Chọn trạng thái --</option>
                                    <option value="Đã duyệt" :disabled="selectedBorrow.TrangThai !== 'Chờ duyệt'">
                                        Đã duyệt
                                    </option>
                                    <option value="Từ chối" :disabled="selectedBorrow.TrangThai !== 'Chờ duyệt'">
                                        Từ chối
                                    </option>
                                    <option value="Đang mượn" :disabled="selectedBorrow.TrangThai !== 'Đã duyệt'">
                                        Đang mượn
                                    </option>
                                    <option value="Đã trả" :disabled="!['Đã duyệt', 'Đang mượn', 'Quá hạn'].includes(selectedBorrow.TrangThai)">
                                        Đã trả
                                    </option>
                                </select>
                            </div>

                            <!-- Lý do từ chối (chỉ hiện khi chọn Từ chối) -->
                            <div class="mb-3" v-if="formData.TrangThai === 'Từ chối'">
                                <label class="form-label required">Lý do từ chối</label>
                                <textarea 
                                    class="form-control" 
                                    v-model="formData.LyDoTuChoi"
                                    rows="3"
                                    required
                                    placeholder="Nhập lý do từ chối yêu cầu mượn sách..."
                                ></textarea>
                            </div>

                            <!-- Ngày trả thực tế (chỉ hiện khi chọn Đã trả) -->
                            <div class="mb-3" v-if="formData.TrangThai === 'Đã trả'">
                                <label class="form-label">Ngày trả thực tế</label>
                                <input 
                                    type="datetime-local" 
                                    class="form-control" 
                                    v-model="formData.NgayTraThucTe"
                                />
                                <small class="text-muted">Để trống nếu trả hôm nay</small>
                            </div>

                            <!-- Cảnh báo trả trễ -->
                            <div class="alert alert-warning" v-if="formData.TrangThai === 'Đã trả' && willBeLate">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>Cảnh báo:</strong> Độc giả trả sách trễ hạn!
                                <ul class="mb-0 mt-2">
                                    <li>Phí phạt: <strong>{{ formatCurrency(selectedBorrow.MaSach?.DonGia * 0.2) }}</strong> (20% giá sách)</li>
                                    <li>Bị cấm mượn sách trong <strong>14 ngày</strong></li>
                                </ul>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" class="btn btn-primary" :disabled="saving">
                                    <i class="fas fa-save me-2"></i>
                                    {{ saving ? 'Đang lưu...' : 'Cập nhật' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import { Modal } from 'bootstrap';
import PageHeader from '@/components/PageHeader.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import DataTable from '@/components/DataTable.vue';
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';

export default {
    name: 'TheoDoiMuonSach',
    components: {
        PageHeader,
        SearchFilter,
        DataTable
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            borrows: [],
            filteredBorrows: [],
            loading: false,
            saving: false,
            searchQuery: '',
            filterTrangThai: '',
            selectedBorrow: null,
            statistics: {
                choDuyet: 0,
                dangMuon: 0,
                quaHan: 0,
                daTra: 0
            },
            formData: {
                TrangThai: '',
                LyDoTuChoi: '',
                NgayTraThucTe: ''
            },
            columns: [
                { key: 'AnhBia', label: 'Ảnh bìa', sortable: false },
                { key: 'Sach', label: 'Sách', sortable: false },
                { key: 'DocGia', label: 'Độc giả', sortable: false },
                { key: 'NgayMuon', label: 'Ngày mượn', sortable: true },
                { key: 'NgayTra', label: 'Ngày hẹn trả', sortable: true },
                { key: 'NgayTraThucTe', label: 'Ngày trả', sortable: true },
                { key: 'PhiPhat', label: 'Phí phạt', sortable: true },
                { key: 'TrangThai', label: 'Trạng thái', sortable: true },
                { key: 'actions', label: 'Thao tác', sortable: false }
            ]
        };
    },
    computed: {
        willBeLate() {
            if (!this.selectedBorrow || this.formData.TrangThai !== 'Đã trả') {
                return false;
            }
            const ngayTra = this.formData.NgayTraThucTe ? new Date(this.formData.NgayTraThucTe) : new Date();
            const ngayHenTra = new Date(this.selectedBorrow.NgayTra);
            return ngayTra > ngayHenTra;
        }
    },
    async mounted() {
        await this.loadBorrows();
        await this.loadStatistics();
    },
    methods: {
        async loadBorrows() {
            try {
                this.loading = true;
                const response = await TheoDoiMuonSachService.getAll();
                this.borrows = response.data || response;
                this.filterBorrows();
            } catch (error) {
                console.error('Error loading borrows:', error);
                this.toast.error('Không thể tải danh sách mượn sách');
            } finally {
                this.loading = false;
            }
        },

        async loadStatistics() {
            try {
                const response = await TheoDoiMuonSachService.getStatistics();
                this.statistics = response.data || response;
            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        },

        async checkOverdue() {
            try {
                this.loading = true;
                await TheoDoiMuonSachService.checkOverdue();
                this.toast.success('Đã kiểm tra và cập nhật trạng thái quá hạn');
                await this.loadBorrows();
                await this.loadStatistics();
            } catch (error) {
                console.error('Error checking overdue:', error);
                this.toast.error('Không thể kiểm tra quá hạn');
            } finally {
                this.loading = false;
            }
        },

        filterBorrows() {
            let result = [...this.borrows];

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(b => 
                    b.MaSach?.TenSach?.toLowerCase().includes(query) ||
                    b.MaSach?.MaSach?.toLowerCase().includes(query) ||
                    this.getDocGiaName(b.MaDocGia).toLowerCase().includes(query) ||
                    b.MaDocGia?.MaDocGia?.toLowerCase().includes(query)
                );
            }

            // Filter by status
            if (this.filterTrangThai) {
                result = result.filter(b => b.TrangThai === this.filterTrangThai);
            }

            this.filteredBorrows = result;
        },

        resetSearch() {
            this.searchQuery = '';
            this.filterTrangThai = '';
            this.filterBorrows();
        },

        viewBorrow(borrow) {
            this.selectedBorrow = borrow;
            const modal = new Modal(document.getElementById('viewModal'));
            modal.show();
        },

        editBorrow(borrow) {
            this.selectedBorrow = borrow;
            this.formData = {
                TrangThai: '',
                LyDoTuChoi: '',
                NgayTraThucTe: ''
            };
            const modal = new Modal(document.getElementById('editModal'));
            modal.show();
        },

        async updateStatus() {
            try {
                this.saving = true;
                const data = {
                    TrangThai: this.formData.TrangThai
                };

                if (this.formData.LyDoTuChoi) {
                    data.LyDoTuChoi = this.formData.LyDoTuChoi;
                }

                if (this.formData.NgayTraThucTe) {
                    data.NgayTraThucTe = this.formData.NgayTraThucTe;
                }

                await TheoDoiMuonSachService.updateStatus(this.selectedBorrow._id, data);
                
                this.toast.success('Cập nhật trạng thái thành công');
                
                // Close modal
                const modal = Modal.getInstance(document.getElementById('editModal'));
                modal.hide();
                
                // Reload data
                await this.loadBorrows();
                await this.loadStatistics();
            } catch (error) {
                console.error('Error updating status:', error);
                this.toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
            } finally {
                this.saving = false;
            }
        },

        getDocGiaName(docGia) {
            if (!docGia) return 'N/A';
            return `${docGia.HoLot || ''} ${docGia.Ten || ''}`.trim() || docGia.MaDocGia || 'N/A';
        },

        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        },

        formatCurrency(amount) {
            if (!amount) return '0đ';
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        },

        isOverdue(ngayTra, trangThai) {
            if (!ngayTra || ['Đã trả', 'Từ chối'].includes(trangThai)) return false;
            return new Date() > new Date(ngayTra);
        },

        getStatusBadgeClass(status) {
            const classes = {
                'Chờ duyệt': 'badge bg-warning text-dark',
                'Đã duyệt': 'badge bg-info text-dark',
                'Từ chối': 'badge bg-secondary',
                'Đang mượn': 'badge bg-primary',
                'Đã trả': 'badge bg-success',
                'Quá hạn': 'badge bg-danger'
            };
            return classes[status] || 'badge bg-secondary';
        }
    }
};
</script>

<style scoped>
.borrow-management-container {
    padding: 20px;
}

.stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid;
    margin-bottom: 20px;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    margin-right: 15px;
}

.stat-content h3 {
    margin: 0;
    font-size: 32px;
    font-weight: bold;
    color: #333;
}

.stat-content p {
    margin: 0;
    color: #666;
    font-size: 14px;
}

.book-cover {
    display: flex;
    justify-content: center;
    align-items: center;
}

.no-cover-small {
    width: 50px;
    height: 70px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.avatar-placeholder {
    width: 35px;
    height: 35px;
    background: #e9ecef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
}

.info-group p {
    margin-bottom: 8px;
}

.required::after {
    content: " *";
    color: red;
}
</style>
