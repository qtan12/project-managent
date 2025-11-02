// JavaScript cho Trang Sản Phẩm - TIKISHOP

// Đợi trang web tải xong hoàn toàn trước khi thực thi code
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tất cả các chức năng sản phẩm
    initProductFilters();      // Khởi tạo bộ lọc sản phẩm
    initProductSearch();       // Khởi tạo tìm kiếm sản phẩm
    initProductActions();      // Khởi tạo các hành động sản phẩm (wishlist, cart, ...)
    initProductSorting();      // Khởi tạo sắp xếp sản phẩm
    initLoadMore();            // Khởi tạo nút "Xem thêm"
    initPagination();          // Khởi tạo phân trang
});

// ===== BỘ LỌC SẢN PHẨM =====
function initProductFilters() {
    // Lấy các phần tử HTML liên quan đến bộ lọc
    const applyFiltersBtn = document.getElementById('applyFilters');     // Nút áp dụng bộ lọc
    const resetFiltersBtn = document.getElementById('resetFilters');     // Nút đặt lại bộ lọc
    const categoryFilter = document.getElementById('categoryFilter');    // Dropdown lọc danh mục
    const brandFilter = document.getElementById('brandFilter');          // Dropdown lọc thương hiệu
    const priceFromInput = document.getElementById('priceFrom');         // Input giá từ
    const priceToInput = document.getElementById('priceTo');             // Input giá đến
    const priceRangeMin = document.getElementById('priceRangeMin');      // Slider giá tối thiểu
    const priceRangeMax = document.getElementById('priceRangeMax');      // Slider giá tối đa
    const sortSelect = document.getElementById('sortBy');                // Dropdown sắp xếp

    // Thêm sự kiện cho nút áp dụng bộ lọc
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters(); // Gọi hàm áp dụng bộ lọc
        });
    }

    // Thêm sự kiện cho nút đặt lại bộ lọc
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters(); // Gọi hàm đặt lại bộ lọc
        });
    }

    // Tự động áp dụng bộ lọc khi thay đổi dropdown (tùy chọn)
    const filterInputs = [categoryFilter, brandFilter, sortSelect];
    filterInputs.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters); // Áp dụng khi có thay đổi
        }
    });

    // Thêm sự kiện cho input giá với debounce (tránh gọi quá nhiều lần)
    if (priceFromInput) {
        priceFromInput.addEventListener('input', debounce(applyFilters, 500)); // Đợi 500ms sau khi người dùng ngừng gõ
    }
    if (priceToInput) {
        priceToInput.addEventListener('input', debounce(applyFilters, 500));
    }

    // Khởi tạo thanh trượt giá
    initPriceSlider();
}

// ===== TÌM KIẾM SẢN PHẨM =====
function initProductSearch() {
    const searchInput = document.getElementById('productSearch'); // Ô nhập tìm kiếm
    const searchBtn = document.querySelector('.search-btn');      // Nút tìm kiếm
    let searchTimeout; // Biến lưu timeout để debounce

    if (searchInput) {
        // Tìm kiếm theo thời gian thực với debounce (tránh gọi API quá nhiều)
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);        // Xóa timeout cũ
            searchTimeout = setTimeout(() => {   // Tạo timeout mới
                applyFilters(); // Sau 300ms mới gọi hàm lọc
            }, 300);
        });

        // Xử lý khi click nút tìm kiếm
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                applyFilters(); // Áp dụng bộ lọc
            });
        }

        // Xử lý khi nhấn phím Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Ngăn form submit (nếu có)
                applyFilters(); // Áp dụng bộ lọc
            }
        });
    }
}

