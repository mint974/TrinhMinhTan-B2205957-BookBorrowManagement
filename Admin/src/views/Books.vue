<template>
    <div>
        <h3 class="mb-3">📘 Quản lý Sách</h3>

        <!-- Tìm kiếm -->
        <div class="input-group mb-3">
            <input v-model="keyword" class="form-control" placeholder="Tìm theo tên sách..." />
            <button class="btn btn-outline-primary" @click="search">
                <i class="fas fa-search"></i>
            </button>
        </div>

        <!-- Nút thêm -->
        <button class="btn btn-success mb-3" @click="openForm()">+ Thêm Sách</button>

        <!-- Danh sách -->
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Tên sách</th>
                    <th>NXB</th>
                    <th>Số lượng còn</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="b in books" :key="b._id">
                    <td>{{ b.TenSach }}</td>
                    <td>{{ b.MaNXB?.TenNXB }}</td>
                    <td>{{ b.SoLuongCon }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" @click="openForm(b)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" @click="remove(b._id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form -->
        <div v-if="showForm" class="card p-3 mt-3 shadow-sm">
            <h5>{{ current._id ? "Sửa" : "Thêm" }} Sách</h5>
            <input v-model="current.TenSach" placeholder="Tên sách" class="form-control mb-2" />
            <input v-model="current.MaNXB" placeholder="Mã NXB" class="form-control mb-2" />
            <input v-model.number="current.SoLuongCon" placeholder="Số lượng" class="form-control mb-2" />
            <button class="btn btn-primary me-2" @click="save">Lưu</button>
            <button class="btn btn-secondary" @click="closeForm">Hủy</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BookService from "@/services/sach.service";

const books = ref([]);
const keyword = ref("");
const showForm = ref(false);
const current = ref({});

async function load() {
    books.value = await BookService.getAll();
}

function openForm(book = {}) {
    current.value = { ...book };
    showForm.value = true;
}

function closeForm() {
    current.value = {};
    showForm.value = false;
}

async function save() {
    if (current.value._id)
        await BookService.update(current.value._id, current.value);
    else await BookService.create(current.value);

    closeForm();
    load();
}

async function remove(id) {
    if (confirm("Bạn có chắc muốn xóa sách này?")) {
        await BookService.delete(id);
        load();
    }
}

async function search() {
    const q = keyword.value.toLowerCase();
    books.value = (await BookService.getAll()).filter((b) =>
        b.TenSach.toLowerCase().includes(q)
    );
}

onMounted(load);
</script>
