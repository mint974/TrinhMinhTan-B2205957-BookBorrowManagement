<template>
    <div class="categories-page">
        <!-- Header -->
        <PageHeader 
            title="Quản Lý Danh Mục"
            subtitle="Quản lý thông tin danh mục sách trong hệ thống"
            icon="fas fa-list"
            addButtonText="Thêm Danh Mục"
            @add="openAddModal"
        />

        <!-- Search & Filter -->
        <SearchFilter 
            v-model="searchQuery"
            placeholder="Tìm theo tên danh mục, mô tả..."
            @update:modelValue="filterCategories"
            @reset="resetSearch"
        >
        </SearchFilter>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-primary">
                        <i class="fas fa-list"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalCategories }}</h3>
                        <p>Tổng danh mục</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-success">
                        <i class="fas fa-filter"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ filteredCategories.length }}</h3>
                        <p>Kết quả lọc</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories Table -->
        <DataTable
            title="Danh Sách Danh Mục"
            :columns="tableColumns"
            :data="filteredCategories"
            :loading="loading"
            item-name="danh mục"
            @delete="deleteCategory"
        >
            <!-- Mã Danh Mục column -->
            <template #MaDanhMuc="{ value }">
                <div class="d-flex align-items-center">
                    <i class="fas fa-hashtag me-2 text-muted"></i>
                    <span class="badge bg-secondary bg-opacity-75">{{ value }}</span>
                </div>
            </template>
            
            <!-- Tên Danh Mục column -->
            <template #TenDanhMuc="{ value }">
                <div class="d-flex align-items-center">
                    <i class="fas fa-tag me-2 text-primary"></i>
                    <strong class="text-dark">{{ value }}</strong>
                </div>
            </template>
            
            <!-- Mô tả column -->
            <template #MoTa="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-align-left me-2"></i>
                    <span class="small text-truncate" style="max-width: 300px;">{{ value || '(Chưa có mô tả)' }}</span>
                </div>
            </template>

            <!-- Ngày tạo column -->
            <template #createdAt="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-calendar me-2"></i>
                    <span class="small">{{ formatDate(value) }}</span>
                </div>
            </template>
            
            <!-- Actions column -->
            <template #actions="{ item }">
                <div class="d-flex justify-content-center gap-1">
                    <button class="btn btn-outline-primary btn-sm" @click="viewCategory(item)"
                        title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" @click="editCategory(item)"
                        title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteCategory(item)"
                        title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </template>
        </DataTable>

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="categoryModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-list me-2"></i>
                            {{ isEditMode ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveCategory">
                            <div class="row g-3">
                                <div class="col-md-12">
                                    <label class="form-label">
                                        <i class="fas fa-tag me-1 text-primary"></i>
                                        Tên Danh Mục <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.TenDanhMuc" required
                                        placeholder="VD: Văn học, Khoa học, Giáo khoa..." />
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">
                                        <i class="fas fa-align-left me-1 text-info"></i>
                                        Mô Tả
                                    </label>
                                    <textarea class="form-control" v-model="formData.MoTa" rows="4"
                                        placeholder="Nhập mô tả chi tiết về danh mục..."></textarea>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">
                                        <i class="fas fa-user me-1 text-secondary"></i>
                                        Người Tạo
                                    </label>
                                    <input type="text" class="form-control" :value="currentUserName" disabled />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveCategory">
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
                            Chi Tiết Danh Mục
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedCategory">
                        <div class="category-details">
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-hashtag me-2 text-muted"></i>
                                    Mã Danh Mục:
                                </label>
                                <span class="badge bg-secondary">{{ selectedCategory.MaDanhMuc }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-tag me-2 text-primary"></i>
                                    Tên Danh Mục:
                                </label>
                                <strong>{{ selectedCategory.TenDanhMuc }}</strong>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-align-left me-2 text-info"></i>
                                    Mô Tả:
                                </label>
                                <span>{{ selectedCategory.MoTa || '(Chưa có mô tả)' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-calendar-plus me-2 text-warning"></i>
                                    Ngày Tạo:
                                </label>
                                <span>{{ formatDate(selectedCategory.createdAt) }}</span>
                            </div>
                            <div class="detail-item">
                                <label>
                                    <i class="fas fa-calendar-edit me-2 text-secondary"></i>
                                    Cập Nhật Lần Cuối:
                                </label>
                                <span>{{ formatDate(selectedCategory.updatedAt) }}</span>
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
import DanhMucService from '@/services/danhmuc.service';
import PageHeader from '@/components/PageHeader.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import DataTable from '@/components/DataTable.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'Categories',

    components: {
        PageHeader,
        SearchFilter,
        DataTable,
    },

    setup() {
        const toast = useToast();
        return { toast };
    },

    data() {
        return {
            categories: [],
            filteredCategories: [],
            searchQuery: '',
            loading: false,
            isEditMode: false,
            selectedCategory: null,
            categoryModal: null,
            viewModal: null,
            formData: {
                TenDanhMuc: '',
                MoTa: '',
            },
        };
    },

    computed: {
        tableColumns() {
            return [
                { key: 'MaDanhMuc', label: 'Mã Danh Mục', width: '15%' },
                { key: 'TenDanhMuc', label: 'Tên Danh Mục', width: '25%' },
                { key: 'MoTa', label: 'Mô Tả', width: '35%' },
                { key: 'createdAt', label: 'Ngày Tạo', width: '15%' },
                { key: 'actions', label: 'Thao Tác', width: '10%' }
            ];
        },
        totalCategories() {
            return this.categories.length;
        },
        currentUserName() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            return user.HoTen || 'Không xác định';
        }
    },

    mounted() {
        this.categoryModal = new Modal(document.getElementById('categoryModal'));
        this.viewModal = new Modal(document.getElementById('viewModal'));
        this.loadCategories();
    },

    methods: {
        async loadCategories() {
            this.loading = true;
            try {
                const response = await DanhMucService.getAll();
                this.categories = response || [];
                this.filteredCategories = [...this.categories];
            } catch (error) {
                console.error('Error loading categories:', error);
                this.toast.error('Lỗi khi tải danh sách danh mục');
            } finally {
                this.loading = false;
            }
        },

        filterCategories() {
            if (!this.searchQuery) {
                this.filteredCategories = [...this.categories];
            } else {
                const query = this.searchQuery.toLowerCase();
                this.filteredCategories = this.categories.filter(c =>
                    c.TenDanhMuc.toLowerCase().includes(query) ||
                    (c.MoTa && c.MoTa.toLowerCase().includes(query)) ||
                    c.MaDanhMuc.toLowerCase().includes(query)
                );
            }
        },

        resetSearch() {
            this.searchQuery = '';
            this.filteredCategories = [...this.categories];
        },

        openAddModal() {
            this.isEditMode = false;
            this.formData = {
                TenDanhMuc: '',
                MoTa: '',
            };
            this.categoryModal.show();
        },

        editCategory(category) {
            this.isEditMode = true;
            this.selectedCategory = category;
            this.formData = {
                TenDanhMuc: category.TenDanhMuc,
                MoTa: category.MoTa || '',
            };
            this.categoryModal.show();
        },

        viewCategory(category) {
            this.selectedCategory = category;
            this.viewModal.show();
        },

        async saveCategory() {
            try {
                if (this.isEditMode) {
                    await DanhMucService.update(this.selectedCategory._id, this.formData);
                    this.toast.success('Cập nhật danh mục thành công!');
                } else {
                    await DanhMucService.create(this.formData);
                    this.toast.success('Thêm danh mục thành công!');
                }

                this.categoryModal.hide();
                await this.loadCategories();
            } catch (error) {
                console.error('Error saving category:', error);
                this.toast.error(error.response?.data?.message || 'Lỗi khi lưu danh mục');
            }
        },

        async deleteCategory(category) {
            if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.TenDanhMuc}"?`)) {
                return;
            }

            try {
                await DanhMucService.delete(category._id);
                this.toast.success('Xóa danh mục thành công!');
                await this.loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                this.toast.error(error.response?.data?.message || 'Lỗi khi xóa danh mục');
            }
        },

        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
.categories-page {
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

.category-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.detail-item label {
    font-weight: 600;
    color: #495057;
    min-width: 150px;
    margin: 0;
}

.detail-item span,
.detail-item strong {
    color: #212529;
}

.modal-content {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
</style>
