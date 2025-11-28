<template>
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3 px-4 d-flex flex-wrap justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">{{ title }}</h5>

            <div class="d-flex gap-2 flex-wrap">
                <slot name="filters"></slot>
            </div>
        </div>

        <div class="card-body px-4 pb-4">
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
                        <tr v-for="item in data" :key="item._id" class="table-row-hover">
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
                        <tr v-if="data.length === 0">
                            <td :colspan="columns.length + (hasPhoto ? 1 : 0)" class="text-center py-4 text-muted">
                                Không có dữ liệu để hiển thị
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
    props: {
        title: String,
        columns: Array,
        data: Array,
        hasPhoto: Boolean,
        itemName: {
            type: String,
            default: 'item'
        }
    },
    data() {
        return {
            defaultAvatar: "/images/default-avatar.png",
            selectedItem: null,
            deleteModal: null
        };
    },
    computed: {
        deleteModalTitle() {
            if (!this.selectedItem) return 'Xác nhận xóa';
            const itemName = this.selectedItem.TenNXB || this.selectedItem.HoTen || this.selectedItem.Ten || 'item này';
            return `Xóa ${this.itemName}: ${itemName}`;
        },
        deleteModalMessage() {
            return `Bạn có chắc chắn muốn xóa ${this.itemName} này? Hành động này không thể hoàn tác!`;
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
</style>
