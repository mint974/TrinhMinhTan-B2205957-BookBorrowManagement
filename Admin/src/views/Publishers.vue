<template>
    <div>
        <h3 class="mb-3">🏢 Quản lý Nhà Xuất Bản</h3>

        <button class="btn btn-success mb-3" @click="openForm()">+ Thêm NXB</button>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Mã NXB</th>
                    <th>Tên NXB</th>
                    <th>Địa chỉ</th>
                    <th>Điện thoại</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="n in publishers" :key="n._id">
                    <td>{{ n.MaNXB }}</td>
                    <td>{{ n.TenNXB }}</td>
                    <td>{{ n.DiaChi }}</td>
                    <td>{{ n.DienThoai }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" @click="openForm(n)">Sửa</button>
                        <button class="btn btn-danger btn-sm" @click="remove(n._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showForm" class="card p-3 mt-3">
            <h5>{{ current._id ? "Sửa" : "Thêm" }} NXB</h5>
            <input v-model="current.MaNXB" placeholder="Mã NXB" class="form-control mb-2" />
            <input v-model="current.TenNXB" placeholder="Tên NXB" class="form-control mb-2" />
            <input v-model="current.DiaChi" placeholder="Địa chỉ" class="form-control mb-2" />
            <input v-model="current.DienThoai" placeholder="Điện thoại" class="form-control mb-2" />
            <button class="btn btn-primary me-2" @click="save">Lưu</button>
            <button class="btn btn-secondary" @click="closeForm">Hủy</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PublisherService from "@/services/publisher.service";

const publishers = ref([]);
const showForm = ref(false);
const current = ref({});

async function load() {
    publishers.value = await PublisherService.getAll();
}

function openForm(n = {}) {
    current.value = { ...n };
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    current.value = {};
}

async function save() {
    if (current.value._id)
        await PublisherService.update(current.value._id, current.value);
    else await PublisherService.create(current.value);
    closeForm();
    load();
}

async function remove(id) {
    if (confirm("Bạn có chắc muốn xóa NXB này?")) {
        await PublisherService.delete(id);
        load();
    }
}

onMounted(load);
</script>
