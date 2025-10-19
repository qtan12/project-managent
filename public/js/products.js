// Products Page JavaScript - TIKISHOP

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all product functionality
    initProductFilters();
    initProductSearch();
    initProductActions();
    initProductSorting();
    initLoadMore();
    initPagination();
});

// ===== PRODUCT FILTERS =====
function initProductFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceFromInput = document.getElementById('priceFrom');
    const priceToInput = document.getElementById('priceTo');
    const priceRangeMin = document.getElementById('priceRangeMin');
    const priceRangeMax = document.getElementById('priceRangeMax');
    const sortSelect = document.getElementById('sortBy');

    // Apply filters button
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }

    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
    }

    // Auto-apply filters on change (optional)
    const filterInputs = [categoryFilter, brandFilter, sortSelect];
    filterInputs.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    // Price inputs with debouncing
    if (priceFromInput) {
        priceFromInput.addEventListener('input', debounce(applyFilters, 500));
    }
    if (priceToInput) {
        priceToInput.addEventListener('input', debounce(applyFilters, 500));
    }

    // Price slider functionality
    initPriceSlider();
}

// ===== PRODUCT SEARCH =====
function initProductSearch() {
    const searchInput = document.getElementById('productSearch');
    const searchBtn = document.querySelector('.search-btn');
    let searchTimeout;

    if (searchInput) {
        // Real-time search with debouncing
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300);
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                applyFilters();
            });
        }

        // Enter key search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
}

// ===== PRODUCT ACTIONS =====
function initProductActions() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Wishlist toggle
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleWishlist(this);
            });
        }

        // Quick view
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showQuickView(card);
            });
        }

        // Compare
        const compareBtn = card.querySelector('.compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleCompare(card);
            });
        }

        // Add to cart
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addToCart(card);
            });
        }
    });
}

// ===== PRODUCT SORTING =====
function initProductSorting() {
    const sortSelect = document.getElementById('sortBy');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// ===== LOAD MORE =====
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreProducts();
        });
    }
}

// ===== PAGINATION =====
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.textContent.trim();
            if (page && !this.closest('.page-item').classList.contains('disabled')) {
                goToPage(page);
            }
        });
    });
}

// ===== PRICE SLIDER FUNCTIONALITY =====
function initPriceSlider() {
    const priceRangeMin = document.getElementById('priceRangeMin');
    const priceRangeMax = document.getElementById('priceRangeMax');

    if (!priceRangeMin || !priceRangeMax) return;

    // Update slider track
    function updateSliderTrack() {
        const minVal = parseInt(priceRangeMin.value);
        const maxVal = parseInt(priceRangeMax.value);
        const min = parseInt(priceRangeMin.min);
        const max = parseInt(priceRangeMin.max);
        
        const percent1 = ((minVal - min) / (max - min)) * 100;
        const percent2 = ((maxVal - min) / (max - min)) * 100;
        
        const sliderTrack = document.querySelector('.slider-track');
        if (sliderTrack) {
            sliderTrack.style.left = percent1 + '%';
            sliderTrack.style.width = (percent2 - percent1) + '%';
        }
    }

    // Event listeners for sliders
    priceRangeMin.addEventListener('input', function() {
        if (parseInt(this.value) >= parseInt(priceRangeMax.value)) {
            this.value = priceRangeMax.value - 100000;
        }
        updateSliderTrack();
        debounce(applyFilters, 300)();
    });

    priceRangeMax.addEventListener('input', function() {
        if (parseInt(this.value) <= parseInt(priceRangeMin.value)) {
            this.value = parseInt(priceRangeMin.value) + 100000;
        }
        updateSliderTrack();
        debounce(applyFilters, 300)();
    });

    // Initialize slider track
    updateSliderTrack();
}

// ===== FILTER FUNCTIONS =====
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

        // Search filter
        if (searchTerm) {
            const title = card.querySelector('.product-title a')?.textContent.toLowerCase() || '';
            const categoryText = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
            if (!title.includes(searchTerm) && !categoryText.includes(searchTerm)) {
                isVisible = false;
            }
        }

        // Category filter
        if (category && card.dataset.category !== category) {
            isVisible = false;
        }

        // Brand filter
        if (brand && card.dataset.brand !== brand) {
            isVisible = false;
        }

        // Price filter
        const productPrice = parseInt(card.dataset.price) || 0;
        if (priceFrom > 0 && productPrice < priceFrom) {
            isVisible = false;
        }
        if (priceTo < Infinity && productPrice > priceTo) {
            isVisible = false;
        }

        // Show/hide card with animation
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Apply sorting to visible products
    const sortBy = document.getElementById('sortBy')?.value || 'newest';
    if (sortBy !== 'newest') {
        sortProducts(sortBy);
    }
    
    // Update results count
    updateResultsCount(visibleCount);
    
    // Show notification
    showNotification(`Tìm thấy ${visibleCount} sản phẩm`, 'info');
}

