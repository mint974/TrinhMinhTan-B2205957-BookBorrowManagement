<template>
    <div>
        <h3 class="mb-3">📄 Quản lý Phiếu Mượn</h3>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Độc giả</th>
                    <th>Sách</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in borrows" :key="p._id">
                    <td>{{ p.MaDocGia?.Ten }}</td>
                    <td>{{ p.MaSach?.TenSach }}</td>
                    <td>{{ formatDate(p.NgayMuon) }}</td>
                    <td>{{ p.NgayTra ? formatDate(p.NgayTra) : "—" }}</td>
                    <td>
                        <span class="badge" :class="p.TrangThai === 'Đã trả' ? 'bg-success' : 'bg-warning'">
                            {{ p.TrangThai }}
                        </span>
                    </td>
                    <td>
                        <button v-if="p.TrangThai !== 'Đã trả'" class="btn btn-success btn-sm"
                            @click="markReturned(p._id)">
                            Xác nhận trả
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";

const borrows = ref([]);

function formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN");
}

async function load() {
    borrows.value = await BorrowService.getAll();
}

async function markReturned(id) {
    if (confirm("Xác nhận độc giả đã trả sách này?")) {
        await BorrowService.update(id, { TrangThai: "Đã trả", NgayTra: new Date() });
        load();
    }
}

onMounted(load);
</script>
