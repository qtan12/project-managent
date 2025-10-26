const Product = require("../../model/products_model");

/**
 * Controller chính để hiển thị trang quản lý sản phẩm với tính năng tìm kiếm và lọc
 * @param {Object} req - Request object chứa query parameters
 * @param {Object} res - Response object để render template
 */
module.exports.index = async (req, res) => {
    try {
        // ===== LẤY THAM SỐ TỪ QUERY STRING =====
        // Destructuring để lấy các tham số từ URL query string
        // Ví dụ: /admin/products?search=iphone&category=electronics&status=active&page=2
        const { 
            search,      // Từ khóa tìm kiếm (tên sản phẩm, SKU, mô tả)
            category,    // Danh mục sản phẩm để lọc
            status,      // Trạng thái sản phẩm (active, inactive, out_of_stock)
            page = 1,    // Trang hiện tại (mặc định là 1)
            limit = 10   // Số sản phẩm mỗi trang (mặc định là 10)
        } = req.query;
        
        // ===== XÂY DỰNG ĐIỀU KIỆN TÌM KIẾM =====
        // Tạo object điều kiện cơ bản cho MongoDB query
        // Chỉ lấy các sản phẩm chưa bị xóa (soft delete)
        let find = {
            deleted: false,  // Điều kiện cơ bản: chỉ lấy sản phẩm chưa xóa
        };

        // ===== XỬ LÝ TÌM KIẾM THEO TỪ KHÓA =====
        // Tìm kiếm trong nhiều trường: title, sku, description
        // Sử dụng $regex với $options: 'i' để tìm kiếm không phân biệt hoa thường
        if (search && search.trim() !== '') {
            find.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },        // Tìm trong tên sản phẩm
                { sku: { $regex: search.trim(), $options: 'i' } },           // Tìm trong mã SKU
                { description: { $regex: search.trim(), $options: 'i' } }  // Tìm trong mô tả
            ];
            // $or: MongoDB sẽ trả về documents thỏa mãn ÍT NHẤT MỘT trong các điều kiện
        }

        // ===== XỬ LÝ LỌC THEO DANH MỤC =====
        // Lọc sản phẩm theo danh mục cụ thể
        if (category && category.trim() !== '') {
            find.category = category;  // Exact match với danh mục
        }

        // ===== XỬ LÝ LỌC THEO TRẠNG THÁI =====
        // Lọc sản phẩm theo trạng thái: active, inactive, out_of_stock
        if (status && status.trim() !== '') {
            find.status = status;  // Exact match với trạng thái
        }

        // ===== XỬ LÝ PHÂN TRANG (PAGINATION) =====
        // Tính toán số lượng documents cần bỏ qua (skip)
        // Ví dụ: trang 3, limit 10 → skip = (3-1) * 10 = 20
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Đếm tổng số sản phẩm thỏa mãn điều kiện để tính số trang
        // countDocuments() hiệu quả hơn count() vì không load dữ liệu
        const totalProducts = await Product.countDocuments(find);
        
        // ===== THỰC HIỆN QUERY VỚI PHÂN TRANG =====
        // Lấy danh sách sản phẩm với các điều kiện:
        // - skip: bỏ qua số lượng documents đầu tiên
        // - limit: giới hạn số lượng documents trả về
        // - sort: sắp xếp theo ngày tạo mới nhất (descending)
        const products = await Product.find(find)
            .skip(skip)                                    // Bỏ qua N documents đầu tiên
            .limit(parseInt(limit))                        // Chỉ lấy N documents
            .sort({ 'meta.createdAt': -1 });               // Sắp xếp: mới nhất trước

        // ===== LẤY DANH SÁCH DANH MỤC ĐỘNG =====
        // Lấy tất cả danh mục unique từ database để hiển thị trong dropdown
        // distinct() trả về array các giá trị unique của field 'category'
        const categories = await Product.distinct('category', { deleted: false });
        
        // ===== TÍNH TOÁN THÔNG TIN PHÂN TRANG =====
        // Tính toán các thông tin cần thiết cho pagination UI
        const totalPages = Math.ceil(totalProducts / parseInt(limit));  // Tổng số trang
        const hasNextPage = page < totalPages;                          // Có trang tiếp theo?
        const hasPrevPage = page > 1;                                  // Có trang trước đó?

        // ===== HELPER FUNCTION: TẠO URL PAGINATION =====
        // Hàm helper để tạo URL cho pagination với việc giữ nguyên các filters hiện tại
        // Điều này đảm bảo khi user click pagination, các filters không bị mất
        const createPaginationUrl = (pageNum) => {
            const params = new URLSearchParams();
            
            // Chỉ thêm parameter nếu có giá trị (tránh URL rối)
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (status) params.append('status', status);
            params.append('page', pageNum);  // Luôn có page parameter
            
            return params.toString();
        };

        // ===== CHUẨN BỊ DỮ LIỆU CHO TEMPLATE =====
        // Tổng hợp tất cả dữ liệu cần thiết để render template
        const data = {
            // Dữ liệu chính
            products: products,           // Danh sách sản phẩm đã lọc và phân trang
            categories: categories,       // Danh sách danh mục cho dropdown
            
            // Thông tin pagination
            pagination: {
                currentPage: parseInt(page),                    // Trang hiện tại
                totalPages: totalPages,                        // Tổng số trang
                totalProducts: totalProducts,                  // Tổng số sản phẩm
                hasNextPage: hasNextPage,                      // Có trang tiếp theo?
                hasPrevPage: hasPrevPage,                      // Có trang trước đó?
                nextPage: hasNextPage ? parseInt(page) + 1 : null,  // Số trang tiếp theo
                prevPage: hasPrevPage ? parseInt(page) - 1 : null   // Số trang trước đó
            },
            
            // Giá trị filters hiện tại (để giữ nguyên trong form)
            filters: {
                search: search || '',      // Từ khóa tìm kiếm hiện tại
                category: category || '',   // Danh mục đang chọn
                status: status || ''        // Trạng thái đang chọn
            },
            
            // Helper function cho template
            createPaginationUrl: createPaginationUrl
        };

        // ===== LOGGING VÀ DEBUG =====
        // Log các thông tin để debug và monitor
        console.log('=== PRODUCTS CONTROLLER DEBUG ===');
        console.log('Search query:', search);
        console.log('Category filter:', category);
        console.log('Status filter:', status);
        console.log('Current page:', page);
        console.log('Items per page:', limit);
        console.log('Total products found:', totalProducts);
        console.log('Products returned:', products.length);
        console.log('Categories loaded:', categories.length);
        console.log('================================');

        // ===== RENDER TEMPLATE =====
        // Render template với tất cả dữ liệu đã chuẩn bị
        res.render("admin/layout/default", {
            pageTitle: "Quản lý sản phẩm",           // Tiêu đề trang
            body: "../pages/products/index",         // Template chính
            pageScript: "/admin/js/products.js",     // JavaScript file cho trang này
            ...data                                   // Spread tất cả dữ liệu vào template
        });

    } catch (error) {
        // ===== XỬ LÝ LỖI =====
        // Log lỗi chi tiết để debug
        console.error('=== ERROR IN PRODUCTS CONTROLLER ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Request query:', req.query);
        console.error('=====================================');

        // Render trang lỗi với thông báo thân thiện
        res.status(500).render("admin/layout/default", {
            pageTitle: "Lỗi",
            body: "../pages/products/index",
            pageScript: "/admin/js/products.js",
            products: [],                              // Danh sách rỗng
            error: "Có lỗi xảy ra khi tải danh sách sản phẩm"  // Thông báo lỗi
        });
    }
}

