<template>
    <nav class="navbar">
        <div class="container-fluid">
            <div class="navbar-left">
                <span class="navbar-greeting">
                    <i class="fas fa-sun me-2 text-warning"></i>
                    Xin chào, <strong>{{ userName }}</strong>
                </span>
            </div>

            <div class="navbar-right">
                <div class="navbar-actions">
                    <button class="btn btn-icon" title="Thông báo">
                        <i class="fas fa-bell"></i>
                        <span class="badge">3</span>
                    </button>

                    <div class="dropdown">
                        <button class="btn-avatar" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                            title="Tài khoản">
                            <img v-if="userAvatar" :src="`http://localhost:5000${userAvatar}`" alt="Avatar"
                                class="avatar-img" />
                            <i v-else class="fas fa-user-circle fa-2x"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li class="dropdown-header">
                                <div class="user-info">
                                    <img v-if="userAvatar" :src="`http://localhost:5000${userAvatar}`" alt="Avatar"
                                        class="dropdown-avatar" />
                                    <i v-else class="fas fa-user-circle fa-3x text-muted"></i>
                                    <div class="ms-2">
                                        <strong>{{ userName }}</strong>
                                        <p class="text-muted mb-0 small">{{ userRole }}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <router-link to="/bookborrow/manager/admin/profile" class="dropdown-item">
                                    <i class="fas fa-user me-2"></i>
                                    Thông tin cá nhân
                                </router-link>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                                    <i class="fas fa-sign-out-alt me-2"></i>
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import NhanVienService from '@/services/nhanvien.service';

export default {
    name: "Navbar",

    data() {
        return {
            userName: "Admin",
            userRole: "Admin",
            userAvatar: "",
        };
    },

    mounted() {
        this.loadUserInfo();
    },

    methods: {
        async loadUserInfo() {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.TenNV) {
                this.userName = user.TenNV;
            }
            if (user.ChucVu) {
                this.userRole = user.ChucVu;
            }

            try {
                const profile = await NhanVienService.getProfile();
                if (profile.Avatar) {
                    this.userAvatar = profile.Avatar;
                }
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        },

        handleLogout() {
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                this.$router.push("/bookborrow/manager/login");
            }
        }
    }
};
</script>

<style scoped>
.navbar {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 0.75rem 1.5rem;
    position: sticky;
    top: 0;
    z-index: 999;
}

.container-fluid {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.navbar-greeting {
    font-size: 1rem;
    color: #495057;
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.navbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-icon {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #f8f9fa;
    color: #495057;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.btn-icon:hover {
    background: #e9ecef;
    color: #667eea;
}

.btn-icon .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #dc3545;
    color: white;
    font-size: 0.65rem;
    padding: 2px 5px;
    border-radius: 10px;
}

.btn-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #e9ecef;
    background: #f8f9fa;
    color: #495057;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
}

.btn-avatar:hover {
    border-color: #667eea;
    transform: scale(1.05);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.dropdown-header {
    padding: 0.75rem 1rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.dropdown-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e9ecef;
}
</style>
