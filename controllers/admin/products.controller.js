const Product = require("../../model/products_model");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/searchHelper");

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query); 
    console.log(filterStatus);

    filterCategory = [
        {
            name: "Tất cả danh mục",
            category: "", 
        },
        {
            name: "Làm đẹp",
            category: "beauty", 
        },
        {
            name: "Điện tử",
            category: "electronics", 
        },
        {
            name: "Thời trang",
            category: "clothing", 
        },
        {
            name: "Sách",
            category: "books", 
        },
        {
            name: "Gia dụng",
            category: "house", 
        },
        {
            name: "Thể thao",
            category: "sports", 
        },
    ]
    let find = {
        deleted: false,
    };
    
    // Truy vấn danh mục sản phẩm
    if(req.query.category) {
        find.category = req.query.category;
    }
    
    // Truy vấn từ khóa tìm kiếm
    const ObjectSearch = searchHelper(req.query);
    if(ObjectSearch.regex) {
        find.title = ObjectSearch.regex;
    }
    const products = await Product.find(find);

    res.render(
        "admin/layout/default", {
            pageTitle: "Quản lý sản phẩm",
            body: "../pages/products/index",
            products: products,
            filterStatus: filterStatus,
            filterCategory: filterCategory,
            keyword: ObjectSearch.keyword,
        }
    );
}