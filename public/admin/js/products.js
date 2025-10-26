/**
 * Products Management JavaScript
 * Xử lý tương tác frontend cho trang quản lý sản phẩm
 * Bao gồm: tìm kiếm, lọc, phân trang, reset filters
 */

// Chờ DOM load xong trước khi thực thi
document.addEventListener('DOMContentLoaded', function() {
    // ===== LẤY CÁC DOM ELEMENTS =====
    // Lấy các elements từ DOM để tương tác
    const searchInput = document.querySelector('input[placeholder="Nhập tên sản phẩm, SKU..."]');
    const categorySelect = document.querySelector('select[name="category"]');
    const statusSelect = document.querySelector('select[name="status"]');
    const filterButton = document.getElementById('filterBtn');
    const resetButton = document.getElementById('resetBtn');
    const productsTable = document.querySelector('.table tbody');
    const paginationContainer = document.querySelector('.pagination');

    // ===== HELPER FUNCTIONS =====
    
    /**
     * Tạo URL với các parameters hiện tại
     * @param {number} page - Số trang (optional)
     * @returns {string} - URL query string
     */
    function createUrlWithParams(page = null) {
        // Lấy giá trị từ các form inputs
        const searchTerm = searchInput ? searchInput.value : '';
        const category = categorySelect ? categorySelect.value : '';
        const status = statusSelect ? statusSelect.value : '';

        // Tạo URLSearchParams object để build query string
        const params = new URLSearchParams();
        
        // Chỉ thêm parameter nếu có giá trị (tránh URL rối)
        if (searchTerm) params.append('search', searchTerm);
        if (category) params.append('category', category);
        if (status) params.append('status', status);
        if (page) params.append('page', page);

        return params.toString();
    }

    /**
     * Thực hiện tìm kiếm và lọc sản phẩm
     * Redirect đến URL với query parameters
     */
    function performSearch() {
        const params = createUrlWithParams();
        const currentUrl = new URL(window.location);
        currentUrl.search = params;
        window.location.href = currentUrl.toString();
    }

    /**
     * Reset tất cả filters về trạng thái ban đầu
     * Clear tất cả form inputs và redirect về trang gốc
     */
    function resetFilters() {
        // Clear all form inputs
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (statusSelect) statusSelect.value = '';
        
        // Redirect về trang gốc không có parameters
        const currentUrl = new URL(window.location);
        currentUrl.search = '';
        window.location.href = currentUrl.toString();
    }

    /**
     * Kiểm tra xem có filters nào đang active không
     * @returns {boolean} - true nếu có ít nhất 1 filter active
     */
    function hasActiveFilters() {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const category = categorySelect ? categorySelect.value : '';
        const status = statusSelect ? statusSelect.value : '';
        
        return searchTerm !== '' || category !== '' || status !== '';
    }

    /**
     * Cập nhật trạng thái nút Reset
     * Disable nút khi không có filters active
     */
    function updateResetButtonState() {
        if (resetButton) {
            resetButton.disabled = !hasActiveFilters();
        }
    }

    // ===== EVENT LISTENERS =====
    
    // Event listener cho nút Filter
    if (filterButton) {
        filterButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }

    // Event listener cho nút Reset
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
        
        // Disable reset button nếu không có filters active
        resetButton.disabled = !hasActiveFilters();
    }

    // Event listener cho tìm kiếm khi nhấn Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Auto search khi thay đổi dropdown (optional)
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            updateResetButtonState();
            // Uncomment để auto search khi thay đổi category
            // performSearch();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            updateResetButtonState();
            // Uncomment để auto search khi thay đổi status
            // performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            updateResetButtonState();
        });
    }

    // Hàm để load danh sách danh mục động (nếu cần)
    function loadCategories() {
        fetch('/admin/products/api/categories')
            .then(response => response.json())
            .then(data => {
                if (data.success && categorySelect) {
                    // Clear existing options except first one
                    categorySelect.innerHTML = '<option value="">Tất cả danh mục</option>';
                    
                    // Add categories from API
                    data.data.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = category;
                        categorySelect.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading categories:', error);
            });
    }

    // Load categories on page load
    // loadCategories();

    // Hàm để tạo pagination links
    function createPaginationLinks(pagination) {
        if (!paginationContainer || !pagination) return;

        paginationContainer.innerHTML = '';

        // Previous button
        if (pagination.hasPrevPage) {
            const prevLink = document.createElement('a');
            prevLink.href = `?page=${pagination.prevPage}`;
            prevLink.className = 'page-link';
            prevLink.innerHTML = '&laquo; Trước';
            const prevLi = document.createElement('li');
            prevLi.className = 'page-item';
            prevLi.appendChild(prevLink);
            paginationContainer.appendChild(prevLi);
        }

        // Page numbers
        const startPage = Math.max(1, pagination.currentPage - 2);
        const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = `?page=${i}`;
            pageLink.className = `page-link ${i === pagination.currentPage ? 'active' : ''}`;
            pageLink.textContent = i;
            const pageLi = document.createElement('li');
            pageLi.className = 'page-item';
            pageLi.appendChild(pageLink);
            paginationContainer.appendChild(pageLi);
        }

        // Next button
        if (pagination.hasNextPage) {
            const nextLink = document.createElement('a');
            nextLink.href = `?page=${pagination.nextPage}`;
            nextLink.className = 'page-link';
            nextLink.innerHTML = 'Sau &raquo;';
            const nextLi = document.createElement('li');
            nextLi.className = 'page-item';
            nextLi.appendChild(nextLink);
            paginationContainer.appendChild(nextLi);
        }
    }

    // Hàm để format giá tiền
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Hàm để format ngày
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    // Hàm để tạo status badge
    function createStatusBadge(status) {
        const statusMap = {
            'active': { text: 'Đang bán', class: 'badge-success' },
            'inactive': { text: 'Ngừng bán', class: 'badge-secondary' },
            'out_of_stock': { text: 'Hết hàng', class: 'badge-danger' }
        };

        const statusInfo = statusMap[status] || { text: status, class: 'badge-secondary' };
        return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    // Hàm để render products table (cho AJAX updates)
    function renderProductsTable(products) {
        if (!productsTable) return;

        productsTable.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${product.thumbnail || '/images/no-image.png'}" 
                             alt="${product.title}" 
                             class="me-2" 
                             style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                            <div class="fw-bold">${product.title}</div>
                            <small class="text-muted">SKU: ${product.sku || 'N/A'}</small>
                        </div>
                    </div>
                </td>
                <td>${product.category || 'N/A'}</td>
                <td>${formatPrice(product.price || 0)}</td>
                <td>${product.stock || 0}</td>
                <td>${createStatusBadge(product.status)}</td>
                <td>${formatDate(product.meta?.createdAt || new Date())}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="editProduct('${product._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            productsTable.appendChild(row);
        });
    }

    // Global functions for product actions
    window.editProduct = function(productId) {
        // Implement edit functionality
        console.log('Edit product:', productId);
        // window.location.href = `/admin/products/edit/${productId}`;
    };

    window.deleteProduct = function(productId) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            // Implement delete functionality
            console.log('Delete product:', productId);
            // fetch(`/admin/products/delete/${productId}`, { method: 'DELETE' })
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data.success) {
            //             location.reload();
            //         } else {
            //             alert('Có lỗi xảy ra khi xóa sản phẩm');
            //         }
            //     });
        }
    };

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + R để reset filters
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (hasActiveFilters()) {
                resetFilters();
            }
        }
        
        // Ctrl + F để focus vào search input
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape để clear search input
        if (e.key === 'Escape') {
            if (document.activeElement === searchInput) {
                searchInput.value = '';
                updateResetButtonState();
            }
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize page
    console.log('Products management page initialized');
    console.log('Keyboard shortcuts: Ctrl+R (reset), Ctrl+F (search), Esc (clear search)');
});
