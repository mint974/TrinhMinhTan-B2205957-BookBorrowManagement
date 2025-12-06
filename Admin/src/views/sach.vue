<template>
    <div class="books-container">
        <!-- Page Header -->
        <PageHeader 
            title="Quản Lý Sách"
            subtitle="Quản lý thông tin sách trong thư viện"
            icon="fas fa-book"
            addButtonText="Thêm Sách"
            @add="openAddModal"
        />

        <!-- Search & Filters -->
        <SearchFilter 
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tên sách, mã sách..."
            @search="filterBooks"
            @reset="resetSearch"
        >
            <template #filters>
                <div class="col-md-2">
                    <select class="form-select" v-model="filterTacGia" @change="filterBooks">
                        <option value="">Tất cả tác giả</option>
                        <option v-for="tg in authors" :key="tg._id" :value="tg._id">
                            {{ tg.HoTen }}
                        </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" v-model="filterNhaXuatBan" @change="filterBooks">
                        <option value="">Tất cả NXB</option>
                        <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                            {{ nxb.TenNXB }}
                        </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" v-model="filterDanhMuc" @change="filterBooks">
                        <option value="">Tất cả danh mục</option>
                        <option v-for="dm in categories" :key="dm._id" :value="dm._id">
                            {{ dm.TenDanhMuc }}
                        </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" v-model="filterGia" @change="filterBooks">
                        <option value="">Tất cả giá</option>
                        <option value="duoi50k">Dưới 50.000đ</option>
                        <option value="50k-100k">50.000đ - 100.000đ</option>
                        <option value="100k-200k">100.000đ - 200.000đ</option>
                        <option value="tren200k">Trên 200.000đ</option>
                    </select>
                </div>
            </template>
        </SearchFilter>

        <!-- Books Table -->
        <DataTable
            title="Danh Sách Sách"
            :columns="columns"
            :data="filteredBooks"
            :loading="loading"
            itemName="sách"
            @view="viewBook"
            @edit="editBook"
            @delete="deleteBook"
        >
            <!-- Ảnh bìa column -->
            <template #AnhBia="{ item }">
                <div class="book-cover">
                    <img 
                        v-if="item.medias && item.medias.length > 0"
                        :src="`http://localhost:5000/${item.medias[0].filePath}`" 
                        :alt="item.TenSach"
                        class="img-thumbnail"
                        style="width: 60px; height: 80px; object-fit: cover;"
                    />
                    <div v-else class="no-cover">
                        <i class="fas fa-book fa-2x text-muted"></i>
                    </div>
                </div>
            </template>

            <!-- Tên sách column -->
            <template #TenSach="{ value, item }">
                <div class="d-flex align-items-center">
                    <i class="fas fa-book text-primary me-2"></i>
                    <div>
                        <div class="fw-semibold">{{ value }}</div>
                        <small class="text-muted">{{ item.MaSach }}</small>
                    </div>
                </div>
            </template>

            <!-- Tác giả column -->
            <template #TacGia="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-pen-fancy me-2"></i>
                    <div>
                        <span class="small">{{ value?.HoTen || '(Chưa có)' }}</span>
                        <div v-if="value?.ButDanh" class="text-muted" style="font-size: 0.75rem;">
                            <i class="fas fa-signature me-1"></i>{{ value.ButDanh }}
                        </div>
                    </div>
                </div>
            </template>

            <!-- Nhà xuất bản column -->
            <template #NhaXuatBan="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-building me-2"></i>
                    <span class="small">{{ value?.TenNXB || '(Chưa có)' }}</span>
                </div>
            </template>

            <!-- Danh mục column -->
            <template #DanhMuc="{ value }">
                <span class="badge bg-info bg-opacity-75">
                    {{ value?.TenDanhMuc || '(Chưa có)' }}
                </span>
            </template>

            <!-- Số quyển column -->
            <template #SoQuyen="{ value }">
                <div class="text-center">
                    <span class="badge bg-primary">{{ value }} quyển</span>
                </div>
            </template>

            <!-- Đơn giá column -->
            <template #DonGia="{ value }">
                <div class="text-end fw-semibold text-success">
                    {{ formatCurrency(value) }}
                </div>
            </template>

            <!-- Ngày tạo column -->
            <template #createdAt="{ value }">
                <div class="d-flex align-items-center text-muted">
                    <i class="fas fa-calendar me-2"></i>
                    <span class="small">{{ formatDate(value) }}</span>
                </div>
            </template>
        </DataTable>

        <!-- View Modal -->
        <div class="modal fade" id="viewBookModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-eye me-2"></i>
                            Chi Tiết Sách
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="viewModal.hide()"></button>
                    </div>
                    <div class="modal-body" v-if="selectedBook">
                        <div class="book-details">
                            <div class="row g-3">
                                <!-- Ảnh bìa -->
                                <div class="col-12" v-if="selectedBook.medias && selectedBook.medias.length > 0">
                                    <div class="detail-item text-center">
                                        <label>
                                            <i class="fas fa-image me-2 text-primary"></i>
                                            Ảnh Bìa:
                                        </label>
                                        <div class="mt-2">
                                            <img 
                                                :src="`http://localhost:5000/${selectedBook.medias[0].filePath}`" 
                                                :alt="selectedBook.TenSach"
                                                style="max-width: 300px; max-height: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-barcode me-2 text-primary"></i>
                                            Mã Sách:
                                        </label>
                                        <strong>{{ selectedBook.MaSach }}</strong>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-book me-2 text-primary"></i>
                                            Tên Sách:
                                        </label>
                                        <strong>{{ selectedBook.TenSach }}</strong>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-pen-fancy me-2 text-info"></i>
                                            Tác Giả:
                                        </label>
                                        <span>
                                            {{ selectedBook.TacGia?.HoTen || '(Chưa có)' }}
                                            <span v-if="selectedBook.TacGia?.ButDanh" class="text-muted">
                                                ({{ selectedBook.TacGia.ButDanh }})
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-building me-2 text-warning"></i>
                                            Nhà Xuất Bản:
                                        </label>
                                        <span>{{ selectedBook.NhaXuatBan?.TenNXB || '(Chưa có)' }}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-tags me-2 text-info"></i>
                                            Danh Mục:
                                        </label>
                                        <span>{{ selectedBook.DanhMuc?.TenDanhMuc || '(Chưa có)' }}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-calendar-alt me-2 text-secondary"></i>
                                            Năm Xuất Bản:
                                        </label>
                                        <span>{{ selectedBook.NamXuatBan }}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-box me-2 text-primary"></i>
                                            Số Quyển:
                                        </label>
                                        <span class="badge bg-primary">{{ selectedBook.SoQuyen }} quyển</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-dollar-sign me-2 text-success"></i>
                                            Đơn Giá:
                                        </label>
                                        <span class="text-success fw-bold">{{ formatCurrency(selectedBook.DonGia) }}</span>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-align-left me-2 text-info"></i>
                                            Mô Tả:
                                        </label>
                                        <span>{{ selectedBook.MoTa || '(Chưa có mô tả)' }}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="detail-item">
                                        <label>
                                            <i class="fas fa-calendar-plus me-2 text-warning"></i>
                                            Ngày Tạo:
                                        </label>
                                        <span>{{ formatDate(selectedBook.createdAt) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="viewModal.hide()">
                            <i class="fas fa-times me-2"></i>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="bookModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" :class="isEditMode ? 'bg-warning' : 'bg-success'">
                        <h5 class="modal-title text-white">
                            <i :class="isEditMode ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
                            {{ isEditMode ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="bookModal.hide()"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveBook">
                            <div class="row g-3">
                                <div class="col-md-12">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-book text-primary me-2"></i>
                                        Tên Sách <span class="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="formData.TenSach"
                                        placeholder="Nhập tên sách..."
                                        required
                                    />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-pen-fancy text-info me-2"></i>
                                        Tác Giả <span class="text-danger">*</span>
                                    </label>
                                    <select 
                                        class="form-select" 
                                        v-model="formData.TacGia"
                                        required
                                    >
                                        <option value="">-- Chọn tác giả --</option>
                                        <option v-for="tg in authors" :key="tg._id" :value="tg._id">
                                            {{ tg.HoTen }}<span v-if="tg.ButDanh"> ({{ tg.ButDanh }})</span>
                                        </option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-calendar-alt text-secondary me-2"></i>
                                        Năm Xuất Bản <span class="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        v-model.number="formData.NamXuatBan"
                                        placeholder="Nhập năm xuất bản..."
                                        min="1900"
                                        :max="new Date().getFullYear()"
                                        required
                                    />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-building text-warning me-2"></i>
                                        Nhà Xuất Bản <span class="text-danger">*</span>
                                    </label>
                                    <select 
                                        class="form-select" 
                                        v-model="formData.NhaXuatBan"
                                        required
                                    >
                                        <option value="">-- Chọn nhà xuất bản --</option>
                                        <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                                            {{ nxb.TenNXB }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-tags text-info me-2"></i>
                                        Danh Mục <span class="text-danger">*</span>
                                    </label>
                                    <select 
                                        class="form-select" 
                                        v-model="formData.DanhMuc"
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        <option v-for="dm in categories" :key="dm._id" :value="dm._id">
                                            {{ dm.TenDanhMuc }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-box text-primary me-2"></i>
                                        Số Quyển <span class="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        v-model.number="formData.SoQuyen"
                                        placeholder="Nhập số quyển..."
                                        min="0"
                                        required
                                    />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-dollar-sign text-success me-2"></i>
                                        Đơn Giá (VNĐ) <span class="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        v-model.number="formData.DonGia"
                                        placeholder="Nhập đơn giá..."
                                        min="0"
                                        required
                                    />
                                </div>

                                <div class="col-12">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-align-left text-info me-2"></i>
                                        Mô Tả
                                    </label>
                                    <textarea 
                                        class="form-control" 
                                        v-model="formData.MoTa"
                                        rows="3"
                                        placeholder="Nhập mô tả về sách..."
                                    ></textarea>
                                </div>

                                <div class="col-12">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-image text-primary me-2"></i>
                                        Ảnh Bìa Sách
                                    </label>
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        @change="onFileChange"
                                        accept="image/*"
                                    />
                                    <div v-if="previewImage" class="mt-3">
                                        <img :src="previewImage" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;" />
                                    </div>
                                    <div v-else-if="isEditMode && selectedBook?.medias?.length > 0" class="mt-3">
                                        <img :src="`http://localhost:5000/${selectedBook.medias[0].filePath}`" alt="Current" style="max-width: 200px; max-height: 200px; border-radius: 8px;" />
                                        <p class="text-muted small mt-2">Ảnh hiện tại</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="bookModal.hide()">
                            <i class="fas fa-times me-2"></i>
                            Hủy
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveBook">
                            <i class="fas fa-save me-2"></i>
                            {{ isEditMode ? 'Cập Nhật' : 'Thêm Mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { useToast } from 'vue-toastification';
import SachService from '../services/sach.service';
import NhaXuatBanService from '../services/nhaxuatban.service';
import DanhMucService from '../services/danhmuc.service';
import TacGiaService from '../services/tacgia.service';
import PageHeader from '@/components/PageHeader.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import DataTable from '@/components/DataTable.vue';

export default {
    name: 'Books',

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
            books: [],
            filteredBooks: [],
            publishers: [],
            categories: [],
            authors: [],
            selectedBook: null,
            searchQuery: '',
            filterTacGia: '',
            filterNhaXuatBan: '',
            filterDanhMuc: '',
            filterGia: '',
            loading: false,
            isEditMode: false,
            bookModal: null,
            viewModal: null,
            selectedFile: null,
            previewImage: null,
            formData: {
                TenSach: '',
                TacGia: '',
                NhaXuatBan: '',
                DanhMuc: '',
                NamXuatBan: new Date().getFullYear(),
                SoQuyen: 1,
                DonGia: 0,
                MoTa: '',
            },
            columns: [
                { key: 'AnhBia', label: 'Ảnh Bìa', width: '8%' },
                { key: 'TenSach', label: 'Tên Sách', width: '20%' },
                { key: 'TacGia', label: 'Tác Giả', width: '13%' },
                { key: 'NhaXuatBan', label: 'Nhà Xuất Bản', width: '13%' },
                { key: 'DanhMuc', label: 'Danh Mục', width: '11%' },
                { key: 'SoQuyen', label: 'Số Quyển', width: '9%' },
                { key: 'DonGia', label: 'Đơn Giá', width: '11%' },
                { key: 'createdAt', label: 'Ngày Tạo', width: '10%' },
                { key: 'actions', label: 'Hành Động', width: '5%' },
            ],
        };
    },

    mounted() {
        this.bookModal = new Modal(document.getElementById('bookModal'));
        this.viewModal = new Modal(document.getElementById('viewBookModal'));
        this.loadBooks();
        this.loadPublishers();
        this.loadCategories();
        this.loadAuthors();
    },

    watch: {
        searchQuery() {
            this.filterBooks();
        },
    },

    methods: {
        async loadBooks() {
            this.loading = true;
            try {
                const response = await SachService.getAll();
                this.books = response || [];
                this.filteredBooks = [...this.books];
            } catch (error) {
                console.error('Error loading books:', error);
                this.toast.error('Lỗi khi tải danh sách sách');
            } finally {
                this.loading = false;
            }
        },

        async loadPublishers() {
            try {
                this.publishers = await NhaXuatBanService.getAll();
            } catch (error) {
                console.error('Error loading publishers:', error);
            }
        },

        async loadCategories() {
            try {
                this.categories = await DanhMucService.getAll();
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        },

        async loadAuthors() {
            try {
                this.authors = await TacGiaService.getAllForSelect();
            } catch (error) {
                console.error('Error loading authors:', error);
            }
        },

        filterBooks() {
            let filtered = [...this.books];

            // Lọc theo từ khóa tìm kiếm
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(b => {
                    const tenSach = (b.TenSach || '').toLowerCase();
                    const maSach = (b.MaSach || '').toLowerCase();
                    const tenNXB = (b.NhaXuatBan?.TenNXB || '').toLowerCase();
                    const tenTacGia = (b.TacGia?.HoTen || '').toLowerCase();
                    const butDanh = (b.TacGia?.ButDanh || '').toLowerCase();
                    
                    return tenSach.includes(query) ||
                           maSach.includes(query) ||
                           tenNXB.includes(query) ||
                           tenTacGia.includes(query) ||
                           butDanh.includes(query);
                });
            }

            // Lọc theo tác giả
            if (this.filterTacGia) {
                filtered = filtered.filter(b => b.TacGia?._id === this.filterTacGia);
            }

            // Lọc theo nhà xuất bản
            if (this.filterNhaXuatBan) {
                filtered = filtered.filter(b => b.NhaXuatBan?._id === this.filterNhaXuatBan);
            }

            // Lọc theo danh mục
            if (this.filterDanhMuc) {
                filtered = filtered.filter(b => b.DanhMuc?._id === this.filterDanhMuc);
            }

            // Lọc theo giá
            if (this.filterGia) {
                filtered = filtered.filter(b => {
                    const gia = b.DonGia;
                    switch(this.filterGia) {
                        case 'duoi50k':
                            return gia < 50000;
                        case '50k-100k':
                            return gia >= 50000 && gia < 100000;
                        case '100k-200k':
                            return gia >= 100000 && gia < 200000;
                        case 'tren200k':
                            return gia >= 200000;
                        default:
                            return true;
                    }
                });
            }

            this.filteredBooks = filtered;
        },

        resetSearch() {
            this.searchQuery = '';
            this.filterTacGia = '';
            this.filterNhaXuatBan = '';
            this.filterDanhMuc = '';
            this.filterGia = '';
            this.filteredBooks = [...this.books];
        },

        openAddModal() {
            this.isEditMode = false;
            this.selectedFile = null;
            this.previewImage = null;
            this.formData = {
                TenSach: '',
                TacGia: '',
                NhaXuatBan: '',
                DanhMuc: '',
                NamXuatBan: new Date().getFullYear(),
                SoQuyen: 1,
                DonGia: 0,
                MoTa: '',
            };
            this.bookModal.show();
        },

        editBook(book) {
            this.isEditMode = true;
            this.selectedBook = book;
            this.selectedFile = null;
            this.previewImage = null;
            this.formData = {
                TenSach: book.TenSach,
                TacGia: book.TacGia?._id || '',
                NhaXuatBan: book.NhaXuatBan?._id || '',
                DanhMuc: book.DanhMuc?._id || '',
                NamXuatBan: book.NamXuatBan,
                SoQuyen: book.SoQuyen,
                DonGia: book.DonGia,
                MoTa: book.MoTa || '',
            };
            this.bookModal.show();
        },

        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewImage = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        viewBook(book) {
            this.selectedBook = book;
            this.viewModal.show();
        },

        async saveBook() {
            try {
                let savedBook;
                
                if (this.isEditMode) {
                    savedBook = await SachService.update(this.selectedBook._id, this.formData);
                    this.toast.success('Cập nhật sách thành công!');
                } else {
                    savedBook = await SachService.create(this.formData);
                    this.toast.success('Thêm sách thành công!');
                }

                // Upload ảnh bìa nếu có
                if (this.selectedFile && savedBook) {
                    await this.uploadBookCover(savedBook._id);
                }

                this.bookModal.hide();
                await this.loadBooks();
            } catch (error) {
                console.error('Error saving book:', error);
                this.toast.error(error.response?.data?.message || 'Lỗi khi lưu sách');
            }
        },

        async uploadBookCover(sachId) {
            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('TenMedia', `Ảnh bìa - ${this.formData.TenSach}`);
                formData.append('LoaiMedia', 'Ảnh bìa sách');
                formData.append('Sach', sachId);

                const response = await fetch('http://localhost:5000/api/media/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload ảnh thất bại');
                }

                this.toast.success('Upload ảnh bìa thành công!');
            } catch (error) {
                console.error('Error uploading image:', error);
                this.toast.error('Lỗi khi upload ảnh bìa');
            }
        },

        async deleteBook(book) {
            if (!confirm(`Bạn có chắc muốn xóa sách "${book.TenSach}"?`)) {
                return;
            }

            try {
                await SachService.delete(book._id);
                this.toast.success('Xóa sách thành công!');
                await this.loadBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
                this.toast.error(error.response?.data?.message || 'Lỗi khi xóa sách');
            }
        },

        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('vi-VN');
        },

        formatCurrency(amount) {
            if (!amount) return '0 ₫';
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        },
    },
};
</script>

<style scoped>
.books-container {
    padding: 20px;
}

.detail-item {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 8px;
}

.detail-item label {
    display: block;
    font-weight: 600;
    color: #495057;
    margin-bottom: 4px;
}

.detail-item span,
.detail-item strong {
    color: #212529;
}

.book-details {
    padding: 10px 0;
}

.modal-header {
    border-bottom: none;
}

.modal-footer {
    border-top: none;
    padding-top: 0;
}

.form-label {
    margin-bottom: 8px;
    color: #495057;
}

.form-control,
.form-select {
    border-radius: 8px;
    border: 1px solid #dee2e6;
    padding: 10px 14px;
}

.form-control:focus,
.form-select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.badge {
    padding: 6px 12px;
    font-weight: 500;
}

.book-cover {
    display: flex;
    align-items: center;
    justify-content: center;
}

.book-cover .img-thumbnail {
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-cover .no-cover {
    width: 60px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 6px;
}
</style>
