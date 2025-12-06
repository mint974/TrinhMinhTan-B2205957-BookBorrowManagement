import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import BookList from "@/views/sach/BookList.vue";
import BookDetail from "@/views/sach/BookDetail.vue";
import BorrowHistory from "@/views/BorrowHistory.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  { 
    path: "/", 
    name: "home", 
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: "/books", 
    name: "books", 
    component: BookList,
    meta: { requiresAuth: true }
  },
  { 
    path: "/sach/:id", 
    name: "book-detail", 
    component: BookDetail,
    meta: { requiresAuth: true }
  },
  { 
    path: "/history", 
    name: "history", 
    component: BorrowHistory,
    meta: { requiresAuth: true }
  },
  { 
    path: "/login", 
    name: "login", 
    component: Login,
    meta: { guest: true }
  },
  { 
    path: "/register", 
    name: "register", 
    component: Register,
    meta: { guest: true }
  },
  { 
    path: "/:pathMatch(.*)*", 
    name: "notfound", 
    component: NotFound 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // Nếu route yêu cầu auth nhưng không có token -> redirect login
  if (to.meta.requiresAuth && !token) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }

  // Nếu đã login và cố vào trang login/register -> redirect home
  if (to.meta.guest && token) {
    return next("/");
  }

  next();
});

export default router;

