<template>
    <div class="modal fade" :id="modalId" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Xác Nhận Xóa
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <div class="warning-icon mb-3">
                            <i class="fas fa-trash-alt fa-3x text-danger"></i>
                        </div>
                        <h5 class="mb-3">{{ title }}</h5>
                        <p class="text-muted mb-0">{{ message }}</p>
                    </div>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-2"></i>
                        Hủy
                    </button>
                    <button type="button" class="btn btn-danger" @click="confirmDelete">
                        <i class="fas fa-trash me-2"></i>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfirmDeleteModal',
    props: {
        modalId: {
            type: String,
            default: 'confirmDeleteModal'
        },
        title: {
            type: String,
            default: 'Bạn có chắc chắn muốn xóa?'
        },
        message: {
            type: String,
            default: 'Hành động này không thể hoàn tác!'
        }
    },
    methods: {
        confirmDelete() {
            this.$emit('confirm');
            // Close modal
            const modal = document.getElementById(this.modalId);
            if (modal) {
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            }
        }
    }
}
</script>

<style scoped>
.warning-icon {
    opacity: 0.8;
}

.modal-content {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.modal-footer {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}
</style>