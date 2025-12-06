<template>
    <div>
        <h3 class="mb-3"><i class="fas fa-book"></i> Danh sách sách</h3>
        <div class="input-group mb-3">
            <input v-model="keyword" @keyup.enter="search" type="text" class="form-control"
                placeholder="Tìm theo tên sách...">
            <button class="btn btn-outline-primary" @click="search">Tìm</button>
        </div>

        <div v-if="books.length" class="row">
            <div v-for="book in books" :key="book._id" class="col-md-4 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h5>{{ book.TenSach }}</h5>
                        <p>NXB: {{ book.MaNXB.TenNXB }}</p>
                        <p>Còn lại: <strong>{{ book.SoLuongCon }}</strong></p>
                        <button class="btn btn-success btn-sm" @click="borrow(book)">
                            <i class="fas fa-hand-holding"></i> Mượn
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <p v-else>Không có sách nào.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";

const books = ref([]);
const keyword = ref("");

async function loadBooks() {
    books.value = await BookService.getAll();
}

async function search() {
    books.value = keyword.value ? await BookService.search(keyword.value) : await BookService.getAll();
}

async function borrow(book) {
    const readerId = "DOCGIA001"; // tạm thời hardcode, có thể lấy từ login sau
    await BorrowService.create({ MaDocGia: readerId, MaSach: book._id });
    alert(`Đã gửi yêu cầu mượn sách: ${book.TenSach}`);
}

onMounted(loadBooks);
</script>
