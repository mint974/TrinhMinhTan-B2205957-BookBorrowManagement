<template>
    <div class="login-wrapper d-flex">
        <!-- Left side (background) -->
        <div class="left-panel d-none d-md-flex align-items-end p-5">
            <div class="text-white login-left-text">
                <h2 class="fw-bold">Hệ thống thư viện trực tuyến!</h2>
                <p class="mt-3">
                    Quản lý và theo dõi sách dễ dàng với giao diện thân thiện và các tính năng mạnh mẽ.
                </p>
            </div>
        </div>

        <!-- Right side (login card) -->
        <div class="right-panel d-flex justify-content-center align-items-center p-4">
            <div class="login-card p-4 shadow">
                <div class="logo-container mb-4">
                    <img src="/images/logo.png" alt="Logo" class="login-logo">
                </div>
                <h3 class="fw-bold mb-1 text-primary text-center">Chào mừng quay lại!</h3>

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
                        <!-- <label class="form-label fw-semibold">Email</label> -->
                        <input type="email" v-model="user.email" class="form-control form-control-lg rounded-pill"
                            placeholder="Nhập email của bạn" required />
                    </div>

                    <!-- Password -->
                    <div class="mb-2 position-relative">
                        <!-- <label class="form-label fw-semibold">Mật khẩu</label> -->
                        <input :type="showPass ? 'text' : 'password'" v-model="user.password"
                            class="form-control form-control-lg rounded-pill pe-5" placeholder="Nhập mật khẩu của bạn"
                            required />

                        <i class="fa-solid" :class="showPass ? 'fa-eye-slash' : 'fa-eye'" @click="showPass = !showPass"
                            style="cursor: pointer; position: absolute; right: 15px; top: 55%; transform: translateY(-50%);">
                        </i>
                    </div>

                    <!-- Remember + Forgot Password -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="rememberMe" />
                            <label for="rememberMe" class="form-check-label">Ghi nhớ đăng nhập</label>
                        </div>

                        <a href="#" class="small text-decoration-none text-muted hover-link">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <!-- Login button -->
                    <button class="btn btn-primary btn-lg w-100 rounded-pill mb-3">
                        Đăng nhập
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
                        <a href="#" class="fw-semibold text-decoration-none hover-link">Đăng ký tại đây</a>
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
            error: "",
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const res = await AuthService.login({
                    Email: this.user.email,
                    Password: this.user.password
                });

                if (res && res.token) {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("user", JSON.stringify(res.nhanvien));

                    this.toast.success('Đăng nhập thành công!');
                    this.$router.push("/bookborrow/manager/admin");
                } else {
                    this.error = "Đăng nhập thất bại. Vui lòng thử lại.";
                    this.toast.error(this.error);
                }
            } catch (err) {
                this.error = err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
                this.toast.error(this.error);
                console.error("Login error:", err);
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

.login-logo {
    max-width: 140px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    transition: transform 0.3s ease;
}

.login-logo:hover {
    transform: scale(1.05);
}

.hover-link:hover {
    color: #000 !important;
}
</style>
