<template>
    <div class="readers-page">
        <!-- Header -->
        <PageHeader 
            title="Quản Lý Độc Giả"
            subtitle="Quản lý thông tin độc giả trong hệ thống"
            icon="fas fa-user-graduate"
            addButtonText="Thêm Độc Giả"
            @add="openAddModal"
        />

        <!-- Search & Filter -->
        <SearchFilter 
            v-model="searchQuery"
            placeholder="Tìm theo tên, email, SĐT, mã độc giả..."
            @update:modelValue="filterReaders"
            @reset="resetFilters"
        >
            <template #filters>
                <div class="col-md-3">
                    <select class="form-select" v-model="filterGioiTinh" @change="filterReaders">
                        <option value="">Tất cả giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" v-model="filterStatus" @change="filterReaders">
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="banned">Bị cấm</option>
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
                        <h3>{{ totalReaders }}</h3>
                        <p>Tổng độc giả</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-success">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ activeReaders }}</h3>
                        <p>Đang hoạt động</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-danger">
                        <i class="fas fa-user-lock"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ bannedReaders }}</h3>
                        <p>Bị cấm</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon bg-warning">
                        <i class="fas fa-filter"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ filteredReaders.length }}</h3>
                        <p>Kết quả lọc</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Readers Table -->
        <DataTable
            title="Danh Sách Độc Giả"
            :columns="tableColumns"
            :data="paginatedReaders"
            :loading="loading"
            item-name="độc giả"
        >
            <!-- Mã độc giả column -->
            <template #MaDocGia="{ value }">
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
                    <div>
                        <strong class="text-dark">{{ item.HoLot }} {{ item.Ten }}</strong>
                        <div v-if="isBanned(item)" class="text-danger small">
                            <i class="fas fa-ban me-1"></i>
                            Cấm đến {{ formatDate(item.NgayBiCam) }}
                        </div>
                    </div>
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
            <template #DienThoai="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-phone me-2"></i>
                    <span class="small">{{ value }}</span>
                </div>
            </template>
            
            <!-- Giới tính column -->
            <template #GioiTinh="{ value }">
                <span :class="value === 'Nam' ? 'text-primary' : 'text-danger'">
                    <i :class="value === 'Nam' ? 'fas fa-mars' : 'fas fa-venus'" class="me-1"></i>
                    {{ value }}
                </span>
            </template>
            
            <!-- Ngày sinh column -->
            <template #NgaySinh="{ value }">
                <span class="small">{{ formatDate(value) }}</span>
            </template>

            <!-- Trạng thái column -->
            <template #TrangThai="{ item }">
                <span class="badge" :class="isBanned(item) ? 'bg-danger' : 'bg-success'">
                    {{ isBanned(item) ? 'Bị cấm' : 'Hoạt động' }}
                </span>
            </template>

            <!-- Actions column -->
            <template #actions="{ item }">
                <div class="d-flex justify-content-center gap-1">
                    <button class="btn btn-outline-primary btn-sm" @click="viewReader(item)"
                        title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" @click="editReader(item)"
                        title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button v-if="isBanned(item)" class="btn btn-outline-success btn-sm" 
                        @click="unbanReader(item)" title="Gỡ cấm">
                        <i class="fas fa-unlock"></i>
                    </button>
                    <button v-else class="btn btn-outline-danger btn-sm" 
                        @click="banReader(item)" title="Cấm mượn sách">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteReader(item)"
                        title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </template>
        </DataTable>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-3">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
                <li v-for="page in displayPages" :key="page" class="page-item" 
                    :class="{ active: page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="readerModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-plus me-2"></i>
                            {{ isEditMode ? 'Cập Nhật Độc Giả' : 'Thêm Độc Giả Mới' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveReader">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-user me-1 text-primary"></i>
                                        Họ Lót <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.HoLot" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-user me-1 text-primary"></i>
                                        Tên <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.Ten" required />
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
                                    <input type="tel" class="form-control" v-model="formData.DienThoai" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-calendar me-1 text-info"></i>
                                        Ngày Sinh <span class="text-danger">*</span>
                                    </label>
                                    <input type="date" class="form-control" v-model="formData.NgaySinh" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">
                                        <i class="fas fa-venus-mars me-1 text-danger"></i>
                                        Giới Tính <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" v-model="formData.GioiTinh" required>
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                
                                <!-- Address Component -->
                                <div class="col-12">
                                    <AddressSelect 
                                        v-model:tinh="formData.MaTinh"
                                        v-model:quan="formData.MaQuan"
                                        v-model:phuong="formData.MaPhuong"
                                    />
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label">
                                        <i class="fas fa-map-marker-alt me-1 text-danger"></i>
                                        Địa Chỉ Chi Tiết
                                    </label>
                                    <input type="text" class="form-control" v-model="formData.DiaChiChiTiet"
                                        placeholder="Số nhà, tên đường..." />
                                </div>

                                <!-- Avatar Upload -->
                                <div class="col-12">
                                    <label class="form-label">
                                        <i class="fas fa-image me-1 text-info"></i>
                                        Ảnh Đại Diện
                                    </label>
                                    <input type="file" class="form-control" accept="image/*" 
                                        @change="handleAvatarChange" ref="avatarInput" />
                                    <div v-if="avatarPreview" class="mt-2">
                                        <img :src="avatarPreview" class="img-thumbnail" 
                                            style="max-width: 150px; max-height: 150px;" alt="Preview" />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4 d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="fas fa-times me-2"></i>
                                    Hủy
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>
                                    {{ isEditMode ? 'Cập Nhật' : 'Thêm Mới' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- View Details Modal -->
        <div class="modal fade" id="viewReaderModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-info-circle me-2"></i>
                            Thông Tin Độc Giả
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="viewModal.hide()"></button>
                    </div>
                    <div class="modal-body" v-if="selectedReader">
                        <div class="row">
                            <div class="col-md-4 text-center mb-3">
                                <img v-if="selectedReader.Avatar" 
                                    :src="getAvatarUrl(selectedReader.Avatar)" 
                                    class="img-thumbnail rounded-circle mb-2" 
                                    style="width: 150px; height: 150px; object-fit: cover;" 
                                    alt="Avatar" />
                                <div v-else class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                                     style="width: 150px; height: 150px;">
                                    <i class="fas fa-user fa-4x text-muted"></i>
                                </div>
                                <h5 class="mb-1">{{ selectedReader.HoLot }} {{ selectedReader.Ten }}</h5>
                                <p class="text-muted mb-1">{{ selectedReader.MaDocGia }}</p>
                                <span class="badge" :class="isBanned(selectedReader) ? 'bg-danger' : 'bg-success'">
                                    {{ isBanned(selectedReader) ? 'Bị cấm' : 'Hoạt động' }}
                                </span>
                            </div>
                            <div class="col-md-8">
                                <div class="detail-item">
                                    <label>Email:</label>
                                    <span>{{ selectedReader.Email }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Số Điện Thoại:</label>
                                    <span>{{ selectedReader.DienThoai }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Ngày Sinh:</label>
                                    <span>{{ formatDate(selectedReader.NgaySinh) }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Giới Tính:</label>
                                    <span>{{ selectedReader.GioiTinh }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Địa Chỉ:</label>
                                    <span>{{ selectedReader.DiaChiDayDu || '(Chưa có)' }}</span>
                                </div>
                                <div v-if="isBanned(selectedReader)" class="detail-item">
                                    <label>Ngày Bị Cấm Đến:</label>
                                    <span class="text-danger fw-bold">{{ formatDate(selectedReader.NgayBiCam) }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Ngày Tạo:</label>
                                    <span>{{ formatDate(selectedReader.createdAt) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ban Reader Modal -->
        <div class="modal fade" id="banModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-ban me-2"></i>
                            Cấm Độc Giả Mượn Sách
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Độc giả sẽ không thể mượn sách cho đến ngày được chỉ định
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">
                                Cấm đến ngày <span class="text-danger">*</span>
                            </label>
                            <input type="date" class="form-control" v-model="banDate" 
                                :min="new Date().toISOString().split('T')[0]" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>
                            Hủy
                        </button>
                        <button type="button" class="btn btn-danger" @click="confirmBan">
                            <i class="fas fa-ban me-2"></i>
                            Xác Nhận Cấm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import ReaderService from '@/services/docgia.service';
import PageHeader from '@/components/PageHeader.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import DataTable from '@/components/DataTable.vue';
import AddressSelect from '@/components/AddressSelect.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'Readers',

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
            readers: [],
            filteredReaders: [],
            searchQuery: '',
            filterGioiTinh: '',
            filterStatus: '',
            loading: false,
            isEditMode: false,
            selectedReader: null,
            banDate: '',
            avatarPreview: null,
            currentPage: 1,
            itemsPerPage: 10,
            formData: {
                HoLot: '',
                Ten: '',
                Email: '',
                Password: '',
                DienThoai: '',
                NgaySinh: '',
                GioiTinh: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
            },
            readerModal: null,
            viewModal: null,
            banModal: null,
            tableColumns: [
                { key: 'MaDocGia', label: 'Mã ĐG', width: '8%' },
                { key: 'HoTen', label: 'Họ Tên', width: '18%' },
                { key: 'Email', label: 'Email', width: '17%' },
                { key: 'DienThoai', label: 'Số ĐT', width: '12%' },
                { key: 'GioiTinh', label: 'Giới Tính', width: '8%' },
                { key: 'NgaySinh', label: 'Ngày Sinh', width: '10%' },
                { key: 'TrangThai', label: 'Trạng Thái', width: '10%' },
                { key: 'actions', label: 'Thao Tác', width: '17%' },
            ],
        };
    },

    computed: {
        totalReaders() {
            return this.readers.length;
        },

        activeReaders() {
            return this.readers.filter(r => !this.isBanned(r)).length;
        },

        bannedReaders() {
            return this.readers.filter(r => this.isBanned(r)).length;
        },

        totalPages() {
            return Math.ceil(this.filteredReaders.length / this.itemsPerPage);
        },

        paginatedReaders() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredReaders.slice(start, end);
        },

        displayPages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);
            
            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            return pages;
        }
    },

    mounted() {
        this.readerModal = new Modal(document.getElementById('readerModal'));
        this.viewModal = new Modal(document.getElementById('viewReaderModal'));
        this.banModal = new Modal(document.getElementById('banModal'));
        this.loadReaders();
    },

    methods: {
        async loadReaders() {
            this.loading = true;
            try {
                const response = await ReaderService.getAll();
                this.readers = response.data || [];
                this.filteredReaders = [...this.readers];
            } catch (error) {
                this.toast.error('Lỗi khi tải danh sách độc giả');
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        filterReaders() {
            let filtered = [...this.readers];

            // Lọc theo từ khóa tìm kiếm
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(r => {
                    const hoTen = `${r.HoLot} ${r.Ten}`.toLowerCase();
                    const email = (r.Email || '').toLowerCase();
                    const dienThoai = (r.DienThoai || '').toLowerCase();
                    const maDocGia = (r.MaDocGia || '').toLowerCase();
                    
                    return hoTen.includes(query) ||
                           email.includes(query) ||
                           dienThoai.includes(query) ||
                           maDocGia.includes(query);
                });
            }

            // Lọc theo giới tính
            if (this.filterGioiTinh) {
                filtered = filtered.filter(r => r.GioiTinh === this.filterGioiTinh);
            }

            // Lọc theo trạng thái
            if (this.filterStatus === 'active') {
                filtered = filtered.filter(r => !this.isBanned(r));
            } else if (this.filterStatus === 'banned') {
                filtered = filtered.filter(r => this.isBanned(r));
            }

            this.filteredReaders = filtered;
            this.currentPage = 1; // Reset về trang 1
        },

        resetFilters() {
            this.searchQuery = '';
            this.filterGioiTinh = '';
            this.filterStatus = '';
            this.filteredReaders = [...this.readers];
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        isBanned(reader) {
            if (!reader.NgayBiCam) return false;
            return new Date(reader.NgayBiCam) > new Date();
        },

        openAddModal() {
            this.isEditMode = false;
            this.avatarPreview = null;
            if (this.$refs.avatarInput) {
                this.$refs.avatarInput.value = '';
            }
            this.formData = {
                HoLot: '',
                Ten: '',
                Email: '',
                Password: '',
                DienThoai: '',
                NgaySinh: '',
                GioiTinh: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
            };
            this.readerModal.show();
        },

        editReader(reader) {
            this.isEditMode = true;
            this.selectedReader = reader;
            this.avatarPreview = reader.Avatar ? this.getAvatarUrl(reader.Avatar) : null;
            this.formData = {
                HoLot: reader.HoLot,
                Ten: reader.Ten,
                Email: reader.Email,
                Password: '',
                DienThoai: reader.DienThoai,
                NgaySinh: reader.NgaySinh ? reader.NgaySinh.split('T')[0] : '',
                GioiTinh: reader.GioiTinh,
                MaTinh: reader.MaTinh || '',
                MaQuan: reader.MaQuan || '',
                MaPhuong: reader.MaPhuong || '',
                DiaChiChiTiet: reader.DiaChiChiTiet || '',
            };
            this.readerModal.show();
        },

        viewReader(reader) {
            this.selectedReader = reader;
            this.viewModal.show();
        },

        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.avatarPreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async saveReader() {
            try {
                const formDataToSend = new FormData();
                
                // Append all form fields
                Object.keys(this.formData).forEach(key => {
                    if (this.formData[key]) {
                        formDataToSend.append(key, this.formData[key]);
                    }
                });

                // Append avatar if selected
                if (this.$refs.avatarInput && this.$refs.avatarInput.files[0]) {
                    formDataToSend.append('Avatar', this.$refs.avatarInput.files[0]);
                }

                if (this.isEditMode) {
                    await ReaderService.update(this.selectedReader._id, formDataToSend);
                    this.toast.success('Cập nhật độc giả thành công');
                } else {
                    await ReaderService.create(formDataToSend);
                    this.toast.success('Thêm độc giả mới thành công');
                }

                this.readerModal.hide();
                await this.loadReaders();
            } catch (error) {
                this.toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
                console.error(error);
            }
        },

        banReader(reader) {
            this.selectedReader = reader;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.banDate = tomorrow.toISOString().split('T')[0];
            this.banModal.show();
        },

        async confirmBan() {
            if (!this.banDate) {
                this.toast.error('Vui lòng chọn ngày cấm');
                return;
            }

            try {
                await ReaderService.ban(this.selectedReader._id, { NgayBiCam: this.banDate });
                this.toast.success('Đã cấm độc giả mượn sách');
                this.banModal.hide();
                await this.loadReaders();
            } catch (error) {
                this.toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
                console.error(error);
            }
        },

        async unbanReader(reader) {
            if (!confirm(`Bạn có chắc muốn gỡ cấm cho độc giả ${reader.HoLot} ${reader.Ten}?`)) {
                return;
            }

            try {
                await ReaderService.unban(reader._id);
                this.toast.success('Đã gỡ cấm độc giả');
                await this.loadReaders();
            } catch (error) {
                this.toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
                console.error(error);
            }
        },

        async deleteReader(reader) {
            if (!confirm(`Bạn có chắc muốn xóa độc giả ${reader.HoLot} ${reader.Ten}?`)) {
                return;
            }

            try {
                await ReaderService.delete(reader._id);
                this.toast.success('Xóa độc giả thành công');
                await this.loadReaders();
            } catch (error) {
                this.toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
                console.error(error);
            }
        },

        getAvatarUrl(avatar) {
            if (!avatar) return '';
            // Xử lý cả trường hợp có và không có dấu / ở đầu
            const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
            return `http://localhost:5000${cleanPath}`;
        },

        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString('vi-VN');
        },
    },
};
</script>

<style scoped>
.readers-page {
    padding: 1.5rem;
}

/* Stat Cards */
.stat-card {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.stat-info h3 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
}

.stat-info p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
}

/* Detail Item */
.detail-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-item label {
    font-weight: 600;
    color: #495057;
    margin: 0;
    min-width: 150px;
}

.detail-item span {
    color: #6c757d;
}

/* Avatar */
.avatar img,
.avatar > div {
    border: 2px solid #e9ecef;
}

/* Pagination */
.pagination .page-link {
    color: #667eea;
    border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: #667eea;
    border-color: #667eea;
}

.pagination .page-link:hover {
    color: #5568d3;
    background-color: #e9ecef;
}
</style>
