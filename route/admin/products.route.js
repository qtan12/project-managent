/**
 * Routes cho quản lý sản phẩm admin
 * Định nghĩa các endpoints cho trang quản lý sản phẩm
 */

const express = require('express');
const router = express.Router();

// Import controller để xử lý logic
const controller = require('../../controllers/admin/products.controller');

// ===== ROUTES CHÍNH =====

/**
 * GET /admin/products/
 * Route chính để hiển thị trang quản lý sản phẩm
 * Hỗ trợ query parameters: search, category, status, page
 * Ví dụ: /admin/products?search=iphone&category=electronics&page=2
 */
router.get("/", controller.index);

// ===== API ROUTES =====

/**
 * GET /admin/products/api/search
 * API endpoint để tìm kiếm sản phẩm (cho AJAX requests)
 * Trả về JSON response với danh sách sản phẩm và pagination info
 * Sử dụng cho real-time search, auto-complete features
 */
router.get("/api/search", controller.searchProducts);

/**
 * GET /admin/products/api/categories
 * API endpoint để lấy danh sách danh mục
 * Trả về JSON array các danh mục unique từ database
 * Sử dụng để populate dropdown categories động
 */
router.get("/api/categories", controller.getCategories);

// Export router để sử dụng trong app chính
module.exports = router;