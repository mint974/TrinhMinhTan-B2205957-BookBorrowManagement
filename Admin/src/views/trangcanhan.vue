<template>
    <div class="profile-page">
        <div class="container-fluid">
            <div class="row">
                <!-- Sidebar Profile -->
                <div class="col-md-4">
                    <div class="card profile-card">
                        <div class="card-body text-center">
                            <div class="avatar-wrapper mb-3">
                                <img v-if="profile.Avatar" :src="`http://localhost:5000${profile.Avatar}`"
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
                            <h4 class="mb-1">{{ profile.HoTen }}</h4>
                            <span class="badge" :class="profile.ChucVu === 'Admin' ? 'bg-success' : 'bg-info'">
                                {{ profile.ChucVu }}
                            </span>
                            <p class="text-muted mt-2 mb-0">
                                <i class="fas fa-id-badge me-1"></i>
                                {{ profile.MSNV }}
                            </p>
                            <p class="text-muted">
                                <i class="fas fa-envelope me-1"></i>
                                {{ profile.Email }}
                            </p>
                            <hr />
                            <div class="profile-stats">
                                <div class="stat-item">
                                    <i class="fas fa-calendar-alt text-primary"></i>
                                    <div>
                                        <small class="text-muted">Ngày tham gia</small>
                                        <p class="mb-0">{{ formatDate(profile.createdAt) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="col-md-8">
                    <!-- Profile Info -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-user me-2"></i>
                                Thông Tin Cá Nhân
                            </h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="updateProfile">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Họ Tên <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="profileForm.HoTen" required />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" :value="profile.Email" disabled />
                                        <small class="text-muted">Email không thể thay đổi</small>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Số Điện Thoại <span
                                                class="text-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="profileForm.SoDienThoai"
                                            required />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Giới Tính <span class="text-danger">*</span></label>
                                        <select class="form-select" v-model="profileForm.Phai" required>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <AddressSelect v-model:maTinh="profileForm.MaTinh"
                                            v-model:maQuan="profileForm.MaQuan" v-model:maPhuong="profileForm.MaPhuong"
                                            v-model:diaChiChiTiet="profileForm.DiaChiChiTiet" />
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save me-2"></i>
                                        Cập Nhật Thông Tin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Change Password -->
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-lock me-2"></i>
                                Đổi Mật Khẩu
                            </h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="changePassword">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label">Mật Khẩu Cũ <span class="text-danger">*</span></label>
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
                                        <label class="form-label">Mật Khẩu Mới <span
                                                class="text-danger">*</span></label>
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
                                        <label class="form-label">Xác Nhận Mật Khẩu <span
                                                class="text-danger">*</span></label>
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
                                    <button type="submit" class="btn btn-warning">
                                        <i class="fas fa-key me-2"></i>
                                        Đổi Mật Khẩu
                                    </button>
                                </div>
                            </form>
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

export default {
    name: 'Profile',

    components: {
        AddressSelect,
    },

    data() {
        return {
            profile: {
                HoTen: '',
                Email: '',
                MSNV: '',
                ChucVu: '',
                Avatar: '',
                SoDienThoai: '',
                Phai: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
                DiaChiChiTiet: '',
                createdAt: '',
            },
            profileForm: {
                HoTen: '',
                SoDienThoai: '',
                Phai: '',
                MaTinh: '',
                MaQuan: '',
                MaPhuong: '',
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
        };
    },

    mounted() {
        this.loadProfile();
    },

    methods: {
        async loadProfile() {
            try {
                this.profile = await NhanVienService.getProfile();
                this.profileForm = {
                    HoTen: this.profile.HoTen,
                    SoDienThoai: this.profile.SoDienThoai,
                    Phai: this.profile.Phai,
                    MaTinh: this.profile.MaTinh || '',
                    MaQuan: this.profile.MaQuan || '',
                    MaPhuong: this.profile.MaPhuong || '',
                    DiaChiChiTiet: this.profile.DiaChiChiTiet || '',
                };
            } catch (error) {
                console.error('Error loading profile:', error);
                alert('Lỗi khi tải thông tin profile');
            }
        },

        async updateProfile() {
            try {
                await NhanVienService.updateProfile(this.profileForm);

                const updatedUser = {
                    ...JSON.parse(localStorage.getItem('user')),
                    TenNV: this.profileForm.HoTen,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                alert('Cập nhật thông tin thành công!');
                await this.loadProfile();
            } catch (error) {
                console.error('Error updating profile:', error);
                alert(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
            }
        },

        async changePassword() {
            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            if (this.passwordForm.newPassword.length < 6) {
                alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
                return;
            }

            try {
                await NhanVienService.changePassword(
                    this.passwordForm.oldPassword,
                    this.passwordForm.newPassword
                );

                alert('Đổi mật khẩu thành công!');
                this.passwordForm = {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                };
            } catch (error) {
                console.error('Error changing password:', error);
                alert(error.response?.data?.message || 'Lỗi khi đổi mật khẩu');
            }
        },

        async handleAvatarChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.match('image.*')) {
                alert('Vui lòng chọn file ảnh!');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File ảnh không được vượt quá 5MB!');
                return;
            }

            try {
                await NhanVienService.updateAvatar(file);
                alert('Cập nhật avatar thành công!');
                await this.loadProfile();
            } catch (error) {
                console.error('Error updating avatar:', error);
                alert(error.response?.data?.message || 'Lỗi khi cập nhật avatar');
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN');
        },
    },
};
</script>

<style scoped>
.profile-page {
    padding: 1.5rem;
}

.profile-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-wrapper {
    position: relative;
    display: inline-block;
}

.profile-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-avatar-placeholder {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 4rem;
    border: 4px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-upload-btn {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.avatar-upload-btn:hover {
    background: #0056b3;
    transform: scale(1.1);
}

.profile-stats {
    text-align: left;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.stat-item i {
    font-size: 1.5rem;
}

.card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
}

.card-header h5 {
    color: white;
}
</style>
