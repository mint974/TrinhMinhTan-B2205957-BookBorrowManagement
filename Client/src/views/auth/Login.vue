<template>
    <div class="login-wrapper d-flex">
        <!-- Left side (background) -->
        <div class="left-panel d-none d-md-flex align-items-end p-5">
            <div class="text-white login-left-text">
                <h2 class="fw-bold">Thư viện trực tuyến cho độc giả!</h2>
                <p class="mt-3">
                    Khám phá hàng ngàn đầu sách, quản lý lịch sử mượn sách và tận hưởng trải nghiệm đọc tuyệt vời.
                </p>
            </div>
        </div>

        <!-- Right side (login card) -->
        <div class="right-panel d-flex justify-content-center align-items-center p-4">
            <div class="login-card p-4 shadow">
                <div class="logo-container mb-4">
                    <div class="logo-icon">
                        <i class="fas fa-book-reader"></i>
                    </div>
                </div>
                <h3 class="fw-bold mb-1 text-primary text-center">Chào mừng độc giả!</h3>

                <!-- Error Alert -->
                <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    {{ error }}
                    <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
                </div>

                <!-- FORM -->
                <form @submit.prevent="handleSubmit">
                    <!-- Email -->
                    <div class="mb-3 mt-3">
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            v-model="user.email" 
                            class="form-control form-control-lg rounded-pill"
                            placeholder="Nhập email của bạn" 
                            required 
                            autocomplete="email" 
                        />
                    </div>

                    <!-- Password -->
                    <div class="mb-2 position-relative">
                        <input 
                            :type="showPass ? 'text' : 'password'" 
                            id="password" 
                            name="password" 
                            v-model="user.password"
                            class="form-control form-control-lg rounded-pill pe-5" 
                            placeholder="Nhập mật khẩu của bạn"
                            required 
                            autocomplete="current-password" 
                        />

                        <i 
                            class="fa-solid" 
                            :class="showPass ? 'fa-eye-slash' : 'fa-eye'" 
                            @click="showPass = !showPass"
                            style="cursor: pointer; position: absolute; right: 15px; top: 55%; transform: translateY(-50%);">
                        </i>
                    </div>

                    <!-- Remember + Forgot Password -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe" />
                            <label for="rememberMe" class="form-check-label">Ghi nhớ đăng nhập</label>
                        </div>

                        <a href="#" class="small text-decoration-none text-muted hover-link">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <!-- Login button -->
                    <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill mb-3" :disabled="loading">
                        <span v-if="loading">
                            <i class="fas fa-spinner fa-spin me-2"></i>
                            Đang đăng nhập...
                        </span>
                        <span v-else>Đăng nhập</span>
                    </button>

                    <!-- OR -->
                    <div class="text-center mb-3 text-muted">Hoặc tiếp tục với</div>

                    <!-- Google Login -->
                    <button type="button" class="btn btn-outline-secondary w-100 rounded-pill mb-2">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="22" class="me-2" />
                        Tiếp tục với Google
                    </button>

                    <div class="text-center mt-3 small">
                        Bạn chưa có tài khoản?
                        <router-link to="/register" class="fw-semibold text-decoration-none hover-link">
                            Đăng ký tại đây
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

export default {
    name: "Login",

    setup() {
        const toast = useToast();
        return { toast };
    },

    data() {
        return {
            user: {
                email: "",
                password: "",
            },
            showPass: false,
            rememberMe: false,
            loading: false,
            error: "",
        };
    },

    methods: {
        async handleSubmit() {
            this.loading = true;
            this.error = "";

            try {
                const res = await AuthService.login({
                    Email: this.user.email,
                    Password: this.user.password
                });

                if (res && res.token) {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("user", JSON.stringify(res.docgia));

                    this.toast.success('Đăng nhập thành công!');
                    
                    // Redirect to home or previous page
                    const redirect = this.$route.query.redirect || '/';
                    this.$router.push(redirect);
                } else {
                    this.error = "Đăng nhập thất bại. Vui lòng thử lại.";
                    this.toast.error(this.error);
                }
            } catch (err) {
                this.error = err.response?.data?.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
                this.toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* Wrapper */
.login-wrapper {
    height: 100vh;
    overflow: hidden;
}

/* Left side panel */
.left-panel {
    flex: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
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
.login-left-text {
    max-width: 420px;
    position: relative;
    z-index: 1;
}

/* Right side panel */
.right-panel {
    flex: 1;
    background: #f8f9fa;
}

/* Login Card */
.login-card {
    width: 100%;
    max-width: 420px;
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
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: transform 0.3s ease;
}

.logo-icon i {
    font-size: 40px;
    color: white;
}

.logo-icon:hover {
    transform: scale(1.1) rotate(5deg);
}

.hover-link:hover {
    color: #000 !important;
}

/* Form controls */
.form-control:focus {
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
    .login-wrapper {
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
