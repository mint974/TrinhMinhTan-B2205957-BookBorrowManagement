<template>
    <div class="employees-page">
        <!-- Header -->
        <PageHeader 
            title="Quản Lý Nhân Viên"
            subtitle="Quản lý thông tin nhân viên trong hệ thống"
            icon="fas fa-users-cog"
            addButtonText="Thêm Nhân Viên"
            :showAddButton="isAdmin"
            @add="openAddModal"
        />

        <!-- Search & Filter -->
        <SearchFilter 
            v-model="searchQuery"
            placeholder="Tìm theo tên, email, SĐT..."
            @update:modelValue="filterEmployees"
            @reset="resetFilters"
        >
            <template #filters>
                <div class="col-md-3">
                    <select class="form-select" v-model="filterChucVu" @change="filterEmployees">
                        <option value="">Tất cả chức vụ</option>
                        <option value="Admin">Admin</option>
                        <option value="NhanVien">Nhân Viên</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" v-model="filterPhai" @change="filterEmployees">
                        <option value="">Tất cả giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
            </template>
        </SearchFilter>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-primary">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalEmployees }}</h3>
                        <p>Tổng nhân viên</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-success">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalAdmins }}</h3>
                        <p>Admin</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-info">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalStaff }}</h3>
                        <p>Nhân viên</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-warning">
                        <i class="fas fa-filter"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ filteredEmployees.length }}</h3>
                        <p>Kết quả lọc</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Employees Table -->
        <DataTable
            title="Danh Sách Nhân Viên"
            :columns="tableColumns"
            :data="filteredEmployees"
            :loading="loading"
            item-name="nhân viên"
        >
            <!-- MSNV column -->
            <template #MSNV="{ value }">
                <span class="badge bg-primary bg-opacity-75">{{ value }}</span>
            </template>
            
            <!-- Họ tên column -->
            <template #HoTen="{ item }">
                <div class="d-flex align-items-center">
                    <div class="avatar me-2">
                        <img v-if="item.Avatar" :src="getAvatarUrl(item.Avatar)" 
                            class="rounded-circle border" width="36" height="36" 
                            style="object-fit: cover;" alt="Avatar" />
                        <div v-else class="bg-light rounded-circle d-flex align-items-center justify-content-center"
                             style="width: 36px; height: 36px;">
                            <i class="fas fa-user text-muted"></i>
                        </div>
                    </div>
                    <strong class="text-dark">{{ item.HoTen }}</strong>
                </div>
            </template>
            
            <!-- Email column -->
            <template #Email="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-envelope me-2"></i>
                    <span class="small">{{ value }}</span>
                </div>
            </template>
            
            <!-- Số điện thoại column -->
            <template #SoDienThoai="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-phone me-2"></i>
                    <span class="small">{{ value }}</span>
                </div>
            </template>
            
            <!-- Giới tính column -->
            <template #Phai="{ value }">
                <span :class="value === 'Nam' ? 'text-primary' : 'text-danger'">
                    <i :class="value === 'Nam' ? 'fas fa-mars' : 'fas fa-venus'" class="me-1"></i>
                    {{ value }}
                </span>
            </template>
            
            <!-- Chức vụ column -->
            <template #ChucVu="{ value }">
                <span class="badge" :class="value === 'Admin' ? 'bg-success' : 'bg-info'">
                    {{ value }}
                </span>
            </template>

            <!-- Actions column -->
            <template #actions="{ item }">
                <div v-if="isAdmin" class="d-flex justify-content-center gap-1">
                    <button class="btn btn-outline-primary btn-sm" @click="viewEmployee(item)"
                        title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" @click="editEmployee(item)"
                        title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteEmployee(item)"
                        title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </template>
        </DataTable>

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="employeeModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-plus me-2"></i>
                            {{ isEditMode ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveEmployee">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-user me-1 text-primary"></i>
                                        Họ Tên <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.HoTen" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-envelope me-1 text-info"></i>
                                        Email <span class="text-danger">*</span>
                                    </label>
                                    <input type="email" class="form-control" v-model="formData.Email" required />
                                </div>
                                <div class="col-md-6" v-if="!isEditMode">
                                    <label class="form-label">
                                        <i class="fas fa-lock me-1 text-warning"></i>
                                        Mật Khẩu <span class="text-danger">*</span>
                                    </label>
                                    <input type="password" class="form-control" v-model="formData.Password"
                                        :required="!isEditMode" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-phone me-1 text-success"></i>
                                        Số Điện Thoại <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.SoDienThoai" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-venus-mars me-1 text-secondary"></i>
                                        Giới Tính <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" v-model="formData.Phai" required>
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Chức Vụ <span class="text-danger">*</span></label>
                                    <select class="form-select" v-model="formData.ChucVu" required>
                                        <option value=""> Chọn chức vụ</option>
                                        <option value="Admin">Admin</option>
                                        <option value="NhanVien">Nhân Viên</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <AddressSelect v-model:maTinh="formData.MaTinh" v-model:maQuan="formData.MaQuan"
                                        v-model:maPhuong="formData.MaPhuong"
                                        v-model:diaChiChiTiet="formData.DiaChiChiTiet" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveEmployee">
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
                            Chi Tiết Nhân Viên
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedEmployee">
                        <div class="employee-profile">
                            <div class="profile-section">
                                <div class="avatar-section">
                                    <img v-if="selectedEmployee.Avatar" :src="getAvatarUrl(selectedEmployee.Avatar)" 
                                        class="profile-image" alt="Avatar" />
                                    <i v-else class="fas fa-user-circle fa-4x text-muted"></i>
                                </div>
                                <div class="basic-info">
                                    <h4>{{ selectedEmployee.HoTen }}</h4>
                                    <span class="badge" :class="selectedEmployee.ChucVu === 'Admin' ? 'bg-success' : 'bg-info'">
                                        {{ selectedEmployee.ChucVu }}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="details-section">
                                <div class="detail-item">
                                    <label>MSNV:</label>
                                    <span class="badge bg-secondary">{{ selectedEmployee.MSNV }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Email:</label>
                                    <span>{{ selectedEmployee.Email }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Số Điện Thoại:</label>
                                    <span>{{ selectedEmployee.SoDienThoai }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Giới Tính:</label>
                                    <span :class="selectedEmployee.Phai === 'Nam' ? 'text-primary' : 'text-danger'">
                                        <i :class="selectedEmployee.Phai === 'Nam' ? 'fas fa-mars' : 'fas fa-venus'"></i>
                                        {{ selectedEmployee.Phai }}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <label>Địa Chỉ:</label>
                                    <span>{{ selectedEmployee.DiaChiDayDu || '(Chưa cập nhật)' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Ngày Tạo:</label>
                                    <span>{{ formatDate(selectedEmployee.createdAt) }}</span>
                                </div>
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
import NhanVienService from '@/services/nhanvien.service';
import PageHeader from '@/components/PageHeader.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import DataTable from '@/components/DataTable.vue';
import AddressSelect from '@/components/AddressSelect.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'Employees',

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
            employees: [],
            filteredEmployees: [],
            searchQuery: '',
            filterChucVu: '',
            filterPhai: '',
            loading: false,
            isEditMode: false,
            selectedEmployee: null,
            formData: {
                HoTen: '',
                Email: '',
                Password: '',
                SoDienThoai: '',
                Phai: '',
                ChucVu: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
            },
            employeeModal: null,
            viewModal: null,
            tableColumns: [
                { key: 'MSNV', label: 'MSNV', width: '10%' },
                { key: 'HoTen', label: 'Họ Tên', width: '20%' },
                { key: 'Email', label: 'Email', width: '20%' },
                { key: 'SoDienThoai', label: 'Số Điện Thoại', width: '15%' },
                { key: 'Phai', label: 'Giới Tính', width: '10%' },
                { key: 'ChucVu', label: 'Chức Vụ', width: '10%' },
                { key: 'DiaChiDayDu', label: 'Địa Chỉ', width: '20%' }
            ],
        };
    },

    computed: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.ChucVu === 'Admin';
        },
        
        userRole() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.ChucVu || '';
        },
        
        tableColumns() {
            const columns = [
                { key: 'MSNV', label: 'Mã NV', width: '10%' },
                { key: 'HoTen', label: 'Họ Tên', width: '20%' },
                { key: 'Email', label: 'Email', width: '20%' },
                { key: 'SoDienThoai', label: 'Số ĐT', width: '12%' },
                { key: 'Phai', label: 'Giới Tính', width: '10%' },
                { key: 'ChucVu', label: 'Chức Vụ', width: '12%' },
                { key: 'DiaChiDayDu', label: 'Địa Chỉ', width: '16%' }
            ];
            
            if (this.isAdmin) {
                columns.push({ key: 'actions', label: 'Thao Tác', width: '10%' });
            }
            
            return columns;
        },

        totalEmployees() {
            return this.employees.length;
        },

        totalAdmins() {
            return this.employees.filter(e => e.ChucVu === 'Admin').length;
        },

        totalStaff() {
            return this.employees.filter(e => e.ChucVu === 'NhanVien').length;
        },
    },

    mounted() {
        this.employeeModal = new Modal(document.getElementById('employeeModal'));
        this.viewModal = new Modal(document.getElementById('viewModal'));
        this.loadEmployees();
    },

    methods: {
        getAvatarUrl(avatar) {
            if (!avatar) return '';
            // Remove leading slash if exists
            const cleanPath = avatar.startsWith('/') ? avatar.substring(1) : avatar;
            return `http://localhost:5000/${cleanPath}`;
        },

        async loadEmployees() {
            this.loading = true;
            try {
                this.employees = await NhanVienService.getAll();
                this.filteredEmployees = [...this.employees];
            } catch (error) {
                console.error('Error loading employees:', error);
                this.toast.error('Lỗi khi tải danh sách nhân viên');
            } finally {
                this.loading = false;
            }
        },

        filterEmployees() {
            let result = [...this.employees];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(e =>
                    e.HoTen.toLowerCase().includes(query) ||
                    e.Email.toLowerCase().includes(query) ||
                    e.SoDienThoai.includes(query) ||
                    e.MSNV.toLowerCase().includes(query)
                );
            }

            if (this.filterChucVu) {
                result = result.filter(e => e.ChucVu === this.filterChucVu);
            }

            if (this.filterPhai) {
                result = result.filter(e => e.Phai === this.filterPhai);
            }

            this.filteredEmployees = result;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filterChucVu = '';
            this.filterPhai = '';
            this.filteredEmployees = [...this.employees];
        },

        openAddModal() {
            if (!this.isAdmin) return;

            this.isEditMode = false;
            this.formData = {
                HoTen: '',
                Email: '',
                Password: '',
                SoDienThoai: '',
                Phai: '',
                ChucVu: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
            };
            this.employeeModal.show();
        },

        editEmployee(employee) {
            if (!this.isAdmin) return;

            this.isEditMode = true;
            this.selectedEmployee = employee;
            this.formData = {
                HoTen: employee.HoTen,
                Email: employee.Email,
                SoDienThoai: employee.SoDienThoai,
                Phai: employee.Phai,
                ChucVu: employee.ChucVu,
                MaTinh: employee.MaTinh || '',
                MaQuan: employee.MaQuan || '',
                MaPhuong: employee.MaPhuong || '',
                DiaChiChiTiet: employee.DiaChiChiTiet || '',
            };
            this.employeeModal.show();
        },

        viewEmployee(employee) {
            this.selectedEmployee = employee;
            this.viewModal.show();
        },

        async saveEmployee() {
            if (!this.isAdmin) return;

            try {
                if (this.isEditMode) {
                    await NhanVienService.update(this.selectedEmployee._id, this.formData);
                    this.toast.success('Cập nhật nhân viên thành công!');
                } else {
                    await NhanVienService.create(this.formData);
                    this.toast.success('Thêm nhân viên thành công!');
                }

                this.employeeModal.hide();
                await this.loadEmployees();
            } catch (error) {
                console.error('Error saving employee:', error);
                this.toast.error(error.response?.data?.message || 'Lỗi khi lưu nhân viên');
            }
        },

        async deleteEmployee(employee) {
            if (!this.isAdmin) return;

            if (!confirm(`Bạn có chắc muốn xóa nhân viên "${employee.HoTen}"?`)) {
                return;
            }

            try {
                await NhanVienService.delete(employee._id);
                this.toast.success('Xóa nhân viên thành công!');
                await this.loadEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                this.toast.error('Lỗi khi xóa nhân viên');
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN');
        },
    },
};
</script>

<style scoped>
.employees-page {
    padding: 1rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
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
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #2c3e50;
}

.stat-info p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
}

.filter-card {
    background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.filter-card .form-select {
    border: none;
    background: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
}

.filter-card .form-select:focus {
    background: white;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Modal Detail Styles */
.employee-profile {
    padding: 0;
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 1rem;
}

.avatar-section {
    flex-shrink: 0;
}

.profile-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e2e8f0;
}

.basic-info h4 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
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
    max-width: 600px;
}

@media (max-width: 768px) {
    .modal-dialog {
        margin: 1rem;
        max-width: none;
    }
    
    .profile-section {
        flex-direction: column;
        text-align: center;
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

.table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
}
</style>
