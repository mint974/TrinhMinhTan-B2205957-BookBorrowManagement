<template>
  <div class="tacgia-page">
    <!-- Header -->
    <PageHeader 
      title="Quản Lý Tác Giả" 
      subtitle="Quản lý thông tin tác giả trong hệ thống"
      icon="fas fa-user-edit"
      addButtonText="Thêm Tác Giả"
      @add="showAddModal"
    />

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>{{ pagination.total || 0 }}</h3>
            <p>Tổng tác giả</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="fas fa-flag"></i>
          </div>
          <div class="stat-info">
            <h3>{{ vietnameseAuthors }}</h3>
            <p>Tác giả Việt Nam</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="fas fa-globe"></i>
          </div>
          <div class="stat-info">
            <h3>{{ foreignAuthors }}</h3>
            <p>Tác giả nước ngoài</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="fas fa-heart"></i>
          </div>
          <div class="stat-info">
            <h3>{{ aliveAuthors }}</h3>
            <p>Còn sống</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <SearchFilter 
      v-model="searchQuery"
      placeholder="Tìm theo tên, bút danh, tiểu sử..."
      @update:modelValue="handleSearch"
      @reset="resetSearch"
    >
      <template #filters>
        <div class="col-md-3">
          <select 
            v-model="selectedQuocTich" 
            @change="handleFilterChange"
            class="form-select"
          >
            <option value="">Tất cả quốc tịch</option>
            <option value="Việt Nam">Việt Nam</option>
            <option value="Mỹ">Mỹ</option>
            <option value="Anh">Anh</option>
            <option value="Pháp">Pháp</option>
            <option value="Nhật Bản">Nhật Bản</option>
            <option value="Trung Quốc">Trung Quốc</option>
            <option value="Hàn Quốc">Hàn Quốc</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div class="col-md-3">
          <select 
            v-model="statusFilter" 
            @change="handleFilterChange"
            class="form-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="alive">Còn sống</option>
            <option value="dead">Đã qua đời</option>
          </select>
        </div>
      </template>
    </SearchFilter>

    <!-- Data Table -->
    <DataTable
      title="Danh Sách Tác Giả"
      :columns="columns"
      :data="filteredAuthors"
      :loading="loading"
      item-name="tác giả"
      @delete="confirmDelete"
    >
      <!-- Hình Ảnh column -->
      <template #HinhAnh="{ value }">
        <div class="author-avatar-small">
          <img 
            v-if="value" 
            :src="`http://localhost:5000/${value}`"
            alt="Avatar"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </template>

      <!-- Họ Tên column -->
      <template #HoTen="{ value, item }">
        <div class="d-flex align-items-center">
          <i class="fas fa-user me-2 text-primary"></i>
          <div>
            <strong class="text-dark">{{ value }}</strong>
            <small v-if="item.ButDanh" class="text-muted d-block">Bút danh: {{ item.ButDanh }}</small>
          </div>
        </div>
      </template>

      <!-- Năm Sinh column -->
      <template #NamSinh="{ value }">
        <div class="d-flex align-items-center text-muted">
          <i class="fas fa-birthday-cake me-2"></i>
          <span>{{ value || 'N/A' }}</span>
        </div>
      </template>

      <!-- Quốc Tịch column -->
      <template #QuocTich="{ value }">
        <div class="d-flex align-items-center">
          <i class="fas fa-globe me-2 text-info"></i>
          <span class="badge bg-info bg-opacity-75">{{ value || 'N/A' }}</span>
        </div>
      </template>

      <!-- Actions column -->
      <template #actions="{ item }">
        <div class="d-flex justify-content-center gap-1">
          <button class="btn btn-outline-primary btn-sm" @click="showViewModal(item)"
            title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-outline-warning btn-sm" @click="showEditModal(item)"
            title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(item)"
            title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="authorModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="fas fa-user-edit me-2"></i>
              {{ isEdit ? 'Cập Nhật Tác Giả' : 'Thêm Tác Giả Mới' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="saveAuthor">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-user me-1 text-primary"></i>
                      Họ tên <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.HoTen"
                      required 
                      placeholder="Nhập họ tên tác giả"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-pen-fancy me-1 text-info"></i>
                      Bút danh
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.ButDanh"
                      placeholder="Nhập bút danh (nếu có)"
                    />
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">
                          <i class="fas fa-birthday-cake me-1 text-success"></i>
                          Năm sinh
                        </label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="form.NamSinh"
                          min="1000" 
                          max="2024"
                          placeholder="VD: 1950"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">
                          <i class="fas fa-cross me-1 text-secondary"></i>
                          Năm mất
                        </label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="form.NamMat"
                          min="1000" 
                          max="2024"
                          placeholder="VD: 2020 (để trống nếu còn sống)"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-globe me-1 text-info"></i>
                      Quốc tịch
                    </label>
                    <select class="form-select" v-model="form.QuocTich">
                      <option value="">Chọn quốc tịch</option>
                      <option value="Việt Nam">Việt Nam</option>
                      <option value="Mỹ">Mỹ</option>
                      <option value="Anh">Anh</option>
                      <option value="Pháp">Pháp</option>
                      <option value="Nhật Bản">Nhật Bản</option>
                      <option value="Trung Quốc">Trung Quốc</option>
                      <option value="Hàn Quốc">Hàn Quốc</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-map-marker-alt me-1 text-danger"></i>
                      Tỉnh/Thành phố
                    </label>
                    <select class="form-select" v-model="form.MaTinh">
                      <option value="">Chọn tỉnh/thành phố</option>
                      <!-- Tạm thời hard-code, sẽ tích hợp API sau -->
                      <option value="79">TP. Hồ Chí Minh</option>
                      <option value="01">Hà Nội</option>
                      <option value="48">Đà Nẵng</option>
                      <option value="31">Hải Phòng</option>
                      <option value="92">Cần Thơ</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-map-marker-alt me-1 text-warning"></i>
                      Quận/Huyện
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.MaQuan"
                      placeholder="Nhập quận/huyện..."
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-map-marker-alt me-1 text-info"></i>
                      Phường/Xã
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.MaPhuong"
                      placeholder="Nhập phường/xã..."
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-home me-1 text-success"></i>
                      Địa chỉ chi tiết
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.DiaChiChiTiet"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Hình ảnh</label>
                    <div class="author-image-upload">
                      <div class="image-preview" v-if="imagePreview || form.HinhAnh">
                        <img 
                          :src="imagePreview || (form.HinhAnh ? `http://localhost:5000/${form.HinhAnh}` : '')" 
                          alt="Preview" 
                          class="preview-img"
                        />
                        <button 
                          type="button" 
                          class="btn btn-sm btn-danger remove-image"
                          @click="removeImage"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                      <div v-else class="image-placeholder" @click="triggerFileUpload">
                        <i class="fas fa-camera"></i>
                        <p>Chọn hình ảnh</p>
                      </div>
                      <input 
                        type="file" 
                        ref="imageInput"
                        @change="handleImageChange"
                        accept="image/*"
                        style="display: none"
                      />
                      <button 
                        type="button" 
                        class="btn btn-outline-primary btn-sm mt-2 w-100"
                        @click="triggerFileUpload"
                      >
                        <i class="fas fa-upload"></i> Chọn ảnh
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-align-left me-1 text-warning"></i>
                  Tiểu sử
                </label>
                <textarea 
                  class="form-control" 
                  v-model="form.TieuSu"
                  rows="4"
                  placeholder="Nhập tiểu sử tác giả..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-2"></i>
                Hủy
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <i v-if="saving" class="fas fa-spinner fa-spin me-2"></i>
                <i v-else class="fas fa-save me-2"></i>
                {{ saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới') }}
              </button>
            </div>
          </form>
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
              Chi Tiết Tác Giả
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedAuthor">
            <div class="author-details-view">
              <div class="row">
                <div class="col-md-4 text-center">
                  <div class="detail-avatar mb-3">
                    <img 
                      v-if="selectedAuthor.HinhAnh" 
                      :src="`http://localhost:5000/${selectedAuthor.HinhAnh}`"
                      alt="Author Image"
                      class="detail-img"
                    />
                    <div v-else class="detail-no-image">
                      <i class="fas fa-user-circle"></i>
                    </div>
                  </div>
                  <h5>{{ selectedAuthor.HoTen }}</h5>
                  <p class="text-muted" v-if="selectedAuthor.ButDanh">
                    <i class="fas fa-pen-fancy me-1"></i>
                    Bút danh: {{ selectedAuthor.ButDanh }}
                  </p>
                </div>
                <div class="col-md-8">
                  <div class="detail-item">
                    <label>
                      <i class="fas fa-birthday-cake me-2 text-success"></i>
                      Năm sinh:
                    </label>
                    <span>{{ selectedAuthor.NamSinh || 'Không rõ' }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedAuthor.NamMat">
                    <label>
                      <i class="fas fa-cross me-2 text-secondary"></i>
                      Năm mất:
                    </label>
                    <span>{{ selectedAuthor.NamMat }}</span>
                  </div>
                  <div class="detail-item">
                    <label>
                      <i class="fas fa-globe me-2 text-info"></i>
                      Quốc tịch:
                    </label>
                    <span>{{ selectedAuthor.QuocTich || 'Không rõ' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>
                      <i class="fas fa-heartbeat me-2 text-danger"></i>
                      Trạng thái:
                    </label>
                    <span class="badge" :class="selectedAuthor.TrangThai === 'Còn sống' ? 'bg-success' : 'bg-dark'">
                      {{ selectedAuthor.TrangThai }}
                    </span>
                  </div>
                  <div class="detail-item" v-if="selectedAuthor.DiaChiChiTiet || selectedAuthor.MaTinh">
                    <label>
                      <i class="fas fa-map-marker-alt me-2 text-danger"></i>
                      Địa chỉ:
                    </label>
                    <span>
                      {{ [selectedAuthor.DiaChiChiTiet, selectedAuthor.MaPhuong, selectedAuthor.MaQuan, selectedAuthor.MaTinh].filter(Boolean).join(', ') || 'Không rõ' }}
                    </span>
                  </div>
                  <div class="detail-item" v-if="selectedAuthor.TieuSu">
                    <label>
                      <i class="fas fa-align-left me-2 text-warning"></i>
                      Tiểu sử:
                    </label>
                    <p class="mt-2 text-justify">{{ selectedAuthor.TieuSu }}</p>
                  </div>
                  <div class="detail-item">
                    <label>
                      <i class="fas fa-calendar-plus me-2 text-primary"></i>
                      Ngày tạo:
                    </label>
                    <span>{{ formatDate(selectedAuthor.createdAt) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>
                      <i class="fas fa-calendar-edit me-2 text-warning"></i>
                      Cập nhật lần cuối:
                    </label>
                    <span>{{ formatDate(selectedAuthor.updatedAt) }}</span>
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

<script>
import { useToast } from 'vue-toastification';
import TacGiaService from '../services/tacgia.service';
import PageHeader from '../components/PageHeader.vue';
import SearchFilter from '../components/SearchFilter.vue';
import DataTable from '../components/DataTable.vue';
import { Modal } from 'bootstrap';

export default {
  name: 'TacGia',
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
      authors: [],
      filteredAuthors: [],
      searchQuery: '',
      selectedQuocTich: '',
      statusFilter: '',
      loading: false,
      saving: false,
      isEdit: false,
      editingId: null,
      selectedAuthor: null,
      authorModal: null,
      viewModal: null,
      imagePreview: null,
      
      // Form data
      form: {
        HoTen: '',
        ButDanh: '',
        NamSinh: null,
        NamMat: null,
        QuocTich: '',
        MaTinh: '',
        MaQuan: '',
        MaPhuong: '',
        DiaChiChiTiet: '',
        TieuSu: '',
        HinhAnh: null
      },
      
      // Pagination
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    };
  },
  
  computed: {
    columns() {
      return [
        { key: 'HinhAnh', label: 'Ảnh', width: '10%' },
        { key: 'HoTen', label: 'Họ tên', width: '25%' },
        { key: 'NamSinh', label: 'Năm sinh', width: '10%' },
        { key: 'QuocTich', label: 'Quốc tịch', width: '15%' },
        { key: 'TrangThai', label: 'Trạng thái', width: '15%' },
        { key: 'createdAt', label: 'Ngày tạo', width: '15%' },
        { key: 'actions', label: 'Thao tác', width: '10%' }
      ];
    },

    vietnameseAuthors() {
      return this.authors.filter(author => author.QuocTich === 'Việt Nam').length;
    },
    
    foreignAuthors() {
      return this.authors.filter(author => author.QuocTich !== 'Việt Nam' && author.QuocTich).length;
    },
    
    aliveAuthors() {
      return this.authors.filter(author => !author.NamMat).length;
    }
  },
  
  mounted() {
    this.authorModal = new Modal(document.getElementById('authorModal'));
    this.viewModal = new Modal(document.getElementById('viewModal'));
    this.loadAuthors();
  },
  
  methods: {
    async loadAuthors() {
      this.loading = true;
      try {
        const query = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.searchQuery,
          QuocTich: this.selectedQuocTich
        };
        
        const response = await TacGiaService.getAll(query);
        
        if (response.data) {
          this.authors = response.data.map(author => ({
            ...author,
            TrangThai: author.NamMat ? 'Đã qua đời' : 'Còn sống',
            HinhAnh: author.HinhAnh ? `${author.HinhAnh}` : null
          }));
          this.pagination = response.pagination;
        }
        
        this.filterAuthors();
      } catch (error) {
        console.error('Error loading authors:', error);
        this.toast.error('Lỗi khi tải danh sách tác giả');
      } finally {
        this.loading = false;
      }
    },
    
    filterAuthors() {
      let filtered = [...this.authors];
      
      // Filter by status (alive/dead)
      if (this.statusFilter) {
        filtered = filtered.filter(author => {
          if (this.statusFilter === 'alive') return !author.NamMat;
          if (this.statusFilter === 'dead') return author.NamMat;
          return true;
        });
      }
      
      this.filteredAuthors = filtered;
    },
    
    handleSearch() {
      this.pagination.page = 1;
      this.loadAuthors();
    },

    resetSearch() {
      this.searchQuery = '';
      this.selectedQuocTich = '';
      this.statusFilter = '';
      this.loadAuthors();
    },
    
    handleFilterChange() {
      this.pagination.page = 1;
      this.loadAuthors();
    },
    
    handlePageChange(page) {
      this.pagination.page = page;
      this.loadAuthors();
    },
    
    showAddModal() {
      this.resetForm();
      this.isEdit = false;
      this.editingId = null;
      this.authorModal.show();
    },
    
    showEditModal(author) {
      this.form = {
        HoTen: author.HoTen,
        ButDanh: author.ButDanh || '',
        NamSinh: author.NamSinh,
        NamMat: author.NamMat,
        QuocTich: author.QuocTich || '',
        MaTinh: author.MaTinh || '',
        MaQuan: author.MaQuan || '',
        MaPhuong: author.MaPhuong || '',
        DiaChiChiTiet: author.DiaChiChiTiet || '',
        TieuSu: author.TieuSu || '',
        HinhAnh: author.HinhAnh
      };
      this.isEdit = true;
      this.editingId = author._id;
      this.imagePreview = null;
      this.authorModal.show();
    },
    
    showViewModal(author) {
      this.selectedAuthor = author;
      this.viewModal.show();
    },
    
    async confirmDelete(author) {
      if (confirm(`Bạn có chắc muốn xóa tác giả "${author.HoTen}"?`)) {
        try {
          await TacGiaService.delete(author._id);
          this.toast.success('Xóa tác giả thành công!');
          this.loadAuthors();
        } catch (error) {
          console.error('Error deleting author:', error);
          this.toast.error('Lỗi khi xóa tác giả');
        }
      }
    },
    
    async saveAuthor() {
      try {
        this.saving = true;
        
        const formData = new FormData();
        formData.append('HoTen', this.form.HoTen);
        formData.append('ButDanh', this.form.ButDanh);
        formData.append('QuocTich', this.form.QuocTich);
        formData.append('TieuSu', this.form.TieuSu);
        
        if (this.form.NamSinh) {
          formData.append('NamSinh', this.form.NamSinh);
        }
        if (this.form.NamMat) {
          formData.append('NamMat', this.form.NamMat);
        }
        
        // Add image file if selected
        if (this.$refs.imageInput && this.$refs.imageInput.files[0]) {
          formData.append('HinhAnh', this.$refs.imageInput.files[0]);
        }
        
        if (this.isEdit) {
          await TacGiaService.update(this.editingId, formData);
          this.toast.success('Cập nhật tác giả thành công!');
        } else {
          await TacGiaService.create(formData);
          this.toast.success('Thêm tác giả thành công!');
        }
        
        this.authorModal.hide();
        this.resetForm();
        this.loadAuthors();
        
      } catch (error) {
        console.error('Error saving author:', error);
        this.toast.error(error.response?.data?.message || 'Lỗi khi lưu tác giả');
      } finally {
        this.saving = false;
      }
    },
    
    resetForm() {
      this.form = {
        HoTen: '',
        ButDanh: '',
        NamSinh: null,
        NamMat: null,
        QuocTich: '',
        MaTinh: '',
        MaQuan: '',
        MaPhuong: '',
        DiaChiChiTiet: '',
        TieuSu: '',
        HinhAnh: null
      };
      this.imagePreview = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },
    
    triggerFileUpload() {
      this.$refs.imageInput.click();
    },
    
    handleImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.match('image.*')) {
        this.toast.warning('Vui lòng chọn file hình ảnh!');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.toast.warning('File ảnh không được vượt quá 5MB!');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    removeImage() {
      this.imagePreview = null;
      this.form.HinhAnh = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.tacgia-page {
  padding: 1.5rem;
}

/* Statistics Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

/* Author Avatar in Table */
.author-avatar-small {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  border: 2px solid #e9ecef;
}

/* Author Image Upload */
.author-image-upload {
  text-align: center;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
}

.preview-img {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  width: 150px;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  margin: 0 auto 10px;
  transition: all 0.3s;
}

.image-placeholder:hover {
  border-color: #007bff;
  color: #007bff;
  background-color: #f8f9fa;
}

.image-placeholder i {
  font-size: 2rem;
  margin-bottom: 10px;
}

/* Detail View */
.author-details-view {
  padding: 1rem 0;
}

.detail-avatar {
  margin-bottom: 1.5rem;
}

.detail-img {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-no-image {
  width: 150px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 0 auto;
}

.detail-no-image i {
  font-size: 4rem;
  color: #adb5bd;
}

.detail-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f3f5;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.detail-item span,
.detail-item p {
  color: #6c757d;
  margin: 0;
}

.text-justify {
  text-align: justify;
  line-height: 1.6;
}

/* Modal Headers */
.modal-header.bg-primary,
.modal-header.bg-info {
  border-top-left-radius: calc(0.5rem - 1px);
  border-top-right-radius: calc(0.5rem - 1px);
}

/* Card */
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
}

.card-body {
  padding: 1.5rem;
}
</style>