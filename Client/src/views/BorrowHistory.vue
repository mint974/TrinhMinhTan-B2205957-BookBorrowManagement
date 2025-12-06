<template>
    <div>
        <h3><i class="fas fa-clock"></i> Lịch sử mượn sách</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Sách</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="b in borrows" :key="b._id">
                    <td>{{ b.MaSach.TenSach }}</td>
                    <td>{{ new Date(b.NgayMuon).toLocaleDateString() }}</td>
                    <td>{{ b.NgayTra ? new Date(b.NgayTra).toLocaleDateString() : "Chưa trả" }}</td>
                    <td>
                        <span class="badge" :class="b.TrangThai === 'Đã trả' ? 'bg-success' : 'bg-warning'">
                            {{ b.TrangThai }}
                        </span>
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

onMounted(async () => {
    const readerId = "DOCGIA001"; 
    borrows.value = await BorrowService.getAllByReader(readerId);
});
</script>
