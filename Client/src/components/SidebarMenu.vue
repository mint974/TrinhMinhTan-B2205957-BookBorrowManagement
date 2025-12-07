<template>
  <div class="sidebar shadow-sm rounded-end-4 p-4">
    <div class="text-center mb-4">
      <div class="avatar-wrapper mb-3">
        <img v-if="user && user.Avatar" :src="getAvatarUrl(user.Avatar)" class="avatar" alt="Avatar" />
        <div v-else class="avatar bg-white d-flex align-items-center justify-content-center">
          <i class="fas fa-user fa-2x text-muted"></i>
        </div>
      </div>
      <h5 class="fw-bold text-white">{{ userName }}</h5>
      <p class="text-white-50 m-0 small">{{ userEmail }}</p>
    </div>

    <ul class="menu list-unstyled">
      <li v-for="item in menu" :key="item.label" class="mb-2" @click="handleMenuClick(item)">
        <router-link v-if="item.route" :to="item.route" class="menu-link" active-class="active">
          <i :class="item.icon"></i>
          <span class="ms-3">{{ item.label }}</span>
        </router-link>
        <a v-else href="#" class="menu-link" @click.prevent="handleMenuClick(item)">
          <i :class="item.icon"></i>
          <span class="ms-3">{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service';
import { useToast } from 'vue-toastification';

export default {
  name: "SidebarMenu",

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      user: null,
      menu: [
        { icon: "fas fa-home", label: "Trang chủ", route: "/" },
        { icon: "fas fa-book", label: "Danh sách sách", route: "/books" },
        { icon: "fas fa-history", label: "Lịch sử mượn", route: "/history" },
        { icon: "fas fa-user", label: "Trang cá nhân", route: "/profile" },
        { icon: "fas fa-sign-out-alt", label: "Đăng xuất", action: "logout" }
      ]
    };
  },

  computed: {
    userName() {
      if (this.user) {
        return `${this.user.HoLot} ${this.user.Ten}`;
      }
      return 'Người dùng';
    },
    userEmail() {
      return this.user?.Email || '';
    }
  },

  mounted() {
    this.loadUser();
    // Listen for user updates
    window.addEventListener('user-updated', this.loadUser);
  },

  beforeUnmount() {
    window.removeEventListener('user-updated', this.loadUser);
  },

  methods: {
    loadUser() {
      this.user = AuthService.getCurrentUser();
    },

    getAvatarUrl(avatar) {
      if (!avatar) return '';
      // Remove leading slash if exists
      const cleanPath = avatar.startsWith('/') ? avatar.substring(1) : avatar;
      return `http://localhost:5000/${cleanPath}`;
    },

    handleMenuClick(item) {
      if (item.action === 'logout') {
        this.handleLogout();
      }
    },
    
    handleLogout() {
      AuthService.logout();
      this.toast.success('Đăng xuất thành công!');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: sticky;
  top: 0;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.menu {
  margin-top: 2rem;
}

.menu li {
  transition: all 0.3s ease;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateX(5px);
}

.menu-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

.menu-link i {
  width: 24px;
  text-align: center;
  font-size: 1.1rem;
}
</style>
