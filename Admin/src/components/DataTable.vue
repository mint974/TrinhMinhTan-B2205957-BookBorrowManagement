<template>
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3 px-4 d-flex flex-wrap justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">{{ title }}</h5>

            <div class="d-flex gap-2 flex-wrap">
                <slot name="filters"></slot>
            </div>
        </div>

        <div class="card-body px-4 pb-4">
            <!-- Pagination Controls -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">Hiển thị:</span>
                    <select v-model="itemsPerPage" class="form-select form-select-sm" style="width: auto;">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                    </select>
                    <span class="text-muted small">dòng/trang</span>
                </div>
                <div class="text-muted small">
                    Hiển thị {{ startIndex + 1 }}-{{ endIndex }} trong tổng số {{ totalItems }} mục
                </div>
            </div>

            <div class="table-responsive">
                <table class="table align-middle table-hover">
                    <thead>
                        <tr>
                            <th v-for="col in columns" :key="col.key" class="text-muted small fw-semibold">
                                {{ col.label }}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedData" :key="item._id" class="table-row-hover">
                            <!-- Ảnh đại diện -->
                            <td v-if="hasPhoto">
                                <img :src="item.Avatar || defaultAvatar"
                                     class="rounded-circle border shadow-sm"
                                     style="width: 40px; height: 40px; object-fit: cover;">
                            </td>

                            <td v-for="col in columns" :key="col.key">
                                <!-- Actions Column -->
                                <div v-if="col.key === 'actions'" class="text-center">
                                    <slot name="actions" :item="item">
                                        <div class="d-flex justify-content-center gap-1">
                                            <button class="btn btn-outline-primary btn-sm" 
                                                    @click="$emit('view', item)"
                                                    title="Xem chi tiết">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-outline-warning btn-sm" 
                                                    @click="$emit('edit', item)"
                                                    title="Chỉnh sửa">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-outline-danger btn-sm" 
                                                    @click="showDeleteModal(item)"
                                                    title="Xóa">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </slot>
                                </div>
                                
                                <!-- TrangThai Column -->
                                <span v-else-if="col.key === 'TrangThai'">
                                    <span class="badge"
                                          :class=" item.TrangThai === 'Active'
                                            ? 'bg-success bg-opacity-75'
                                            : 'bg-danger bg-opacity-75' ">
                                        {{ item.TrangThai }}
                                    </span>
                                </span>
                                
                                <!-- Custom Slot Column -->
                                <slot v-else-if="$slots[col.key]" :name="col.key" :item="item" :value="item[col.key]"></slot>
                                
                                <!-- Regular Column -->
                                <span v-else>{{ item[col.key] }}</span>
                            </td>
                        </tr>

                        <!-- Empty -->
                        <tr v-if="paginatedData.length === 0">
                            <td :colspan="columns.length + (hasPhoto ? 1 : 0)" class="text-center py-4 text-muted">
                                Không có dữ liệu để hiển thị
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="mt-4">
                <ul class="pagination pagination-sm justify-content-center mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="currentPage = 1">
                            <i class="fas fa-angle-double-left"></i>
                        </a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="currentPage--">
                            <i class="fas fa-angle-left"></i>
                        </a>
                    </li>
                    
                    <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                        <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                    </li>
                    
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="currentPage++">
                            <i class="fas fa-angle-right"></i>
                        </a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="currentPage = totalPages">
                            <i class="fas fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    
    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
        modal-id="confirmDeleteModal"
        :title="deleteModalTitle"
        :message="deleteModalMessage"
        @confirm="handleDelete"
    />
</template>

<script>
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';
import { Modal } from 'bootstrap';

export default {
    components: {
        ConfirmDeleteModal
    },
    emits: ['view', 'edit', 'delete'],
    props: {
        title: String,
        columns: Array,
        data: Array,
        hasPhoto: Boolean,
        loading: {
            type: Boolean,
            default: false
        },
        itemName: {
            type: String,
            default: 'item'
        }
    },
    data() {
        return {
            defaultAvatar: "/images/default-avatar.png",
            selectedItem: null,
            deleteModal: null,
            currentPage: 1,
            itemsPerPage: 10
        };
    },
    computed: {
        totalItems() {
            return this.data.length;
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },
        endIndex() {
            const end = this.startIndex + this.itemsPerPage;
            return end > this.totalItems ? this.totalItems : end;
        },
        paginatedData() {
            return this.data.slice(this.startIndex, this.endIndex);
        },
        displayedPages() {
            const pages = [];
            const maxDisplayed = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxDisplayed / 2));
            let endPage = Math.min(this.totalPages, startPage + maxDisplayed - 1);
            
            if (endPage - startPage + 1 < maxDisplayed) {
                startPage = Math.max(1, endPage - maxDisplayed + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            return pages;
        },
        deleteModalTitle() {
            if (!this.selectedItem) return 'Xác nhận xóa';
            const itemName = this.selectedItem.TenNXB || this.selectedItem.HoTen || this.selectedItem.Ten || 'item này';
            return `Xóa ${this.itemName}: ${itemName}`;
        },
        deleteModalMessage() {
            return `Bạn có chắc chắn muốn xóa ${this.itemName} này? Hành động này không thể hoàn tác!`;
        }
    },
    watch: {
        itemsPerPage() {
            this.currentPage = 1; // Reset về trang 1 khi thay đổi số dòng
        },
        data() {
            // Reset về trang 1 khi data thay đổi (search, filter)
            if (this.currentPage > this.totalPages) {
                this.currentPage = 1;
            }
        }
    },
    mounted() {
        this.deleteModal = new Modal(document.getElementById('confirmDeleteModal'));
    },
    methods: {
        showDeleteModal(item) {
            this.selectedItem = item;
            this.deleteModal.show();
        },
        handleDelete() {
            if (this.selectedItem) {
                this.$emit('delete', this.selectedItem);
                this.selectedItem = null;
            }
        }
    }
};
</script>

<style scoped>
.card {
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    border: 1px solid #e3e9f4;
    border-radius: 12px;
    overflow: hidden;
}

.card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
}

.card-header h5 {
    color: white;
}

.table > :not(caption) > * > * {
    padding: 12px 16px !important;
    border-color: #e9ecef;
}

.table thead th {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}

.table-row-hover:hover {
    background-color: rgba(13, 110, 253, 0.04);
    transition: background-color 0.2s ease;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 6px;
}

.btn-outline-primary:hover,
.btn-outline-warning:hover,
.btn-outline-danger:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.pagination {
    margin: 0;
}

.page-link {
    color: #667eea;
    border-color: #e3e9f4;
    padding: 0.375rem 0.75rem;
}

.page-link:hover {
    color: #764ba2;
    background-color: #f8f9ff;
    border-color: #667eea;
}

.page-item.active .page-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
}

.page-item.disabled .page-link {
    color: #adb5bd;
    background-color: #fff;
    border-color: #e3e9f4;
}
</style>
