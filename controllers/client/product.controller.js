const Product = require("../../model/products_model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    });
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(1 - item.discountPercentage/100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        return item;

    })

    console.log(newProducts);
    // First render the page content, then inject into the layout as `main`
    res.render(
        "client/pages/products/index",
        {
            pageTitle: "Title sản phẩm",
            products: newProducts, // truyền dữ liệu sang view
        },
        (err, html) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.render("client/layout/default", {
                pageTitle: "Title sản phẩm",
                main: html,
            });
        }
    );
}
