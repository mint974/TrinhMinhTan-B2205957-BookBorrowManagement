<template>
    <div class="page-header mb-4">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h4 class="fw-bold mb-1">
                    <i :class="icon + ' text-primary me-2'"></i>
                    {{ title }}
                </h4>
                <p class="text-muted mb-0">{{ subtitle }}</p>
            </div>
            <button v-if="showAddButton" class="btn btn-primary" @click="$emit('add')">
                <i class="fas fa-plus me-2"></i>
                {{ addButtonText }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageHeader',
    
    emits: ['add'],
    
    props: {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'fas fa-list'
        },
        showAddButton: {
            type: Boolean,
            default: true
        },
        addButtonText: {
            type: String,
            default: 'Thêm Mới'
        }
    }
};
</script>

<style scoped>
.page-header {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-left: 4px solid #0d6efd;
}
</style>
