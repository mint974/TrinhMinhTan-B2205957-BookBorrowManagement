<template>
    <div class="settings-page">
        <div class="container-fluid">
            <div class="page-header mb-4">
                <h2 class="page-title">
                    <i class="fas fa-cog me-2"></i>
                    Cài Đặt Hệ Thống
                </h2>
                <p class="text-muted">Quản lý cài đặt và dữ liệu hệ thống</p>
            </div>

            <div class="row">
                <!-- Đồng bộ địa chỉ -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-map-marked-alt me-2"></i>
                                Đồng Bộ Địa Chỉ
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">
                                Đồng bộ dữ liệu tỉnh/thành phố, quận/huyện, phường/xã từ API Việt Nam.
                                Thao tác này sẽ xóa toàn bộ dữ liệu địa chỉ cũ và tải mới.
                            </p>
                            <div v-if="syncStats" class="alert alert-info">
                                <strong>Thống kê hiện tại:</strong>
                                <ul class="mb-0 mt-2">
                                    <li>Tỉnh/Thành phố: {{ syncStats.provinces || 0 }}</li>
                                    <li>Quận/Huyện: {{ syncStats.districts || 0 }}</li>
                                    <li>Phường/Xã: {{ syncStats.wards || 0 }}</li>
                                </ul>
                            </div>
                            <button class="btn btn-primary" @click="syncAddress" :disabled="syncing">
                                <i :class="syncing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="me-2"></i>
                                {{ syncing ? 'Đang đồng bộ...' : 'Đồng Bộ Ngay' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Database info -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-database me-2"></i>
                                Thông Tin Hệ Thống
                            </h5>
                        </div>
                        <div class="card-body">
                            <table class="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th width="50%">Phiên bản:</th>
                                        <td>1.0.0</td>
                                    </tr>
                                    <tr>
                                        <th>Backend:</th>
                                        <td>Node.js + Express</td>
                                    </tr>
                                    <tr>
                                        <th>Database:</th>
                                        <td>MongoDB</td>
                                    </tr>
                                    <tr>
                                        <th>Frontend:</th>
                                        <td>Vue 3 + Vite</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import DiaChiService from '@/services/diachi.service';

export default {
    name: 'Settings',

    setup() {
        const toast = useToast();
        return { toast };
    },

    data() {
        return {
            syncing: false,
            syncStats: null,
        };
    },

    methods: {
        async syncAddress() {
            if (!confirm('Bạn có chắc muốn đồng bộ lại toàn bộ dữ liệu địa chỉ? Thao tác này có thể mất vài phút.')) {
                return;
            }

            this.syncing = true;
            try {
                const result = await DiaChiService.syncData();
                this.syncStats = result.stats;
                this.toast.success(
                    `Đồng bộ thành công!\n` +
                    `Tỉnh/TP: ${result.stats.provinces}\n` +
                    `Quận/Huyện: ${result.stats.districts}\n` +
                    `Phường/Xã: ${result.stats.wards}`,
                    { timeout: 5000 }
                );
            } catch (error) {
                console.error('Error syncing address:', error);
                this.toast.error('Lỗi khi đồng bộ dữ liệu địa chỉ');
            } finally {
                this.syncing = false;
            }
        },
    },
};
</script>

<style scoped>
.settings-page {
    padding: 1.5rem;
}

.page-header {
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
}

.card-header h5 {
    color: white;
}
</style>