// ===== CÁC HÀNH ĐỘNG SẢN PHẨM =====
function initProductActions() {
    const productCards = document.querySelectorAll('.product-card'); // Lấy tất cả thẻ sản phẩm

    // Duyệt qua từng thẻ sản phẩm và thêm các sự kiện
    productCards.forEach(card => {
        // Nút yêu thích (wishlist)
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();        // Ngăn hành vi mặc định
                toggleWishlist(this);      // Gọi hàm bật/tắt wishlist
            });
        }

        // Nút xem nhanh
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function(e) {
                e.preventDefault();        // Ngăn hành vi mặc định
                showQuickView(card);       // Hiển thị modal xem nhanh
            });
        }

        // Nút so sánh sản phẩm
        const compareBtn = card.querySelector('.compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();        // Ngăn hành vi mặc định
                toggleCompare(card);       // Thêm vào danh sách so sánh
            });
        }

        // Nút thêm vào giỏ hàng
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();        // Ngăn hành vi mặc định
                addToCart(card);           // Thêm sản phẩm vào giỏ hàng
            });
        }
    });
}

// ===== SẮP XẾP SẢN PHẨM =====
function initProductSorting() {
    const sortSelect = document.getElementById('sortBy'); // Lấy dropdown sắp xếp
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value); // Gọi hàm sắp xếp khi thay đổi
        });
    }
}

// ===== XEM THÊM SẢN PHẨM =====
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn'); // Lấy nút "Xem thêm"
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreProducts(); // Gọi hàm tải thêm sản phẩm
        });
    }
}

// ===== PHÂN TRANG =====
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-link'); // Lấy tất cả link phân trang
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn chuyển trang mặc định
            const page = this.textContent.trim(); // Lấy số trang
            // Chỉ thực hiện nếu trang tồn tại và không bị disabled
            if (page && !this.closest('.page-item').classList.contains('disabled')) {
                goToPage(page); // Chuyển đến trang đó
            }
        });
    });
}

// ===== CHỨC NĂNG THANH TRƯỢT GIÁ =====
function initPriceSlider() {
    const priceRangeMin = document.getElementById('priceRangeMin'); // Input giá tối thiểu
    const priceRangeMax = document.getElementById('priceRangeMax'); // Input giá tối đa

    if (!priceRangeMin || !priceRangeMax) return; // Thoát nếu không tìm thấy

    // Cập nhật thanh track của slider
    function updateSliderTrack() {
        const minVal = parseInt(priceRangeMin.value); // Giá trị tối thiểu hiện tại
        const maxVal = parseInt(priceRangeMax.value); // Giá trị tối đa hiện tại
        const min = parseInt(priceRangeMin.min);     // Giá trị tối thiểu cho phép
        const max = parseInt(priceRangeMin.max);     // Giá trị tối đa cho phép
        
        // Tính phần trăm vị trí thanh track
        const percent1 = ((minVal - min) / (max - min)) * 100;
        const percent2 = ((maxVal - min) / (max - min)) * 100;
        
        const sliderTrack = document.querySelector('.slider-track');
        if (sliderTrack) {
            sliderTrack.style.left = percent1 + '%';    // Vị trí bắt đầu
            sliderTrack.style.width = (percent2 - percent1) + '%'; // Chiều rộng
        }
    }

    // Sự kiện cho slider giá tối thiểu
    priceRangeMin.addEventListener('input', function() {
        // Đảm bảo giá min không lớn hơn giá max
        if (parseInt(this.value) >= parseInt(priceRangeMax.value)) {
            this.value = priceRangeMax.value - 100000;
        }
        updateSliderTrack(); // Cập nhật thanh track
        debounce(applyFilters, 300)(); // Áp dụng bộ lọc
    });

    // Sự kiện cho slider giá tối đa
    priceRangeMax.addEventListener('input', function() {
        // Đảm bảo giá max không nhỏ hơn giá min
        if (parseInt(this.value) <= parseInt(priceRangeMin.value)) {
            this.value = parseInt(priceRangeMin.value) + 100000;
        }
        updateSliderTrack(); // Cập nhật thanh track
        debounce(applyFilters, 300)(); // Áp dụng bộ lọc
    });

    // Khởi tạo thanh track
    updateSliderTrack();
}

