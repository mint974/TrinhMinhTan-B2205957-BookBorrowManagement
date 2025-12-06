<template>
    <div class="address-select">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Tỉnh/Thành Phố <span class="text-danger">*</span></label>
                <select class="form-select" v-model="localMaTinh" @change="onTinhChange" required>
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option v-for="tinh in danhSachTinh" :key="tinh.code" :value="tinh.code">
                        {{ tinh.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Quận/Huyện</label>
                <select class="form-select" v-model="localMaQuan" @change="onQuanChange" :disabled="!localMaTinh">
                    <option value="">Chọn quận/huyện</option>
                    <option v-for="quan in danhSachQuan" :key="quan.code" :value="quan.code">
                        {{ quan.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Phường/Xã</label>
                <select class="form-select" v-model="localMaPhuong" @change="onPhuongChange" :disabled="!localMaQuan">
                    <option value="">Chọn phường/xã</option>
                    <option v-for="phuong in danhSachPhuong" :key="phuong.code" :value="phuong.code">
                        {{ phuong.name }}
                    </option>
                </select>
            </div>
            <div class="col-12">
                <label class="form-label">Địa Chỉ Chi Tiết (Số nhà, tên đường...)</label>
                <input type="text" class="form-control rounded-pill" v-model="localDiaChiChiTiet" @input="onDiaChiChiTietChange"
                    placeholder="Ví dụ: Số 123, Đường ABC..." />
            </div>
        </div>
    </div>
</template>

<script>
import DiaChiService from '@/services/diachi.service';

export default {
    name: 'AddressSelect',

    props: {
        maTinh: {
            type: String,
            default: ''
        },
        maQuan: {
            type: String,
            default: ''
        },
        maPhuong: {
            type: String,
            default: ''
        },
        diaChiChiTiet: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            localMaTinh: this.maTinh,
            localMaQuan: this.maQuan,
            localMaPhuong: this.maPhuong,
            localDiaChiChiTiet: this.diaChiChiTiet,
            danhSachTinh: [],
            danhSachQuan: [],
            danhSachPhuong: [],
        };
    },

    mounted() {
        this.loadDanhSachTinh();
    },

    watch: {
        maTinh(newVal) {
            this.localMaTinh = newVal;
            if (newVal) {
                this.loadDanhSachQuan();
            }
        },
        maQuan(newVal) {
            this.localMaQuan = newVal;
            if (newVal) {
                this.loadDanhSachPhuong();
            }
        },
        maPhuong(newVal) {
            this.localMaPhuong = newVal;
        },
        diaChiChiTiet(newVal) {
            this.localDiaChiChiTiet = newVal;
        }
    },

    methods: {
        async loadDanhSachTinh() {
            try {
                this.danhSachTinh = await DiaChiService.getAllTinh();

                if (this.localMaTinh) {
                    await this.loadDanhSachQuan();
                }
            } catch (error) {
                console.error('Error loading provinces:', error);
            }
        },

        async loadDanhSachQuan() {
            if (!this.localMaTinh) {
                this.danhSachQuan = [];
                this.danhSachPhuong = [];
                return;
            }

            try {
                this.danhSachQuan = await DiaChiService.getQuanByTinh(this.localMaTinh);

                if (this.localMaQuan) {
                    await this.loadDanhSachPhuong();
                }
            } catch (error) {
                console.error('Error loading districts:', error);
                this.danhSachQuan = [];
            }
        },

        async loadDanhSachPhuong() {
            if (!this.localMaQuan) {
                this.danhSachPhuong = [];
                return;
            }

            try {
                this.danhSachPhuong = await DiaChiService.getPhuongByQuan(this.localMaQuan);
            } catch (error) {
                console.error('Error loading wards:', error);
                this.danhSachPhuong = [];
            }
        },

        onTinhChange() {
            this.localMaQuan = '';
            this.localMaPhuong = '';
            this.danhSachQuan = [];
            this.danhSachPhuong = [];
            this.loadDanhSachQuan();
            this.emitChange();
        },

        onQuanChange() {
            this.localMaPhuong = '';
            this.danhSachPhuong = [];
            this.loadDanhSachPhuong();
            this.emitChange();
        },

        onPhuongChange() {
            this.emitChange();
        },

        onDiaChiChiTietChange() {
            this.emitChange();
        },

        emitChange() {
            this.$emit('update:maTinh', this.localMaTinh);
            this.$emit('update:maQuan', this.localMaQuan);
            this.$emit('update:maPhuong', this.localMaPhuong);
            this.$emit('update:diaChiChiTiet', this.localDiaChiChiTiet);
        }
    }
};
</script>

<style scoped>
.address-select {
    width: 100%;
}

.form-select {
    border-radius: 50rem;
}

.form-select:focus {
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    border-color: #667eea;
}
</style>
