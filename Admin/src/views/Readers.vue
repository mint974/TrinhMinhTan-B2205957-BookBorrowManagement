<template>
    <div>
        <h3 class="mb-3">👤 Quản lý Độc giả</h3>

        <button class="btn btn-success mb-3" @click="openForm()">+ Thêm Độc giả</button>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>Họ tên</th>
                    <th>Điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="r in readers" :key="r._id">
                    <td>{{ r.MaDocGia }}</td>
                    <td>{{ r.HoLot }} {{ r.Ten }}</td>
                    <td>{{ r.DienThoai }}</td>
                    <td>{{ r.DiaChi }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" @click="openForm(r)">Sửa</button>
                        <button class="btn btn-danger btn-sm" @click="remove(r._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showForm" class="card p-3 mt-3">
            <h5>{{ current._id ? "Sửa" : "Thêm" }} Độc giả</h5>
            <input v-model="current.HoLot" placeholder="Họ lót" class="form-control mb-2" required />
            <input v-model="current.Ten" placeholder="Tên" class="form-control mb-2" required />
            <input v-model="current.Email" placeholder="Email" type="email" class="form-control mb-2" required />
            <input v-if="!current._id" v-model="current.Password" placeholder="Mật khẩu" type="password" class="form-control mb-2" required />
            <input v-model="current.NgaySinh" placeholder="Ngày sinh" type="date" class="form-control mb-2" required />
            <select v-model="current.GioiTinh" class="form-control mb-2" required>
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>
            <input v-model="current.DienThoai" placeholder="Điện thoại" class="form-control mb-2" required />
            <input v-model="current.DiaChi" placeholder="Địa chỉ" class="form-control mb-2" required />
            <button class="btn btn-primary me-2" @click="save">Lưu</button>
            <button class="btn btn-secondary" @click="closeForm">Hủy</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReaderService from "@/services/docgia.service";

const readers = ref([]);
const showForm = ref(false);
const current = ref({});

async function load() {
    readers.value = await ReaderService.getAll();
}

function openForm(r = {}) {
    current.value = { ...r };
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    current.value = {};
}

async function save() {
    if (current.value._id)
        await ReaderService.update(current.value._id, current.value);
    else await ReaderService.create(current.value);
    closeForm();
    load();
}

async function remove(id) {
    if (confirm("Bạn có chắc muốn xóa độc giả này?")) {
        await ReaderService.delete(id);
        load();
    }
}

onMounted(load);
</script>