/**
 * API endpoint để tìm kiếm sản phẩm (cho AJAX requests)
 * Trả về JSON response thay vì render template
 * Sử dụng cho các tính năng như auto-complete, real-time search
 * 
 * @param {Object} req - Request object với query parameters
 * @param {Object} res - Response object để trả về JSON
 */
module.exports.searchProducts = async (req, res) => {
    try {
        // ===== LẤY THAM SỐ TỪ QUERY STRING =====
        // Tương tự như controller chính nhưng trả về JSON
        const { search, category, status, page = 1, limit = 10 } = req.query;
        
        // ===== XÂY DỰNG QUERY CONDITIONS =====
        // Logic tương tự như controller chính
        let find = {
            deleted: false,
        };

        // Tìm kiếm multi-field
        if (search && search.trim() !== '') {
            find.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { sku: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        // Lọc theo danh mục
        if (category && category.trim() !== '') {
            find.category = category;
        }

        // Lọc theo trạng thái
        if (status && status.trim() !== '') {
            find.status = status;
        }

        // ===== THỰC HIỆN QUERY =====
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalProducts = await Product.countDocuments(find);
        
        const products = await Product.find(find)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ 'meta.createdAt': -1 });

        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        // ===== TRẢ VỀ JSON RESPONSE =====
        // Format chuẩn cho API response
        res.json({
            success: true,                    // Flag thành công
            data: {
                products: products,           // Danh sách sản phẩm
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: totalPages,
                    totalProducts: totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        // ===== XỬ LÝ LỖI API =====
        console.error('Error in searchProducts API:', error);
        res.status(500).json({
            success: false,                  // Flag lỗi
            message: "Có lỗi xảy ra khi tìm kiếm sản phẩm"
        });
    }
}

/**
 * API endpoint để lấy danh sách danh mục
 * Trả về JSON array các danh mục unique từ database
 * Sử dụng cho việc populate dropdown categories
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object để trả về JSON
 */
module.exports.getCategories = async (req, res) => {
    try {
        // ===== LẤY DANH SÁCH DANH MỤC =====
        // distinct() trả về array các giá trị unique của field 'category'
        // Chỉ lấy danh mục của sản phẩm chưa bị xóa
        const categories = await Product.distinct('category', { deleted: false });
        
        // ===== TRẢ VỀ JSON RESPONSE =====
        res.json({
            success: true,                    // Flag thành công
            data: categories                  // Array các danh mục
        });

    } catch (error) {
        // ===== XỬ LÝ LỖI API =====
        console.error('Error in getCategories API:', error);
        res.status(500).json({
            success: false,                  // Flag lỗi
            message: "Có lỗi xảy ra khi lấy danh sách danh mục"
        });
    }
}