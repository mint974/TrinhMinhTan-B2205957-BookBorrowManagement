<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <div class="logo-container">
                <img src="/images/logo.png" alt="Logo" class="sidebar-logo">
            </div>
            <span class="sidebar-title">Quản Lý Thư Viện</span>
        </div>

        <ul class="sidebar-nav">
            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin" class="nav-link" exact-active-class="active">
                    <i class="fas fa-tachometer-alt me-2"></i>
                    <span>Dashboard</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/employees" class="nav-link" active-class="active">
                    <i class="fas fa-users-cog me-2"></i>
                    <span>Nhân Viên</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/books" class="nav-link" active-class="active">
                    <i class="fas fa-book me-2"></i>
                    <span>Quản Lý Sách</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/readers" class="nav-link" active-class="active">
                    <i class="fas fa-users me-2"></i>
                    <span>Độc Giả</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/publishers" class="nav-link" active-class="active">
                    <i class="fas fa-building me-2"></i>
                    <span>Nhà Xuất Bản</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/borrows" class="nav-link" active-class="active">
                    <i class="fas fa-exchange-alt me-2"></i>
                    <span>Phiếu Mượn</span>
                </router-link>
            </li>

            <li class="nav-divider"></li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/authors" class="nav-link" active-class="active">
                    <i class="fas fa-user-edit me-2"></i>
                    <span>Tác Giả</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/categories" class="nav-link" active-class="active">
                    <i class="fas fa-tags me-2"></i>
                    <span>Danh Mục</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/media" class="nav-link" active-class="active">
                    <i class="fas fa-file-alt me-2"></i>
                    <span>Media</span>
                </router-link>
            </li>

            <li class="nav-divider"></li>

            <li class="nav-item">
                <router-link to="/bookborrow/manager/admin/settings" class="nav-link" active-class="active">
                    <i class="fas fa-cog me-2"></i>
                    <span>Cài Đặt</span>
                </router-link>
            </li>
        </ul>

        <div class="sidebar-footer">
            <button @click="handleLogout" class="btn btn-outline-light btn-sm w-100">
                <i class="fas fa-sign-out-alt me-2"></i>
                Đăng Xuất
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Sidebar",

    methods: {
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
}

.sidebar-header {
    padding: 1.5rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.logo-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
}

.sidebar-logo {
    height: 60px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    /* filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)); */
    transition: transform 0.3s ease;
}

.sidebar-logo:hover {
    transform: scale(1.05);
}

.sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
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
