<template>
    <div class="employees-page">
        <!-- Header -->
        <div class="page-header">
            <div>
                <h2 class="page-title">
                    <i class="fas fa-users-cog me-2"></i>
                    Quản Lý Nhân Viên
                </h2>
                <p class="text-muted mb-0">Quản lý thông tin nhân viên trong hệ thống</p>
            </div>
            <button v-if="isAdmin" class="btn btn-primary" @click="openAddModal">
                <i class="fas fa-plus me-2"></i>
                Thêm Nhân Viên
            </button>
        </div>

        <!-- Search & Filter -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control" placeholder="Tìm theo tên, email, SĐT..."
                                v-model="searchQuery" @input="filterEmployees" />
                        </div>
                    </div>
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
                    <div class="col-md-2">
                        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                            <i class="fas fa-redo me-2"></i>Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>

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
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>MSNV</th>
                                <th>Họ Tên</th>
                                <th>Email</th>
                                <th>Số Điện Thoại</th>
                                <th>Giới Tính</th>
                                <th>Chức Vụ</th>
                                <th>Địa Chỉ</th>
                                <th v-if="isAdmin">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td :colspan="isAdmin ? 8 : 7" class="text-center py-4">
                                    <i class="fas fa-spinner fa-spin me-2"></i>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                            <tr v-else-if="filteredEmployees.length === 0">
                                <td :colspan="isAdmin ? 8 : 7" class="text-center py-4 text-muted">
                                    <i class="fas fa-inbox me-2"></i>
                                    Không tìm thấy nhân viên nào
                                </td>
                            </tr>
                            <tr v-else v-for="employee in filteredEmployees" :key="employee._id">
                                <td>
                                    <span class="badge bg-secondary">{{ employee.MSNV }}</span>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar me-2">
                                            <i class="fas fa-user-circle fa-2x text-muted"></i>
                                        </div>
                                        <strong>{{ employee.HoTen }}</strong>
                                    </div>
                                </td>
                                <td>
                                    <i class="fas fa-envelope me-1 text-muted"></i>
                                    {{ employee.Email }}
                                </td>
                                <td>
                                    <i class="fas fa-phone me-1 text-muted"></i>
                                    {{ employee.SoDienThoai }}
                                </td>
                                <td>
                                    <span :class="employee.Phai === 'Nam' ? 'text-primary' : 'text-danger'">
                                        <i :class="employee.Phai === 'Nam' ? 'fas fa-mars' : 'fas fa-venus'"></i>
                                        {{ employee.Phai }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge" :class="employee.ChucVu === 'Admin' ? 'bg-success' : 'bg-info'">
                                        {{ employee.ChucVu }}
                                    </span>
                                </td>
                                <td>
                                    <i class="fas fa-map-marker-alt me-1 text-muted"></i>
                                    {{ employee.DiaChiDayDu || '(Chưa cập nhật)' }}
                                </td>
                                <td v-if="isAdmin">
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-primary" @click="viewEmployee(employee)"
                                            title="Xem chi tiết">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-outline-warning" @click="editEmployee(employee)"
                                            title="Sửa">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" @click="deleteEmployee(employee)"
                                            title="Xóa">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="employeeModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-user-plus me-2"></i>
                            {{ isEditMode ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới' }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveEmployee">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Họ Tên <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" v-model="formData.HoTen" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" v-model="formData.Email" required />
                                </div>
                                <div class="col-md-6" v-if="!isEditMode">
                                    <label class="form-label">Mật Khẩu <span class="text-danger">*</span></label>
                                    <input type="password" class="form-control" v-model="formData.Password"
                                        :required="!isEditMode" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Số Điện Thoại <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" v-model="formData.SoDienThoai" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Giới Tính <span class="text-danger">*</span></label>
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
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
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
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-user-circle me-2"></i>
                            Chi Tiết Nhân Viên
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedEmployee">
                        <div class="row">
                            <div class="col-md-4 text-center mb-3">
                                <i class="fas fa-user-circle fa-6x text-muted"></i>
                                <h5 class="mt-3">{{ selectedEmployee.HoTen }}</h5>
                                <span class="badge"
                                    :class="selectedEmployee.ChucVu === 'Admin' ? 'bg-success' : 'bg-info'">
                                    {{ selectedEmployee.ChucVu }}
                                </span>
                            </div>
                            <div class="col-md-8">
                                <table class="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th width="40%">MSNV:</th>
                                            <td>{{ selectedEmployee.MSNV }}</td>
                                        </tr>
                                        <tr>
                                            <th>Email:</th>
                                            <td>{{ selectedEmployee.Email }}</td>
                                        </tr>
                                        <tr>
                                            <th>Số Điện Thoại:</th>
                                            <td>{{ selectedEmployee.SoDienThoai }}</td>
                                        </tr>
                                        <tr>
                                            <th>Giới Tính:</th>
                                            <td>{{ selectedEmployee.Phai }}</td>
                                        </tr>
                                        <tr>
                                            <th>Địa Chỉ:</th>
                                            <td>{{ selectedEmployee.DiaChiDayDu || '(Chưa cập nhật)' }}</td>
                                        </tr>
                                        <tr>
                                            <th>Ngày Tạo:</th>
                                            <td>{{ formatDate(selectedEmployee.createdAt) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NhanVienService from '@/services/nhanvien.service';
import AddressSelect from '@/components/AddressSelect.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'Employees',

    components: {
        AddressSelect,
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
        };
    },

    computed: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.ChucVu === 'Admin';
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
        async loadEmployees() {
            this.loading = true;
            try {
                this.employees = await NhanVienService.getAll();
                this.filteredEmployees = [...this.employees];
            } catch (error) {
                console.error('Error loading employees:', error);
                alert('Lỗi khi tải danh sách nhân viên');
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
                    alert('Cập nhật nhân viên thành công!');
                } else {
                    await NhanVienService.create(this.formData);
                    alert('Thêm nhân viên thành công!');
                }

                this.employeeModal.hide();
                await this.loadEmployees();
            } catch (error) {
                console.error('Error saving employee:', error);
                alert(error.response?.data?.message || 'Lỗi khi lưu nhân viên');
            }
        },

        async deleteEmployee(employee) {
            if (!this.isAdmin) return;

            if (!confirm(`Bạn có chắc muốn xóa nhân viên "${employee.HoTen}"?`)) {
                return;
            }

            try {
                await NhanVienService.delete(employee._id);
                alert('Xóa nhân viên thành công!');
                await this.loadEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Lỗi khi xóa nhân viên');
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
    padding: 1.5rem;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
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
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.stat-info h3 {
    font-size: 2rem;
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
