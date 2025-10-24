// Header JavaScript - Tiki.vn Style Header
// File: /public/js/header.js
// Mô tả: Xử lý tất cả logic JavaScript cho header

// ===== MOBILE BOTTOM MENU FUNCTIONALITY =====

/**
 * Quản lý trạng thái active của bottom menu
 * Tự động highlight menu item của trang hiện tại
 */
function initBottomMenuActiveState() {
    const bottomMenuLinks = document.querySelectorAll('.bottom-menu-link');
    const currentPath = window.location.pathname;
    
    bottomMenuLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Xóa class active khỏi tất cả links
        link.classList.remove('active');
        
        // Thêm class active cho trang hiện tại
        if (href === currentPath || (href === '/' && currentPath === '/')) {
            link.classList.add('active');
        }
    });
}

/**
 * Xử lý sự kiện click cho bottom menu
 * Thêm hiệu ứng visual feedback
 */
function initBottomMenuClickHandlers() {
    const bottomMenuLinks = document.querySelectorAll('.bottom-menu-link');
    
    bottomMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Thêm hiệu ứng ripple effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Cập nhật active state
            bottomMenuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== SEARCH FUNCTIONALITY =====

/**
 * Khởi tạo chức năng tìm kiếm
 * Xử lý cả search button và Enter key
 */
function initSearchFunctionality() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchBtn || !searchInput) return;
    
    // Xử lý click search button
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleSearch();
    });
    
    // Xử lý Enter key trong search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
    
    // Xử lý focus/blur cho search input
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.borderColor = '#1a73e8';
        this.parentElement.style.boxShadow = '0 0 0 2px rgba(26, 115, 232, 0.2)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '#dadce0';
        this.parentElement.style.boxShadow = 'none';
    });
}

/**
 * Xử lý logic tìm kiếm
 * Redirect đến trang search results
 */
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // Hiển thị loading state
        const searchBtn = document.querySelector('.search-btn');
        const originalText = searchBtn.textContent;
        searchBtn.textContent = 'Đang tìm...';
        searchBtn.disabled = true;
        
        // Redirect đến trang search
        setTimeout(() => {
            window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
        }, 500);
    } else {
        // Focus vào search input nếu empty
        searchInput.focus();
        showNotification('Vui lòng nhập từ khóa tìm kiếm', 'warning');
    }
}

// ===== CART FUNCTIONALITY =====

/**
 * Khởi tạo chức năng giỏ hàng
 * Xử lý click cart và update badge
 */
function initCartFunctionality() {
    const cartLinks = document.querySelectorAll('.cart-link, .bottom-menu-link[href*="cart"]');
    
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Thêm hiệu ứng bounce
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Có thể thêm logic mở cart drawer ở đây
            console.log('Cart clicked');
        });
    });
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {number} count - Số lượng sản phẩm
 */
function updateCartBadge(count) {
    const cartBadges = document.querySelectorAll('.cart-badge, .bottom-menu-badge');
    
    cartBadges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
        
        // Thêm animation khi update
        badge.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            badge.style.animation = '';
        }, 500);
    });
}

// ===== MOBILE MENU TOGGLE =====

/**
 * Khởi tạo mobile menu toggle (nếu có)
 * Xử lý hamburger menu cho mobile
 */
function initMobileMenuToggle() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        
        // Thêm hiệu ứng cho hamburger icon
        this.classList.toggle('active');
        
        // Prevent body scroll khi menu mở
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Đóng menu khi click outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SMOOTH SCROLL =====

/**
 * Khởi tạo smooth scroll cho anchor links
 * Xử lý scroll mượt mà khi click vào links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== BUTTON LOADING STATES =====

/**
 * Khởi tạo loading states cho buttons
 * Thêm hiệu ứng loading khi click buttons
 */
function initButtonLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit' || this.classList.contains('btn-primary')) {
                // Thêm loading state
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                const originalText = this.textContent;
                this.textContent = 'Đang xử lý...';
                
                // Reset sau 2 giây
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                    this.textContent = originalText;
                }, 2000);
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Hiển thị notification
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Tạo notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove sau 5 giây
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Lấy icon cho notification type
 * @param {string} type - Loại notification
 * @returns {string} - Tên icon
 */
function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Debounce function để tối ưu performance
 * @param {Function} func - Function cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function} - Debounced function
 */
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

// ===== INITIALIZATION =====

/**
 * Khởi tạo tất cả chức năng header
 * Chạy khi DOM đã load xong
 */
function initHeader() {
    console.log('Initializing Tiki Header...');
    
    // Khởi tạo các chức năng
    initBottomMenuActiveState();
    initBottomMenuClickHandlers();
    initSearchFunctionality();
    initCartFunctionality();
    initMobileMenuToggle();
    initSmoothScroll();
    initButtonLoadingStates();
    
    // Cập nhật cart badge (có thể từ localStorage hoặc API)
    const cartCount = localStorage.getItem('cartCount') || 0;
    updateCartBadge(parseInt(cartCount));
    
    console.log('Tiki Header initialized successfully!');
}

// ===== EVENT LISTENERS =====

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', initHeader);

// Khởi tạo lại khi có thay đổi route (cho SPA)
window.addEventListener('popstate', function() {
    initBottomMenuActiveState();
});
// ===== EXPORT FUNCTIONS =====

// Export các functions để sử dụng global
window.TikiHeader = {
    init: initHeader,
    updateCartBadge: updateCartBadge,
    showNotification: showNotification,
    handleSearch: handleSearch
};

