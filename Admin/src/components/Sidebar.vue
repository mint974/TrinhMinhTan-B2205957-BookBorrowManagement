<template>
    <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
        <!-- Toggle Button -->
        <button class="sidebar-toggle" @click="toggleSidebar">
            <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>

        <div class="sidebar-header">
            <div class="logo-container">
                <img src="/images/logo.png" alt="Logo" class="sidebar-logo">
            </div>
            <span class="sidebar-title" v-show="!isCollapsed">Quản Lý Thư Viện</span>
        </div>

        <ul class="sidebar-nav">
            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin" class="nav-link" exact-active-class="active" :title="isCollapsed ? 'Dashboard' : ''">
                    <i class="fas fa-tachometer-alt me-2"></i>
                    <span v-show="!isCollapsed">Dashboard</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/employees" class="nav-link" active-class="active" :title="isCollapsed ? 'Nhân Viên' : ''">
                    <i class="fas fa-users-cog me-2"></i>
                    <span v-show="!isCollapsed">Nhân Viên</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/books" class="nav-link" active-class="active" :title="isCollapsed ? 'Quản Lý Sách' : ''">
                    <i class="fas fa-book me-2"></i>
                    <span v-show="!isCollapsed">Quản Lý Sách</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/readers" class="nav-link" active-class="active" :title="isCollapsed ? 'Độc Giả' : ''">
                    <i class="fas fa-users me-2"></i>
                    <span v-show="!isCollapsed">Độc Giả</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/publishers" class="nav-link" active-class="active" :title="isCollapsed ? 'Nhà Xuất Bản' : ''">
                    <i class="fas fa-building me-2"></i>
                    <span v-show="!isCollapsed">Nhà Xuất Bản</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/borrows" class="nav-link" active-class="active" :title="isCollapsed ? 'Phiếu Mượn' : ''">
                    <i class="fas fa-exchange-alt me-2"></i>
                    <span v-show="!isCollapsed">Phiếu Mượn</span>
                </router-link>
            </li>

            <li class="nav-divider"></li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/authors" class="nav-link" active-class="active" :title="isCollapsed ? 'Tác Giả' : ''">
                    <i class="fas fa-user-edit me-2"></i>
                    <span v-show="!isCollapsed">Tác Giả</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/categories" class="nav-link" active-class="active" :title="isCollapsed ? 'Danh Mục' : ''">
                    <i class="fas fa-tags me-2"></i>
                    <span v-show="!isCollapsed">Danh Mục</span>
                </router-link>
            </li>

            <li class="nav-divider"></li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/settings" class="nav-link" active-class="active" :title="isCollapsed ? 'Cài Đặt' : ''">
                    <i class="fas fa-cog me-2"></i>
                    <span v-show="!isCollapsed">Cài Đặt</span>
                </router-link>
            </li>
        </ul>

        <div class="sidebar-footer">
            <button @click="handleLogout" class="btn btn-outline-light btn-sm w-100" :title="isCollapsed ? 'Đăng Xuất' : ''">
                <i class="fas fa-sign-out-alt me-2"></i>
                <span v-show="!isCollapsed">Đăng Xuất</span>
            </button>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
    name: "Sidebar",

    setup() {
        const toast = useToast();
        return { toast };
    },

    data() {
        return {
            isCollapsed: localStorage.getItem('sidebarCollapsed') === 'true' || false
        };
    },

    methods: {
        toggleSidebar() {
            this.isCollapsed = !this.isCollapsed;
            localStorage.setItem('sidebarCollapsed', this.isCollapsed);
            // Emit event để App.vue cập nhật margin
            this.$emit('toggle', this.isCollapsed);
        },

        handleLogout() {
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                this.toast.info("Đã đăng xuất thành công");
                this.$router.push("/bookborrow/manager/login");
            }
        }
    }
};
</script>

<style scoped>
.sidebar {
    width: 260px;
    min-height: 100vh;
    background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: width 0.3s ease;
}

.sidebar.collapsed {
    width: 70px;
}

.sidebar-toggle {
    position: absolute;
    right: -15px;
    top: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid white;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1001;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.sidebar-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.sidebar-toggle i {
    font-size: 0.75rem;
}

.sidebar-header {
    padding: 1.5rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
}

.sidebar.collapsed .sidebar-header {
    padding: 1rem 0.5rem;
}

.logo-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
    transition: padding 0.3s ease;
}

.sidebar.collapsed .logo-container {
    padding: 0;
}

.sidebar-logo {
    height: 60px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    /* filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)); */
    transition: all 0.3s ease;
}

.sidebar.collapsed .sidebar-logo {
    height: 40px;
}

.sidebar-logo:hover {
    transform: scale(1.05);
}

.sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    transition: opacity 0.3s ease;
}

.sidebar-nav {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;
}

.nav-item {
    margin: 0.25rem 0.75rem;
}

.nav-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    font-size: 0.95rem;
}

.sidebar.collapsed .nav-link {
    justify-content: center;
    padding: 0.75rem 0.5rem;
}

.sidebar.collapsed .nav-link i {
    margin-right: 0 !important;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
}

.nav-link.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.nav-link i {
    width: 20px;
    text-align: center;
}

.nav-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 1rem 1.5rem;
}

.sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer .btn {
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
}

.sidebar-footer .btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
}

@media (max-width: 991.98px) {
    .sidebar {
        width: 70px;
    }

    .sidebar-logo {
        height: 40px;
    }

    .sidebar-title,
    .nav-link span {
        display: none;
    }

    .sidebar-header {
        justify-content: center;
        padding: 1rem 0.5rem;
    }

    .logo-container {
        padding: 0;
    }

    .nav-link {
        justify-content: center;
    }

    .sidebar-footer .btn {
        font-size: 0;
    }

    .sidebar-footer .btn i {
        font-size: 1rem;
        margin: 0 !important;
    }
}
</style>
