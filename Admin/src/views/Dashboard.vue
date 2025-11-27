<template>
    <div>
        <h3 class="mb-3">📊 Bảng điều khiển</h3>
        <div class="row">
            <div class="col-md-3" v-for="card in stats" :key="card.title">
                <div class="card text-center shadow-sm mb-3">
                    <div class="card-body">
                        <h5 class="card-title">{{ card.title }}</h5>
                        <p class="display-6">{{ card.value }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BookService from "@/services/sach.service";
import ReaderService from "@/services/docgia.service";
import PublisherService from "@/services/nhaxuatban.service";
import BorrowService from "@/services/theodoimuonsach.service";

const stats = ref([]);

onMounted(async () => {
    const [books, readers, publishers, borrows] = await Promise.all([
        BookService.getAll(),
        ReaderService.getAll(),
        PublisherService.getAll(),
        BorrowService.getAll(),
    ]);

    stats.value = [
        { title: "Sách", value: books.length },
        { title: "Độc giả", value: readers.length },
        { title: "Nhà XB", value: publishers.length },
        { title: "Phiếu mượn", value: borrows.length },
    ];
});
</script>
