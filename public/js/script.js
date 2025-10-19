// Project Management - Main JavaScript
// File: /public/js/script.js
// Mô tả: JavaScript chung cho toàn bộ ứng dụng

// ===== GLOBAL UTILITIES =====

/**
 * Utility functions dùng chung cho toàn app
 */
const AppUtils = {
    /**
     * Format số tiền VND
     * @param {number} amount - Số tiền
     * @returns {string} - Chuỗi tiền đã format
     */
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    /**
     * Format ngày tháng
     * @param {Date|string} date - Ngày cần format
     * @returns {string} - Chuỗi ngày đã format
     */
    formatDate: function(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(date));
    },

    /**
     * Debounce function
     * @param {Function} func - Function cần debounce
     * @param {number} wait - Thời gian chờ (ms)
     * @returns {Function} - Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Function cần throttle
     * @param {number} limit - Thời gian giới hạn (ms)
     * @returns {Function} - Throttled function
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ===== API HELPERS =====

/**
 * API helper functions
 */
const ApiHelper = {
    /**
     * Gửi GET request
     * @param {string} url - URL endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise} - Promise response
     */
    get: async function(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        
        try {
            const response = await fetch(fullUrl);
            return await response.json();
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    },

    /**
     * Gửi POST request
     * @param {string} url - URL endpoint
     * @param {Object} data - Data to send
     * @returns {Promise} - Promise response
     */
    post: async function(url, data = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }
};

// ===== LOCAL STORAGE HELPERS =====

/**
 * Local Storage helper functions
 */
const StorageHelper = {
    /**
     * Lưu data vào localStorage
     * @param {string} key - Key
     * @param {any} value - Value
     */
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },

    /**
     * Lấy data từ localStorage
     * @param {string} key - Key
     * @param {any} defaultValue - Default value nếu không tìm thấy
     * @returns {any} - Value hoặc default value
     */
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Xóa data từ localStorage
     * @param {string} key - Key
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    }
};

// ===== INITIALIZATION =====

/**
 * Khởi tạo ứng dụng
 */
function initApp() {
    console.log('Initializing Project Management App...');
    
    // Khởi tạo các chức năng chung
    initGlobalEventListeners();
    initAppState();
    
    console.log('App initialized successfully!');
}

/**
 * Khởi tạo global event listeners
 */
function initGlobalEventListeners() {
    // Xử lý form submissions
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.classList.contains('needs-validation')) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        }
    });

    // Xử lý window resize
    window.addEventListener('resize', AppUtils.debounce(function() {
        // Có thể thêm logic xử lý resize ở đây
        console.log('Window resized');
    }, 250));

    // Xử lý beforeunload
    window.addEventListener('beforeunload', function(e) {
        // Có thể thêm logic lưu data trước khi rời trang
    });
}

/**
 * Khởi tạo app state
 */
function initAppState() {
    // Khởi tạo state từ localStorage nếu có
    const savedState = StorageHelper.get('appState', {});
    
    // Có thể khôi phục state từ đây
    console.log('App state initialized:', savedState);
}

// ===== EXPORT GLOBALS =====

// Export utilities để sử dụng global
window.AppUtils = AppUtils;
window.ApiHelper = ApiHelper;
window.StorageHelper = StorageHelper;

// Khởi tạo app khi DOM ready
document.addEventListener('DOMContentLoaded', initApp);