// ===== CÁC HÀM BỘ LỌC =====
function applyFilters() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const brand = document.getElementById('brandFilter')?.value || '';
    const priceFrom = parseInt(document.getElementById('priceRangeMin')?.value) || 0;
    const priceTo = parseInt(document.getElementById('priceRangeMax')?.value) || Infinity;
    
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    productCards.forEach(card => {
        let isVisible = true;

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const title = card.querySelector('.product-title a')?.textContent.toLowerCase() || '';
            const categoryText = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
            if (!title.includes(searchTerm) && !categoryText.includes(searchTerm)) {
                isVisible = false;
            }
        }

        // Lọc theo danh mục
        if (category && card.dataset.category !== category) {
            isVisible = false;
        }

        // Lọc theo thương hiệu
        if (brand && card.dataset.brand !== brand) {
            isVisible = false;
        }

        // Lọc theo giá
        const productPrice = parseInt(card.dataset.price) || 0;
        if (priceFrom > 0 && productPrice < priceFrom) {
            isVisible = false;
        }
        if (priceTo < Infinity && productPrice > priceTo) {
            isVisible = false;
        }

        // Hiện/ẩn card với hiệu ứng
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Áp dụng sắp xếp cho các sản phẩm hiển thị
    const sortBy = document.getElementById('sortBy')?.value || 'newest';
    if (sortBy !== 'newest') {
        sortProducts(sortBy);
    }
    
    // Cập nhật số lượng kết quả
    updateResultsCount(visibleCount);
    
    // Show notification
    showNotification(`Tìm thấy ${visibleCount} sản phẩm`, 'info');
}

// Đặt lại tất cả bộ lọc về mặc định
function resetFilters() {
    // Reset all filter inputs - Đặt lại tất cả input bộ lọc
    document.getElementById('productSearch').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('priceRangeMin').value = '0';
    document.getElementById('priceRangeMax').value = '100000000';
    document.getElementById('sortBy').value = 'newest';
    
    // Cập nhật thanh track của slider
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        sliderTrack.style.left = '0%';
        sliderTrack.style.width = '100%';
    }
    
    // Áp dụng bộ lọc để hiển thị tất cả sản phẩm
    applyFilters();
    
    // Show notification
    showNotification('Đã khôi phục bộ lọc', 'success');
}

// Cập nhật số lượng kết quả (có thể thêm UI để hiển thị)
function updateResultsCount(count) {
    // Bạn có thể thêm element hiển thị "X sản phẩm được tìm thấy"
    console.log(`${count} products found`);
}

