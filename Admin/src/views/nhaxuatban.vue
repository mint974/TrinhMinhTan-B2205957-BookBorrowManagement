<template>
    <div class="publishers-page">
        <!-- Header -->
        <PageHeader 
            title="Quản Lý Nhà Xuất Bản"
            subtitle="Quản lý thông tin nhà xuất bản trong hệ thống"
            icon="fas fa-building"
            addButtonText="Thêm Nhà Xuất Bản"
            @add="openAddModal"
        />

        <!-- Search & Filter -->
        <SearchFilter 
            v-model="searchQuery"
            placeholder="Tìm theo tên, địa chỉ, số điện thoại, email..."
            @update:modelValue="filterPublishers"
            @reset="resetSearch"
        >
        </SearchFilter>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-primary">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalPublishers }}</h3>
                        <p>Tổng nhà xuất bản</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-success">
                        <i class="fas fa-filter"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ filteredPublishers.length }}</h3>
                        <p>Kết quả lọc</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Publishers Table -->
        <DataTable
            title="Danh Sách Nhà Xuất Bản"
            :columns="tableColumns"
            :data="paginatedPublishers"
            :loading="loading"
            item-name="nhà xuất bản"
        >
            <!-- Mã NXB column -->
            <template #MaNXB="{ value }">
                <div class="d-flex align-items-center">
                    <i class="fas fa-hashtag me-2 text-muted"></i>
                    <span class="badge bg-secondary bg-opacity-75">{{ value }}</span>
                </div>
            </template>
            
            <!-- Tên NXB column -->
            <template #TenNXB="{ value }">
                <div class="d-flex align-items-center">
                    <i class="fas fa-building me-2 text-primary"></i>
                    <strong class="text-dark">{{ value }}</strong>
                </div>
            </template>
            
            <!-- Địa chỉ column -->
            <template #DiaChiDayDu="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    <span class="small text-truncate" style="max-width: 200px;">{{ value || '(Chưa cập nhật)' }}</span>
                </div>
            </template>
            
            <!-- Số điện thoại column -->
            <template #SoDienThoai="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-phone me-2"></i>
                    <span class="small">{{ value || '(Chưa cập nhật)' }}</span>
                </div>
            </template>
            
            <!-- Email column -->
            <template #Email="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-envelope me-2"></i>
                    <span class="small">{{ value || '(Chưa cập nhật)' }}</span>
                </div>
            </template>
            
            <!-- Actions column -->
            <template #actions="{ item }">
                <div class="d-flex justify-content-center gap-1">
                    <button class="btn btn-outline-primary btn-sm" @click="viewPublisher(item)"
                        title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" @click="editPublisher(item)"
                        title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deletePublisher(item)"
                        title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </template>
        </DataTable>

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="publisherModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-industry me-2"></i>
                            {{ isEditMode ? 'Cập Nhật Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản Mới' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="savePublisher">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Tên Nhà Xuất Bản <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" v-model="formData.TenNXB" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Số Điện Thoại</label>
                                    <input type="text" class="form-control" v-model="formData.SoDienThoai"
                                        placeholder="VD: 0123456789" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" v-model="formData.Email"
                                        placeholder="VD: nxb@example.com" />
                                </div>
                                <div class="col-12">
                                    <AddressSelect 
                                        v-model:maTinh="formData.MaTinh" 
                                        v-model:maQuan="formData.MaQuan"
                                        v-model:maPhuong="formData.MaPhuong"
                                        v-model:diaChiChiTiet="formData.DiaChiChiTiet" 
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" @click="savePublisher">
                            <i class="fas fa-save me-2"></i>
                            {{ isEditMode ? 'Cập Nhật' : 'Thêm Mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- View Detail Modal -->
        <div class="modal fade" id="viewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-info-circle me-2"></i>
                            Chi Tiết Nhà Xuất Bản
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedPublisher">
                        <div class="publisher-details">
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-hashtag me-2 text-muted"></i>
                                    Mã NXB:
                                </label>
                                <span class="badge bg-secondary">{{ selectedPublisher.MaNXB }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-industry me-2 text-primary"></i>
                                    Tên Nhà Xuất Bản:
                                </label>
                                <strong>{{ selectedPublisher.TenNXB }}</strong>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-map-marker-alt me-2 text-danger"></i>
                                    Địa Chỉ:
                                </label>
                                <span>{{ selectedPublisher.DiaChiDayDu || '(Chưa cập nhật)' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-phone me-2 text-success"></i>
                                    Số Điện Thoại:
                                </label>
                                <span>{{ selectedPublisher.SoDienThoai || '(Chưa cập nhật)' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-envelope me-2 text-info"></i>
                                    Email:
                                </label>
                                <span>{{ selectedPublisher.Email || '(Chưa cập nhật)' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-calendar-plus me-2 text-warning"></i>
                                    Ngày Tạo:
                                </label>
                                <span>{{ formatDate(selectedPublisher.createdAt) }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-calendar-edit me-2 text-secondary"></i>
                                    Cập Nhật Lần Cuối:
                                </label>
                                <span>{{ formatDate(selectedPublisher.updatedAt) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import NhaXuatBanService from '@/services/nhaxuatban.service';
import PageHeader from '@/components/PageHeader.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import DataTable from '@/components/DataTable.vue';
import AddressSelect from '@/components/AddressSelect.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'Publishers',

    components: {
        PageHeader,
        SearchFilter,
        DataTable,
        AddressSelect,
    },

    setup() {
        const toast = useToast();
        return { toast };
    },

    data() {
        return {
            publishers: [],
            filteredPublishers: [],
            searchQuery: '',
            loading: false,
            isEditMode: false,
            selectedPublisher: null,
            formData: {
                TenNXB: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
                SoDienThoai: '',
                Email: '',
            },
            publisherModal: null,
            viewModal: null,
            currentPage: 1,
            itemsPerPage: 10,
            tableColumns: [
                { key: 'MaNXB', label: 'Mã NXB', width: '10%' },
                { key: 'TenNXB', label: 'Tên Nhà Xuất Bản', width: '25%' },
                { key: 'DiaChiDayDu', label: 'Địa Chỉ', width: '25%' },
                { key: 'SoDienThoai', label: 'Số Điện Thoại', width: '15%' },
                { key: 'Email', label: 'Email', width: '15%' },
                { key: 'actions', label: 'Thao Tác', width: '10%' }
            ],
        };
    },

    computed: {
        totalPublishers() {
            return this.publishers.length;
        },

        totalPages() {
            return Math.ceil(this.filteredPublishers.length / this.itemsPerPage);
        },

        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },

        endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredPublishers.length);
        },

        paginatedPublishers() {
            return this.filteredPublishers.slice(this.startIndex, this.endIndex);
        },

        displayPages() {
            const pages = [];
            const maxDisplay = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxDisplay / 2));
            let end = Math.min(this.totalPages, start + maxDisplay - 1);

            if (end - start < maxDisplay - 1) {
                start = Math.max(1, end - maxDisplay + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
    },

    computed: {
        tableColumns() {
            return [
                { key: 'MaNXB', label: 'Mã NXB', width: '10%' },
                { key: 'TenNXB', label: 'Tên Nhà Xuất Bản', width: '25%' },
                { key: 'DiaChiDayDu', label: 'Địa Chỉ', width: '25%' },
                { key: 'SoDienThoai', label: 'Số ĐT', width: '12%' },
                { key: 'Email', label: 'Email', width: '18%' },
                { key: 'actions', label: 'Thao Tác', width: '10%' }
            ];
        },
        totalPublishers() {
            return this.publishers.length;
        },
        totalPages() {
            return Math.ceil(this.filteredPublishers.length / this.itemsPerPage);
        },
        paginatedPublishers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPublishers.slice(start, end);
        }
    },

    mounted() {
        this.publisherModal = new Modal(document.getElementById('publisherModal'));
        this.viewModal = new Modal(document.getElementById('viewModal'));
        this.loadPublishers();
    },

    methods: {
        async loadPublishers() {
            this.loading = true;
            try {
                const data = await NhaXuatBanService.getAll();
                this.publishers = data || [];
                this.filteredPublishers = [...this.publishers];
                console.log('Loaded publishers:', this.publishers);
            } catch (error) {
                console.error('Error loading publishers:', error);
                this.toast.error('Lỗi khi tải danh sách nhà xuất bản');
            } finally {
                this.loading = false;
            }
        },

        filterPublishers() {
            if (!this.searchQuery) {
                this.filteredPublishers = [...this.publishers];
            } else {
                const query = this.searchQuery.toLowerCase();
                this.filteredPublishers = this.publishers.filter(p =>
                    p.TenNXB.toLowerCase().includes(query) ||
                    (p.DiaChiDayDu && p.DiaChiDayDu.toLowerCase().includes(query)) ||
                    (p.DiaChiChiTiet && p.DiaChiChiTiet.toLowerCase().includes(query)) ||
                    (p.SoDienThoai && p.SoDienThoai.includes(query)) ||
                    (p.Email && p.Email.toLowerCase().includes(query)) ||
                    p.MaNXB.toLowerCase().includes(query)
                );
            }
            this.currentPage = 1;
        },

        resetSearch() {
            this.searchQuery = '';
            this.filteredPublishers = [...this.publishers];
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        openAddModal() {
            this.isEditMode = false;
            this.formData = {
                TenNXB: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
                SoDienThoai: '',
                Email: '',
            };
            this.publisherModal.show();
        },

        editPublisher(publisher) {
            this.isEditMode = true;
            this.selectedPublisher = publisher;
            this.formData = {
                TenNXB: publisher.TenNXB,
                MaTinh: publisher.MaTinh || '',
                MaQuan: publisher.MaQuan || '',
                MaPhuong: publisher.MaPhuong || '',
                DiaChiChiTiet: publisher.DiaChiChiTiet || '',
                SoDienThoai: publisher.SoDienThoai || '',
                Email: publisher.Email || '',
            };
            this.publisherModal.show();
        },

        viewPublisher(publisher) {
            this.selectedPublisher = publisher;
            this.viewModal.show();
        },

        async savePublisher() {
            try {
                if (this.isEditMode) {
                    await NhaXuatBanService.update(this.selectedPublisher._id, this.formData);
                    this.toast.success('Cập nhật nhà xuất bản thành công!');
                } else {
                    await NhaXuatBanService.create(this.formData);
                    this.toast.success('Thêm nhà xuất bản thành công!');
                }

                this.publisherModal.hide();
                await this.loadPublishers();
            } catch (error) {
                console.error('Error saving publisher:', error);
                this.toast.error(error.response?.data?.message || 'Lỗi khi lưu nhà xuất bản');
            }
        },

        async deletePublisher(publisher) {
            if (!confirm(`Bạn có chắc muốn xóa nhà xuất bản "${publisher.TenNXB}"?`)) {
                return;
            }

            try {
                await NhaXuatBanService.delete(publisher._id);
                this.toast.success('Xóa nhà xuất bản thành công!');
                await this.loadPublishers();
            } catch (error) {
                console.error('Error deleting publisher:', error);
                this.toast.error('Lỗi khi xóa nhà xuất bản');
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
    },
};
</script>

<style scoped>
.publishers-page {
    padding: 1rem;
}

.stat-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    border: 1px solid #e3e9f4;
    border-radius: 16px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.stat-info h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #2c3e50;
}

.stat-info p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
}

.table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
}

.pagination .page-link {
    color: #667eea;
}

.pagination .page-item.active .page-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
}

/* Modal Detail Styles */
.publisher-details {
    padding: 0;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-item label {
    font-weight: 600;
    color: #4a5568;
    margin: 0;
    flex: 0 0 40%;
}

.detail-item span {
    color: #2d3748;
    word-break: break-word;
    text-align: right;
}

.modal-dialog {
    max-width: 500px;
}

@media (max-width: 768px) {
    .modal-dialog {
        margin: 1rem;
        max-width: none;
    }
    
    .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
    
    .detail-item span {
        text-align: left;
    }
}
</style>
