<template>
    <div class="card mb-4">
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-search"></i>
                        </span>
                        <input type="text" 
                               class="form-control" 
                               :placeholder="placeholder"
                               :value="modelValue" 
                               @input="$emit('update:modelValue', $event.target.value)" />
                    </div>
                </div>
                
                <!-- Filter Slots -->
                <slot name="filters"></slot>
                
                <div class="col-md-2">
                    <button class="btn btn-outline-secondary w-100" @click="$emit('reset')">
                        <i class="fas fa-redo me-2"></i>Reset
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: String,
        placeholder: String
    }
}
</script>

<style scoped>
.card {
    border: 1px solid #e3e9f4;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.input-group-text {
    background-color: #f8f9fa;
    border-color: #e3e9f4;
    color: #6c757d;
}

.form-control, .form-select {
    border-color: #e3e9f4;
}

.form-control:focus, .form-select:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.btn-outline-secondary {
    border-color: #e3e9f4;
    color: #6c757d;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    border-color: #6c757d;
}
</style>
