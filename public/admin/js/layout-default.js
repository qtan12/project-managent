        // Chức năng sidebar responsive - tự động điều chỉnh theo kích thước màn hình
        const sidebar = document.getElementById('sidebar'); // Lấy phần tử sidebar
        const sidebarToggle = document.getElementById('sidebarToggle'); // Nút toggle để đóng/mở sidebar
        const mainContent = document.querySelector('.main-content'); // Nội dung chính của trang
        
        // Tạo lớp phủ (overlay) cho sidebar trên mobile
        const sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
        
        // Kiểm tra xem có phải thiết bị mobile không (màn hình ≤ 768px)
        function isMobile() {
            return window.innerWidth <= 768;
        }
        
        // Kiểm tra xem có phải thiết bị tablet không (màn hình 769px - 1023px)
        function isTablet() {
            return window.innerWidth > 769 && window.innerWidth <= 1023;
        }
        
        // Kiểm tra xem có phải thiết bị desktop không (màn hình > 1023px)
        function isDesktop() {
            return window.innerWidth > 1023;
        }
        
        // Hàm đóng/mở sidebar - hành vi khác nhau tùy theo loại thiết bị
        function toggleSidebar() {
            if (isMobile()) {
                // Hành vi trên mobile: hiện/ẩn với lớp phủ (overlay)
                sidebar.classList.toggle('show');
                sidebarOverlay.classList.toggle('show');
                document.body.classList.toggle('sidebar-open');
            } else if (isTablet()) {
                // Hành vi trên tablet: hiện/ẩn với lớp phủ (giống mobile)
                sidebar.classList.toggle('show');
                sidebarOverlay.classList.toggle('show');
                document.body.classList.toggle('sidebar-open');
            } else {
                // Hành vi trên desktop: thu gọn/mở rộng tại chỗ
                sidebar.classList.toggle('collapsed');
            }
        }
        
        // Đóng sidebar trên mobile/tablet khi click vào lớp phủ
        sidebarOverlay.addEventListener('click', function() {
            if (isMobile() || isTablet()) {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        // Đóng sidebar khi click vào các liên kết điều hướng trên mobile/tablet
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMobile() || isTablet()) {
                    sidebar.classList.remove('show');
                    sidebarOverlay.classList.remove('show');
                    document.body.classList.remove('sidebar-open');
                }
            });
        });
        
        // Xử lý khi thay đổi kích thước cửa sổ trình duyệt
        window.addEventListener('resize', function() {
            if (isMobile() || isTablet()) {
                // Đặt lại trạng thái desktop khi chuyển sang mobile/tablet
                sidebar.classList.remove('collapsed');
            } else {
                // Đặt lại trạng thái mobile/tablet khi chuyển sang desktop
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        // Lắng nghe sự kiện click vào nút toggle sidebar
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        // Đặt trạng thái active cho mục điều hướng hiện tại
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
        
        // Khởi tạo trạng thái sidebar dựa trên kích thước màn hình
        if (isMobile() || isTablet()) {
            sidebar.classList.remove('collapsed');
        }