function resetFilters() {
    // Reset all filter inputs
    document.getElementById('productSearch').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('priceRangeMin').value = '0';
    document.getElementById('priceRangeMax').value = '100000000';
    document.getElementById('sortBy').value = 'newest';
    
    // Update slider track
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        sliderTrack.style.left = '0%';
        sliderTrack.style.width = '100%';
    }
    
    // Apply filters to show all products
    applyFilters();
    
    // Show notification
    showNotification('Đã khôi phục bộ lọc', 'success');
}

function updateResultsCount(count) {
    // You can add a results counter element to show "X products found"
    console.log(`${count} products found`);
}

// ===== SORTING FUNCTIONS =====
function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid');
    const productCards = Array.from(document.querySelectorAll('.product-card:not([style*="display: none"])'));
    
    productCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return (parseInt(a.dataset.price) || 0) - (parseInt(b.dataset.price) || 0);
            case 'price-high':
                return (parseInt(b.dataset.price) || 0) - (parseInt(a.dataset.price) || 0);
            case 'rating':
                return (parseInt(b.dataset.rating) || 0) - (parseInt(a.dataset.rating) || 0);
            case 'popular':
                // Sort by rating count
                const ratingA = parseInt(a.querySelector('.rating-count')?.textContent.match(/\d+/)?.[0] || 0);
                const ratingB = parseInt(b.querySelector('.rating-count')?.textContent.match(/\d+/)?.[0] || 0);
                return ratingB - ratingA;
            case 'newest':
            default:
                // Keep original order for newest
                return 0;
        }
    });

    // Re-append sorted cards
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        productsGrid.appendChild(card);
    });
    
    // Show notification
    const sortLabels = {
        'newest': 'Mặc định',
        'price-low': 'Giá thấp đến cao',
        'price-high': 'Giá cao đến thấp',
        'rating': 'Đánh giá cao',
        'popular': 'Phổ biến'
    };
    showNotification(`Đã sắp xếp theo: ${sortLabels[sortBy] || 'Mặc định'}`, 'info');
}

// ===== ACTION FUNCTIONS =====
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

function showQuickView(card) {
    const title = card.querySelector('.product-title a')?.textContent || '';
    const price = card.querySelector('.current-price')?.textContent || '';
    const image = card.querySelector('.product-image img')?.src || '';
    
    // Create quick view modal (you can implement a proper modal)
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
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.body.removeChild(modal);
        }
    });
}

function toggleCompare(card) {
    const title = card.querySelector('.product-title a')?.textContent || '';
    showNotification(`Đã thêm "${title}" vào danh sách so sánh`, 'info');
}

function addToCart(card) {
    const title = card.querySelector('.product-title a')?.textContent || '';
    const btn = card.querySelector('.add-to-cart');
    
    // Add loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        btn.classList.add('btn-success');
        showNotification(`Đã thêm "${title}" vào giỏ hàng`, 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Thêm vào giỏ';
            btn.disabled = false;
            btn.classList.remove('btn-success');
        }, 2000);
    }, 1000);
}

// ===== LOAD MORE FUNCTIONS =====
function loadMoreProducts() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    // Add loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more products
    setTimeout(() => {
        // You would typically fetch more products from an API here
        // For demo purposes, we'll just show a message
        showNotification('Đã tải thêm sản phẩm', 'success');
        
        // Reset button
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Xem thêm sản phẩm';
        loadMoreBtn.disabled = false;
    }, 1500);
}

// ===== PAGINATION FUNCTIONS =====
function goToPage(page) {
    // You would typically make an API call here to fetch the page
    showNotification(`Chuyển đến trang ${page}`, 'info');
    
    // Update active page
    document.querySelectorAll('.pagination .page-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const targetPage = document.querySelector(`.pagination .page-link:contains("${page}")`);
    if (targetPage) {
        targetPage.closest('.page-item').classList.add('active');
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Use FastNotice library
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
        // Fallback to console if FastNotice is not available
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ===== UTILITY FUNCTIONS =====
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

// ===== CSS ANIMATIONS =====
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
