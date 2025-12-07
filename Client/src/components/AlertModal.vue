<template>
  <!-- Success Modal -->
  <div 
    class="modal fade" 
    :id="modalId" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" :class="headerClass">
          <h5 class="modal-title text-white">
            <i :class="iconClass" class="me-2"></i>
            {{ title }}
          </h5>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="hide"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-0" v-html="message"></p>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="hide"
            v-if="showCancel"
          >
            {{ cancelText }}
          </button>
          <button 
            type="button" 
            :class="confirmButtonClass" 
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'AlertModal',
  props: {
    modalId: {
      type: String,
      default: 'alertModal'
    },
    type: {
      type: String,
      default: 'info', // success, error, warning, info, confirm
      validator: (value) => ['success', 'error', 'warning', 'info', 'confirm'].includes(value)
    },
    title: {
      type: String,
      default: 'Thông báo'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Đóng'
    },
    cancelText: {
      type: String,
      default: 'Hủy'
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const modalElement = ref(null);
    let modalInstance = null;

    const headerClass = computed(() => {
      const classes = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info',
        'confirm': 'bg-primary'
      };
      return classes[props.type] || 'bg-info';
    });

    const iconClass = computed(() => {
      const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle',
        'confirm': 'fas fa-question-circle'
      };
      return icons[props.type] || 'fas fa-info-circle';
    });

    const confirmButtonClass = computed(() => {
      const classes = {
        'success': 'btn btn-success',
        'error': 'btn btn-danger',
        'warning': 'btn btn-warning',
        'info': 'btn btn-info',
        'confirm': 'btn btn-primary'
      };
      return classes[props.type] || 'btn btn-info';
    });

    const show = () => {
      if (modalInstance) {
        modalInstance.show();
      }
    };

    const hide = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('cancel');
    };

    const confirm = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('confirm');
    };

    onMounted(() => {
      if (modalElement.value) {
        modalInstance = new Modal(modalElement.value);
      }
    });

    return {
      modalElement,
      headerClass,
      iconClass,
      confirmButtonClass,
      show,
      hide,
      confirm
    };
  }
};
</script>

<style scoped>
.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
  padding-top: 0;
}

.modal-body {
  padding: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.btn-close-white {
  filter: brightness(0) invert(1);
}
</style>
