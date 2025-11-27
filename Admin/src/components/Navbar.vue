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

                    <button class="btn btn-icon" @click="handleLogout" title="Đăng xuất">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navbar",

    data() {
        return {
            userName: "Admin",
        };
    },

    mounted() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.TenNV) {
            this.userName = user.TenNV;
        }
    },

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
</style>
