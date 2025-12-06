import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/bookborrow/manager/login",
  },
  {
    path: "/bookborrow/manager/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
    meta: { hideLayout: true },
  },
  {
    path: "/bookborrow/manager/admin",
    name: "admin.dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/employees",
    name: "admin.employees",
    component: () => import("../views/nhanvien.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/profile",
    name: "admin.profile",
    component: () => import("../views/trangcanhan.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/settings",
    name: "admin.settings",
    component: () => import("../views/Settings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/publishers",
    name: "admin.publishers",
    component: () => import("../views/nhaxuatban.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/categories",
    name: "admin.categories",
    component: () => import("../views/danhmuc.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/authors",
    name: "admin.authors",
    component: () => import("../views/TacGia.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bookborrow/manager/admin/books",
    name: "admin.books",
    component: () => import("../views/sach.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/bookborrow/manager/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // Nếu route yêu cầu auth nhưng không có token -> redirect login
  if (to.meta.requiresAuth && !token) {
    return next("/bookborrow/manager/login");
  }

  // Nếu đã login và cố vào trang login -> redirect admin
  if (to.path === "/bookborrow/manager/login" && token) {
    return next("/bookborrow/manager/admin");
  }

  next();
});

export default router;
