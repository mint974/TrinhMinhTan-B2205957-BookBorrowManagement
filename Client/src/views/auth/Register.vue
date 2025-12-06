<template>
    <div class="register-wrapper d-flex">
        <!-- Left side (background) -->
        <div class="left-panel d-none d-md-flex align-items-end p-5">
            <div class="text-white register-left-text">
                <h2 class="fw-bold">Tham gia cộng đồng độc giả!</h2>
                <p class="mt-3">
                    Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng của thư viện trực tuyến.
                </p>
            </div>
        </div>

        <!-- Right side (register card) -->
        <div class="right-panel d-flex justify-content-center align-items-center p-4">
            <div class="register-card p-4 shadow">
                <div class="logo-container mb-3">
                    <div class="logo-icon">
                        <i class="fas fa-user-plus"></i>
                    </div>
                </div>
                <h3 class="fw-bold mb-1 text-primary text-center">Đăng ký tài khoản</h3>

                <!-- Error Alert -->
                <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    {{ error }}
                    <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
                </div>

                <!-- Success Alert -->
                <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    {{ success }}
                    <button type="button" class="btn-close" @click="success = ''" aria-label="Close"></button>
                </div>

                <!-- FORM -->
                <form @submit.prevent="handleSubmit">
                    <div class="row">
                        <!-- Họ lót -->
                        <div class="col-md-6 mb-3">
                            <input 
                                type="text" 
                                v-model="formData.HoLot" 
                                class="form-control rounded-pill"
                                placeholder="Họ lót" 
                                required 
                            />
                        </div>

                        <!-- Tên -->
                        <div class="col-md-6 mb-3">
                            <input 
                                type="text" 
                                v-model="formData.Ten" 
                                class="form-control rounded-pill"
                                placeholder="Tên" 
                                required 
                            />
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                        <input 
                            type="email" 
                            v-model="formData.Email" 
                            class="form-control rounded-pill"
                            placeholder="Email" 
                            required 
                        />
                    </div>

                    <div class="row">
                        <!-- Ngày sinh -->
                        <div class="col-md-6 mb-3">
                            <input 
                                type="date" 
                                v-model="formData.NgaySinh" 
                                class="form-control rounded-pill"
                                required 
                            />
                        </div>

                        <!-- Giới tính -->
                        <div class="col-md-6 mb-3">
                            <select v-model="formData.GioiTinh" class="form-select rounded-pill" required>
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                    </div>

                    <!-- Điện thoại -->
                    <div class="mb-3">
                        <input 
                            type="tel" 
                            v-model="formData.DienThoai" 
                            class="form-control rounded-pill"
                            placeholder="Số điện thoại" 
                            required 
                        />
                    </div>

                    <!-- Địa chỉ -->
                    <div class="mb-3">
                        <AddressSelect 
                            v-model:maTinh="formData.MaTinh" 
                            v-model:maQuan="formData.MaQuan"
                            v-model:maPhuong="formData.MaPhuong"
                            v-model:diaChiChiTiet="formData.DiaChiChiTiet" 
                        />
                    </div>

                    <!-- Password -->
                    <div class="mb-3 position-relative">
                        <input 
                            :type="showPass ? 'text' : 'password'" 
                            v-model="formData.Password"
                            class="form-control rounded-pill pe-5" 
                            placeholder="Mật khẩu"
                            required 
                            minlength="6"
                        />
                        <i 
                            class="fa-solid" 
                            :class="showPass ? 'fa-eye-slash' : 'fa-eye'" 
                            @click="showPass = !showPass"
                            style="cursor: pointer; position: absolute; right: 15px; top: 50%; transform: translateY(-50%);">
                        </i>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-3 position-relative">
                        <input 
                            :type="showConfirmPass ? 'text' : 'password'" 
                            v-model="confirmPassword"
                            class="form-control rounded-pill pe-5" 
                            placeholder="Xác nhận mật khẩu"
                            required 
                            minlength="6"
                        />
                        <i 
                            class="fa-solid" 
                            :class="showConfirmPass ? 'fa-eye-slash' : 'fa-eye'" 
                            @click="showConfirmPass = !showConfirmPass"
                            style="cursor: pointer; position: absolute; right: 15px; top: 50%; transform: translateY(-50%);">
                        </i>
                    </div>

                    <!-- Terms -->
                    <div class="form-check mb-3">
                        <input type="checkbox" class="form-check-input" id="terms" v-model="acceptTerms" required />
                        <label for="terms" class="form-check-label small">
                            Tôi đồng ý với <a href="#" class="text-decoration-none">Điều khoản sử dụng</a> 
                            và <a href="#" class="text-decoration-none">Chính sách bảo mật</a>
                        </label>
                    </div>

                    <!-- Register button -->
                    <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill mb-3" :disabled="loading">
                        <span v-if="loading">
                            <i class="fas fa-spinner fa-spin me-2"></i>
                            Đang đăng ký...
                        </span>
                        <span v-else>Đăng ký</span>
                    </button>

                    <div class="text-center mt-3 small">
                        Đã có tài khoản?
                        <router-link to="/login" class="fw-semibold text-decoration-none hover-link">
                            Đăng nhập ngay
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import AuthService from "@/services/auth.service";
import AddressSelect from '@/components/AddressSelect.vue';

