<template>
  <div class="profile-layout d-flex">
    <SidebarMenu />

    <div class="main-content flex-grow-1 p-4">
      <div class="container-fluid">
        <div class="row">
          <!-- Sidebar Profile -->
          <div class="col-md-4">
            <div class="card profile-card shadow-sm">
              <div class="card-body text-center">
                <div class="avatar-wrapper mb-3">
                  <img v-if="profile.Avatar" :src="getAvatarUrl(profile.Avatar)"
                    class="profile-avatar" alt="Avatar" />
                  <div v-else class="profile-avatar-placeholder">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <label class="avatar-upload-btn" title="Đổi ảnh đại diện">
                    <i class="fas fa-camera"></i>
                    <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*"
                      style="display: none" />
                  </label>
                </div>
                <h4 class="mb-1">{{ profile.HoLot }} {{ profile.Ten }}</h4>
                <span class="badge bg-primary bg-opacity-75">
                  {{ profile.MaDocGia }}
                </span>
                <p class="text-muted mt-2 mb-0">
                  <i class="fas fa-envelope me-1"></i>
                  {{ profile.Email }}
                </p>
                <p class="text-muted">
                  <i class="fas fa-phone me-1"></i>
                  {{ profile.DienThoai }}
                </p>

                <!-- Ban Warning -->
                <div v-if="isBanned" class="alert alert-danger mt-3">
                  <i class="fas fa-ban me-2"></i>
                  <strong>Tài khoản bị cấm</strong>
                  <p class="mb-0 small mt-1">Đến {{ formatDate(profile.NgayBiCam) }}</p>
                </div>

                <hr />
                <div class="profile-stats">
                  <div class="stat-item">
                    <i class="fas fa-calendar-alt text-primary"></i>
                    <div>
                      <small class="text-muted">Ngày tham gia</small>
                      <p class="mb-0">{{ formatDate(profile.createdAt) }}</p>
                    </div>
                  </div>
                  <div class="stat-item mt-2">
                    <i class="fas fa-birthday-cake text-success"></i>
                    <div>
                      <small class="text-muted">Ngày sinh</small>
                      <p class="mb-0">{{ formatDate(profile.NgaySinh) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-md-8">
            <!-- Profile Info -->
            <div class="card mb-4 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="mb-0">
                  <i class="fas fa-user me-2 text-primary"></i>
                  Thông Tin Cá Nhân
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="updateProfile">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-user me-1 text-primary"></i>
                        Họ Lót <span class="text-danger">*</span>
                      </label>
                      <input type="text" class="form-control" v-model="profileForm.HoLot" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-user me-1 text-primary"></i>
                        Tên <span class="text-danger">*</span>
                      </label>
                      <input type="text" class="form-control" v-model="profileForm.Ten" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-envelope me-1 text-info"></i>
                        Email
                      </label>
                      <input type="email" class="form-control" :value="profile.Email" disabled />
                      <small class="text-muted">Email không thể thay đổi</small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-phone me-1 text-success"></i>
                        Số Điện Thoại <span class="text-danger">*</span>
                      </label>
                      <input type="tel" class="form-control" v-model="profileForm.DienThoai" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-birthday-cake me-1 text-warning"></i>
                        Ngày Sinh <span class="text-danger">*</span>
                      </label>
                      <input type="date" class="form-control" v-model="profileForm.NgaySinh" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-venus-mars me-1 text-danger"></i>
                        Giới Tính <span class="text-danger">*</span>
                      </label>
                      <select class="form-select" v-model="profileForm.GioiTinh" required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-map-marker-alt me-1 text-danger"></i>
                        Địa Chỉ Chi Tiết
                      </label>
                      <input type="text" class="form-control" v-model="profileForm.DiaChiChiTiet"
                        placeholder="Số nhà, tên đường..." />
                    </div>
                  </div>
                  <div class="mt-4">
                    <button type="submit" class="btn btn-primary" :disabled="updating">
                      <i class="fas fa-save me-2"></i>
                      <span v-if="updating">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Đang cập nhật...
                      </span>
                      <span v-else>Cập Nhật Thông Tin</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Change Password -->
            <div class="card shadow-sm">
              <div class="card-header bg-white">
                <h5 class="mb-0">
                  <i class="fas fa-lock me-2 text-warning"></i>
                  Đổi Mật Khẩu
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="changePassword">
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-key me-1 text-secondary"></i>
                        Mật Khẩu Cũ <span class="text-danger">*</span>
                      </label>
                      <div class="input-group">
                        <input :type="showOldPassword ? 'text' : 'password'" class="form-control"
                          v-model="passwordForm.oldPassword" required />
                        <button class="btn btn-outline-secondary" type="button"
                          @click="showOldPassword = !showOldPassword">
                          <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-key me-1 text-primary"></i>
                        Mật Khẩu Mới <span class="text-danger">*</span>
                      </label>
                      <div class="input-group">
                        <input :type="showNewPassword ? 'text' : 'password'" class="form-control"
                          v-model="passwordForm.newPassword" required minlength="6" />
                        <button class="btn btn-outline-secondary" type="button"
                          @click="showNewPassword = !showNewPassword">
                          <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                      </div>
                      <small class="text-muted">Tối thiểu 6 ký tự</small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">
                        <i class="fas fa-key me-1 text-success"></i>
                        Xác Nhận Mật Khẩu <span class="text-danger">*</span>
                      </label>
                      <div class="input-group">
                        <input :type="showConfirmPassword ? 'text' : 'password'"
                          class="form-control" v-model="passwordForm.confirmPassword" required />
                        <button class="btn btn-outline-secondary" type="button"
                          @click="showConfirmPassword = !showConfirmPassword">
                          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <button type="submit" class="btn btn-warning" :disabled="changingPassword">
                      <i class="fas fa-key me-2"></i>
                      <span v-if="changingPassword">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Đang đổi mật khẩu...
                      </span>
                      <span v-else>Đổi Mật Khẩu</span>
                    </button>
                  </div>
                </form>
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
import SidebarMenu from '@/components/SidebarMenu.vue';
import DocGiaService from '@/services/docgia.service';

export default {
  name: 'Profile',

  components: {
    SidebarMenu,
  },

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      profile: {
        HoLot: '',
        Ten: '',
        Email: '',
        MaDocGia: '',
        Avatar: '',
        DienThoai: '',
        NgaySinh: '',
        GioiTinh: '',
        DiaChiChiTiet: '',
        NgayBiCam: null,
        createdAt: '',
      },
      profileForm: {
        HoLot: '',
        Ten: '',
        DienThoai: '',
        NgaySinh: '',
        GioiTinh: '',
        DiaChiChiTiet: '',
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      updating: false,
      changingPassword: false,
    };
  },

  computed: {
    isBanned() {
      if (!this.profile.NgayBiCam) return false;
      return new Date(this.profile.NgayBiCam) > new Date();
    }
  },

  mounted() {
    this.loadProfile();
  },

  methods: {
    getAvatarUrl(avatar) {
      if (!avatar) return '';
      // Remove leading slash if exists
      const cleanPath = avatar.startsWith('/') ? avatar.substring(1) : avatar;
      return `http://localhost:5000/${cleanPath}`;
    },

    async loadProfile() {
      try {
        const response = await DocGiaService.getProfile();
        this.profile = response.data;
        this.profileForm = {
          HoLot: this.profile.HoLot,
          Ten: this.profile.Ten,
          DienThoai: this.profile.DienThoai,
          NgaySinh: this.profile.NgaySinh ? this.profile.NgaySinh.split('T')[0] : '',
          GioiTinh: this.profile.GioiTinh,
          DiaChiChiTiet: this.profile.DiaChiChiTiet || '',
        };
      } catch (error) {
        console.error('Error loading profile:', error);
        this.toast.error('Lỗi khi tải thông tin cá nhân');
      }
    },

    async updateProfile() {
      try {
        this.updating = true;
        await DocGiaService.updateProfile(this.profileForm);

        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.HoLot = this.profileForm.HoLot;
        user.Ten = this.profileForm.Ten;
        localStorage.setItem('user', JSON.stringify(user));

        this.toast.success('Cập nhật thông tin thành công!');
        await this.loadProfile();
      } catch (error) {
        console.error('Error updating profile:', error);
        this.toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
      } finally {
        this.updating = false;
      }
    },

    async handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toast.error('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('Avatar', file);

        const response = await DocGiaService.uploadAvatar(formData);
        
        // Update localStorage with new avatar
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.Avatar = response.data.Avatar;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Emit event to update sidebar
        window.dispatchEvent(new Event('user-updated'));
        
        this.toast.success('Cập nhật ảnh đại diện thành công!');
        await this.loadProfile();
      } catch (error) {
        console.error('Error uploading avatar:', error);
        this.toast.error(error.response?.data?.message || 'Lỗi khi tải ảnh đại diện');
      }
    },

    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.toast.error('Mật khẩu xác nhận không khớp');
        return;
      }

      if (this.passwordForm.newPassword.length < 6) {
        this.toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }

      try {
        this.changingPassword = true;
        await DocGiaService.updatePassword({
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
        });

        this.toast.success('Đổi mật khẩu thành công!');
        this.passwordForm = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
      } catch (error) {
        console.error('Error changing password:', error);
        this.toast.error(error.response?.data?.message || 'Lỗi khi đổi mật khẩu');
      } finally {
        this.changingPassword = false;
      }
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('vi-VN');
    },
  },
};
</script>

<style scoped>
.profile-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  overflow-y: auto;
}

/* Profile Card */
.profile-card {
  border: none;
  border-radius: 12px;
  position: sticky;
  top: 20px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.profile-avatar,
.profile-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
}

.profile-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 3rem;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid white;
  transition: transform 0.2s;
}

.avatar-upload-btn:hover {
  transform: scale(1.1);
}

.profile-stats {
  text-align: left;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item i {
  font-size: 1.5rem;
}

.stat-item p {
  font-weight: 600;
  color: #2c3e50;
}

/* Card Styling */
.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

/* Form Styling */
.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 0.625rem 0.875rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Button Styling */
.btn {
  border-radius: 8px;
  padding: 0.625rem 1.5rem;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #63408a 100%);
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: white;
}

.btn-warning:hover {
  background: linear-gradient(135deg, #e082ea 0%, #e4465b 100%);
  color: white;
}

/* Input Group */
.input-group .btn-outline-secondary {
  border-color: #dee2e6;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* Alert */
.alert {
  border-radius: 8px;
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-avatar,
  .profile-avatar-placeholder {
    width: 100px;
    height: 100px;
  }

  .avatar-upload-btn {
    width: 35px;
    height: 35px;
  }
}
</style>