// ===== CÁC HÀM SẮP XẾP =====
// Sắp xếp sản phẩm theo tiêu chí
function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid'); // Grid chứa sản phẩm
    const productCards = Array.from(document.querySelectorAll('.product-card:not([style*="display: none"])')); // Chỉ lấy sản phẩm đang hiển thị
    
    productCards.sort((a, b) => { // Sắp xếp array
        switch (sortBy) {
            case 'price-low':
                return (parseInt(a.dataset.price) || 0) - (parseInt(b.dataset.price) || 0);
            case 'price-high':
                return (parseInt(b.dataset.price) || 0) - (parseInt(a.dataset.price) || 0);
            case 'rating':
                return (parseInt(b.dataset.rating) || 0) - (parseInt(a.dataset.rating) || 0);
            case 'popular':
                // Sắp xếp theo số lượng đánh giá
                const ratingA = parseInt(a.querySelector('.rating-count')?.textContent.match(/\d+/)?.[0] || 0);
                const ratingB = parseInt(b.querySelector('.rating-count')?.textContent.match(/\d+/)?.[0] || 0);
                return ratingB - ratingA;
            case 'newest':
            default:
                // Giữ nguyên thứ tự ban đầu cho sản phẩm mới nhất
                return 0;
        }
    });

    // Thêm lại các card đã sắp xếp
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`; // Hiệu ứng xuất hiện từng cái
        productsGrid.appendChild(card); // Thêm card vào grid
    });
    
    // Hiển thị thông báo
    const sortLabels = {
        'newest': 'Mặc định',
        'price-low': 'Giá thấp đến cao',
        'price-high': 'Giá cao đến thấp',
        'rating': 'Đánh giá cao',
        'popular': 'Phổ biến'
    };
    showNotification(`Đã sắp xếp theo: ${sortLabels[sortBy] || 'Mặc định'}`, 'info');
}

// ===== CÁC HÀM HÀNH ĐỘNG =====
// Bật/tắt yêu thích sản phẩm
function toggleWishlist(btn) {
    const icon = btn.querySelector('i');
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
        btn.classList.remove('active');
        icon.className = 'far fa-heart';
        showNotification('Đã xóa khỏi danh sách yêu thích', 'info');
    } else {
        btn.classList.add('active');
        icon.className = 'fas fa-heart';
        showNotification('Đã thêm vào danh sách yêu thích', 'success');
    }
}

// Hiển thị modal xem nhanh sản phẩm
function showQuickView(card) {
    const title = card.querySelector('.product-title a')?.textContent || '';
    const price = card.querySelector('.current-price')?.textContent || '';
    const image = card.querySelector('.product-image img')?.src || '';
    
    // Tạo modal xem nhanh (bạn có thể triển khai modal đầy đủ hơn)
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Xem nhanh sản phẩm</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="${image}" alt="${title}" style="width: 100%; max-width: 300px; height: auto;">
                    <h4>${title}</h4>
                    <p class="price">${price}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal); // Thêm modal vào body
    
    // Chức năng đóng modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.body.removeChild(modal);
        }
    });
}

// Thêm sản phẩm vào danh sách so sánh
function toggleCompare(card) {
    const title = card.querySelector('.product-title a')?.textContent || '';
    showNotification(`Đã thêm "${title}" vào danh sách so sánh`, 'info');
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(card) {
    const title = card.querySelector('.product-title a')?.textContent || '';
    const btn = card.querySelector('.add-to-cart');
    
    // Thêm trạng thái loading
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
    btn.disabled = true;
    
    // Giả lập gọi API (trong thực tế sẽ gọi API thật)
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        btn.classList.add('btn-success');
        showNotification(`Đã thêm "${title}" vào giỏ hàng`, 'success');
        
        // Đặt lại nút sau 2 giây
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Thêm vào giỏ';
            btn.disabled = false;
            btn.classList.remove('btn-success');
        }, 2000);
    }, 1000);
}

// ===== CÁC HÀM XEM THÊM =====
function loadMoreProducts() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    // Thêm trạng thái loading
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
    loadMoreBtn.disabled = true;
    
    // Giả lập tải thêm sản phẩm
    setTimeout(() => {
        // Trong thực tế bạn sẽ gọi API để lấy thêm sản phẩm ở đây
        // Để demo, chúng ta chỉ hiển thị thông báo
        showNotification('Đã tải thêm sản phẩm', 'success');
        
        // Đặt lại nút
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Xem thêm sản phẩm';
        loadMoreBtn.disabled = false;
    }, 1500);
}

// ===== CÁC HÀM PHÂN TRANG =====
// Chuyển đến trang chỉ định
function goToPage(page) {
    // Trong thực tế bạn sẽ gọi API để lấy dữ liệu trang ở đây
    showNotification(`Chuyển đến trang ${page}`, 'info');
    
    // Cập nhật trang đang active
    document.querySelectorAll('.pagination .page-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const targetPage = document.querySelector(`.pagination .page-link:contains("${page}")`);
    if (targetPage) {
        targetPage.closest('.page-item').classList.add('active');
    }
}

// ===== HỆ THỐNG THÔNG BÁO =====
// Hiển thị thông báo cho người dùng
function showNotification(message, type = 'info') {
    // Sử dụng thư viện FastNotice
    if (typeof FastNotice !== 'undefined') {
        switch (type) {
            case 'success':
                FastNotice.success(message, { duration: 3000 });
                break;
            case 'error':
                FastNotice.error(message, { duration: 4000 });
                break;
            case 'warning':
                FastNotice.warning(message, { duration: 3500 });
                break;
            case 'info':
            default:
                FastNotice.info(message, { duration: 3000 });
                break;
        }
    } else {
        // Dự phòng: log ra console nếu FastNotice không khả dụng
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ===== CÁC HÀM TIỆN ÍCH =====
// Debounce: giới hạn số lần gọi hàm trong một khoảng thời gian
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== CSS HIỆU ỨNG =====
const style = document.createElement('style');
style.textContent = `
    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        padding: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e8eaed;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #5f6368;
    }
`;
document.head.appendChild(style);
