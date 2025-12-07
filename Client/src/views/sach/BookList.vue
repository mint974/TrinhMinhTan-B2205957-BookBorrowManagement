<template>
    <div class="book-list-layout d-flex">
        <SidebarMenu />

        <div class="main-content flex-grow-1 p-4">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold">
                    <i class="fas fa-book me-2"></i>
                    Danh sách sách
                </h2>
                <div class="d-flex gap-2">
                    <button 
                        class="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#textSearchModal"
                    >
                        <i class="fas fa-search me-2"></i>
                        Tìm kiếm văn bản
                    </button>
                    <button 
                        class="btn btn-outline-success"
                        data-bs-toggle="modal"
                        data-bs-target="#voiceSearchModal"
                    >
                        <i class="fas fa-microphone me-2"></i>
                        Tìm kiếm giọng nói
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters-section card shadow-sm mb-4">
                <div class="card-body">
                    <h6 class="fw-bold mb-3">
                        <i class="fas fa-filter me-2"></i>
                        Bộ lọc
                    </h6>
                    <div class="row g-3">
                        <!-- Filter by Category -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-tags me-2 text-primary"></i>
                                Danh mục
                            </label>
                            <select 
                                class="form-select" 
                                v-model="filterDanhMuc"
                                @change="filterBooks"
                            >
                                <option value="">Tất cả danh mục</option>
                                <option 
                                    v-for="dm in categories" 
                                    :key="dm._id" 
                                    :value="dm._id"
                                >
                                    {{ dm.TenDanhMuc }}
                                </option>
                            </select>
                        </div>

                        <!-- Filter by Author -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-pen-fancy me-2 text-info"></i>
                                Tác giả
                            </label>
                            <select 
                                class="form-select" 
                                v-model="filterTacGia"
                                @change="filterBooks"
                            >
                                <option value="">Tất cả tác giả</option>
                                <option 
                                    v-for="author in authors" 
                                    :key="author._id" 
                                    :value="author._id"
                                >
                                    {{ author.HoTen }}
                                </option>
                            </select>
                        </div>

                        <!-- Filter by Publisher -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-building me-2 text-warning"></i>
                                Nhà xuất bản
                            </label>
                            <select 
                                class="form-select" 
                                v-model="filterNhaXuatBan"
                                @change="filterBooks"
                            >
                                <option value="">Tất cả NXB</option>
                                <option 
                                    v-for="nxb in publishers" 
                                    :key="nxb._id" 
                                    :value="nxb._id"
                                >
                                    {{ nxb.TenNXB }}
                                </option>
                            </select>
                        </div>

                        <!-- Filter by Year -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-calendar-alt me-2 text-success"></i>
                                Năm xuất bản
                            </label>
                            <select 
                                class="form-select" 
                                v-model="filterNamXuatBan"
                                @change="filterBooks"
                            >
                                <option value="">Tất cả năm</option>
                                <option 
                                    v-for="year in years" 
                                    :key="year" 
                                    :value="year"
                                >
                                    {{ year }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Filter Actions -->
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="filter-info">
                            <span class="badge bg-primary">
                                <i class="fas fa-book me-1"></i>
                                {{ filteredBooks.length }} quyển sách
                            </span>
                        </div>
                        <button 
                            class="btn btn-outline-secondary btn-sm"
                            @click="resetFilters"
                        >
                            <i class="fas fa-redo me-1"></i>
                            Đặt lại bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Books Grid -->
            <div v-else>
                <div v-if="filteredBooks.length > 0" class="books-grid">
                    <div v-for="book in filteredBooks" :key="book._id">
                        <BookCard 
                            v-bind="book"
                            @click="navigateToBook(book._id)"
                        />
                    </div>
                </div>
                <div v-else class="text-center py-5">
                    <i class="fas fa-search fa-4x text-muted mb-3"></i>
                    <h5 class="text-muted">Không tìm thấy sách phù hợp</h5>
                    <button class="btn btn-primary mt-3" @click="resetFilters">
                        Xem tất cả sách
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal tìm kiếm văn bản -->
        <div class="modal fade" id="textSearchModal" tabindex="-1" aria-labelledby="textSearchModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="textSearchModalLabel">
                            <i class="fas fa-search me-2"></i>
                            Tìm kiếm sách
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex flex-column gap-3">
                            <input 
                                type="text" 
                                v-model="searchQuery"
                                @keyup.enter="handleTextSearch"
                                class="form-control" 
                                placeholder="Nhập tên sách, tác giả, hoặc danh mục..." 
                                autofocus
                            />
                            <div class="d-flex justify-content-between gap-2">
                                <button 
                                    type="button" 
                                    class="btn btn-primary w-100"
                                    @click="handleTextSearch"
                                >
                                    <i class="fas fa-search me-2"></i> 
                                    Tìm kiếm
                                </button>
                                <button 
                                    type="button" 
                                    class="btn btn-outline-secondary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#voiceSearchModal" 
                                    data-bs-dismiss="modal"
                                >
                                    <i class="fas fa-microphone me-2"></i> 
                                    Giọng nói
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal tìm kiếm bằng giọng nói -->
        <div class="modal fade" id="voiceSearchModal" tabindex="-1" aria-labelledby="voiceSearchModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="voiceSearchModalLabel">
                            <i class="fas fa-microphone me-2"></i>
                            Tìm kiếm bằng giọng nói
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-3 text-muted">Nhấn vào biểu tượng micro và nói tên sách bạn cần tìm</p>

                        <div class="mb-4">
                            <button 
                                class="btn btn-lg rounded-circle mic-btn"
                                :class="{ 'recording': isRecording }"
                                @click="toggleRecording"
                                title="Bấm để ghi âm"
                            >
                                <i class="fas fa-microphone fs-2 text-white"></i>
                            </button>
                        </div>

                        <div class="border p-3 rounded bg-light">
                            <span class="fs-5 fst-italic" :class="transcriptText ? 'text-primary' : 'text-muted'">
                                {{ transcriptText || 'Chưa có dữ liệu...' }}
                            </span>
                        </div>

                        <!-- Nút quay lại -->
                        <div class="mt-4">
                            <button 
                                class="btn btn-outline-secondary"
                                data-bs-toggle="modal"
                                data-bs-target="#textSearchModal" 
                                data-bs-dismiss="modal"
                            >
                                <i class="fas fa-arrow-left me-2"></i> 
                                Quay lại tìm kiếm văn bản
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';
import SidebarMenu from '@/components/SidebarMenu.vue';
import BookCard from '@/components/BookCard.vue';
import BookService from '@/services/book.service';

export default {
    name: 'BookList',
    components: {
        SidebarMenu,
        BookCard
    },
    setup() {
        const router = useRouter();
        const loading = ref(true);
        const searchQuery = ref('');
        const books = ref([]);
        const filteredBooks = ref([]);
        const categories = ref([]);
        const authors = ref([]);
        const publishers = ref([]);
        const years = ref([]);
        
        const filterDanhMuc = ref('');
        const filterTacGia = ref('');
        const filterNhaXuatBan = ref('');
        const filterNamXuatBan = ref('');

        // Voice search
        const isRecording = ref(false);
        const transcriptText = ref('');
        let recognition = null;
        let textSearchModal = null;
        let voiceSearchModal = null;

        const loadBooks = async () => {
            try {
                loading.value = true;
                const response = await BookService.getAll();
                const allBooks = response || [];

                // Map books data
                books.value = allBooks.map(book => ({
                    _id: book._id,
                    rawData: book,
                    image: book.AnhBia ? `http://localhost:5000/${book.AnhBia}` : 'https://via.placeholder.com/150x200?text=No+Image',
                    title: book.TenSach,
                    author: book.TacGia?.HoTen || 'Chưa rõ',
                    category: book.DanhMuc?.TenDanhMuc || 'Chưa phân loại'
                }));

                // Extract categories
                const categoriesSet = new Map();
                allBooks.forEach(book => {
                    if (book.DanhMuc) {
                        categoriesSet.set(book.DanhMuc._id, {
                            _id: book.DanhMuc._id,
                            TenDanhMuc: book.DanhMuc.TenDanhMuc
                        });
                    }
                });
                categories.value = Array.from(categoriesSet.values());

                // Extract authors
                const authorsSet = new Map();
                allBooks.forEach(book => {
                    if (book.TacGia) {
                        authorsSet.set(book.TacGia._id, {
                            _id: book.TacGia._id,
                            HoTen: book.TacGia.HoTen
                        });
                    }
                });
                authors.value = Array.from(authorsSet.values());

                // Extract publishers
                const publishersSet = new Map();
                allBooks.forEach(book => {
                    if (book.NhaXuatBan) {
                        publishersSet.set(book.NhaXuatBan._id, {
                            _id: book.NhaXuatBan._id,
                            TenNXB: book.NhaXuatBan.TenNXB
                        });
                    }
                });
                publishers.value = Array.from(publishersSet.values());

                // Extract years
                const yearsSet = new Set();
                allBooks.forEach(book => {
                    if (book.NamXuatBan) {
                        yearsSet.add(book.NamXuatBan);
                    }
                });
                years.value = Array.from(yearsSet).sort((a, b) => b - a);

                filteredBooks.value = [...books.value];
            } catch (error) {
                console.error('Error loading books:', error);
            } finally {
                loading.value = false;
            }
        };

        const filterBooks = () => {
            let filtered = [...books.value];

            // Filter by search query
            if (searchQuery.value.trim()) {
                const query = searchQuery.value.toLowerCase();
                filtered = filtered.filter(book => 
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    book.category.toLowerCase().includes(query)
                );
            }

            // Filter by category
            if (filterDanhMuc.value) {
                filtered = filtered.filter(book => 
                    book.rawData.DanhMuc?._id === filterDanhMuc.value
                );
            }

            // Filter by author
            if (filterTacGia.value) {
                filtered = filtered.filter(book => 
                    book.rawData.TacGia?._id === filterTacGia.value
                );
            }

            // Filter by publisher
            if (filterNhaXuatBan.value) {
                filtered = filtered.filter(book => 
                    book.rawData.NhaXuatBan?._id === filterNhaXuatBan.value
                );
            }

            // Filter by year
            if (filterNamXuatBan.value) {
                filtered = filtered.filter(book => 
                    book.rawData.NamXuatBan === parseInt(filterNamXuatBan.value)
                );
            }

            filteredBooks.value = filtered;
        };

        const resetFilters = () => {
            searchQuery.value = '';
            filterDanhMuc.value = '';
            filterTacGia.value = '';
            filterNhaXuatBan.value = '';
            filterNamXuatBan.value = '';
            filteredBooks.value = [...books.value];
        };

        const navigateToBook = (bookId) => {
            router.push(`/sach/${bookId}`);
        };

        // Text search handler
        const handleTextSearch = () => {
            filterBooks();
            if (textSearchModal) {
                textSearchModal.hide();
            }
        };

        // Voice recognition setup
        const initVoiceRecognition = () => {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = 'vi-VN';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                recognition.onstart = () => {
                    isRecording.value = true;
                    transcriptText.value = 'Đang nghe...';
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    transcriptText.value = transcript;
                    searchQuery.value = transcript;
                };

                recognition.onerror = (event) => {
                    transcriptText.value = 'Lỗi: ' + event.error;
                    isRecording.value = false;
                };

                recognition.onend = () => {
                    isRecording.value = false;
                    
                    // Nếu có nội dung, thực hiện tìm kiếm
                    if (searchQuery.value.trim() !== '') {
                        filterBooks();
                        if (voiceSearchModal) {
                            voiceSearchModal.hide();
                        }
                    } else {
                        transcriptText.value = 'Không nhận diện được âm thanh.';
                    }
                };
            } else {
                transcriptText.value = 'Trình duyệt không hỗ trợ Web Speech API.';
            }
        };

        const toggleRecording = () => {
            if (!recognition) {
                initVoiceRecognition();
            }

            if (!isRecording.value && recognition) {
                transcriptText.value = '';
                recognition.start();
            } else if (recognition) {
                recognition.stop();
            }
        };

        onMounted(() => {
            loadBooks();
            initVoiceRecognition();

            // Initialize Bootstrap modals
            const textSearchEl = document.getElementById('textSearchModal');
            const voiceSearchEl = document.getElementById('voiceSearchModal');
            
            if (textSearchEl) {
                textSearchModal = new Modal(textSearchEl);
            }
            if (voiceSearchEl) {
                voiceSearchModal = new Modal(voiceSearchEl);
                // Reset voice search when modal is hidden
                voiceSearchEl.addEventListener('hidden.bs.modal', () => {
                    transcriptText.value = '';
                    if (isRecording.value && recognition) {
                        recognition.stop();
                    }
                });
            }
        });

        onUnmounted(() => {
            if (recognition) {
                recognition.stop();
                recognition = null;
            }
        });

        return {
            loading,
            searchQuery,
            books,
            filteredBooks,
            categories,
            authors,
            publishers,
            years,
            filterDanhMuc,
            filterTacGia,
            filterNhaXuatBan,
            filterNamXuatBan,
            filterBooks,
            resetFilters,
            navigateToBook,
            handleTextSearch,
            isRecording,
            transcriptText,
            toggleRecording
        };
    }
};
</script>

<style scoped>
.book-list-layout {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.main-content {
    overflow-y: auto;
    max-height: 100vh;
}

.search-box {
    position: relative;
    width: 300px;
}

.search-box i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}

.search-box input {
    padding-left: 40px;
    border-radius: 25px;
    border: 1px solid #ddd;
}

.search-box input:focus {
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    border-color: #667eea;
}

.filters-section {
    border: none;
    border-radius: 12px;
}

.filters-section .card-body {
    padding: 1.5rem;
}

.form-select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.filter-info .badge {
    font-size: 0.95rem;
    padding: 8px 16px;
}

.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
}

/* Voice Search Mic Button */
.mic-btn {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;
}

.mic-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.mic-btn.recording {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.7);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 15px rgba(245, 87, 108, 0);
    }
}

@media (max-width: 768px) {
    .search-box {
        width: 200px;
    }

    .books-grid {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 1rem;
    }
}
</style>