export default {
    name: "Register",

    components: {
        AddressSelect
    },

    setup() {
        const toast = useToast();
        return { toast };
    },

    data() {
        return {
            formData: {
                HoLot: "",
                Ten: "",
                Email: "",
                NgaySinh: "",
                GioiTinh: "",
                DienThoai: "",
                MaTinh: "",
                MaQuan: "",
                MaPhuong: "",
                DiaChiChiTiet: "",
                Password: "",
            },
            confirmPassword: "",
            showPass: false,
            showConfirmPass: false,
            acceptTerms: false,
            loading: false,
            error: "",
            success: "",
        };
    },

    methods: {
        async handleSubmit() {
            // Validate passwords match
            if (this.formData.Password !== this.confirmPassword) {
                this.error = "Mật khẩu xác nhận không khớp!";
                this.toast.error(this.error);
                return;
            }

            // Validate password length
            if (this.formData.Password.length < 6) {
                this.error = "Mật khẩu phải có ít nhất 6 ký tự!";
                this.toast.error(this.error);
                return;
            }

            this.loading = true;
            this.error = "";
            this.success = "";

            try {
                const res = await AuthService.register(this.formData);

                if (res && res.success) {
                    this.success = "Đăng ký thành công! Đang chuyển đến trang đăng nhập...";
                    this.toast.success(this.success);
                    
                    // Reset form
                    this.resetForm();

                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 2000);
                }
            } catch (err) {
                this.error = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
                this.toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        resetForm() {
            this.formData = {
                HoLot: "",
                Ten: "",
                Email: "",
                NgaySinh: "",
                GioiTinh: "",
                DienThoai: "",
                MaTinh: "",
                MaQuan: "",
                MaPhuong: "",
                DiaChiChiTiet: "",
                Password: "",
            };
            this.confirmPassword = "";
            this.acceptTerms = false;
        },
    },
};
</script>

<style scoped>
/* Wrapper */
.register-wrapper {
    min-height: 100vh;
    overflow-y: auto;
}

/* Left side panel */
.left-panel {
    flex: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    min-height: 100vh;
}

.left-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/login-bg.jpg') center/cover no-repeat;
    opacity: 0.3;
}

/* Text inside left panel */
.register-left-text {
    max-width: 420px;
    position: relative;
    z-index: 1;
}

/* Right side panel */
.right-panel {
    flex: 1;
    background: #f8f9fa;
    min-height: 100vh;
    padding: 2rem 0;
}

/* Register Card */
.register-card {
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 18px;
}

/* Logo Container */
.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: transform 0.3s ease;
}

.logo-icon i {
    font-size: 35px;
    color: white;
}

.logo-icon:hover {
    transform: scale(1.1) rotate(5deg);
}

.hover-link:hover {
    color: #000 !important;
}

/* Form controls */
.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    border-color: #667eea;
}

/* Button hover effect */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
    .register-wrapper {
        flex-direction: column;
    }

    .left-panel {
        display: none !important;
    }

    .right-panel {
        flex: 1;
    }
}
</style>
