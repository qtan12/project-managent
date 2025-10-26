// get
module.exports.dashboard = (req, res) => {
    res.render(
        "admin/layout/default", {
            pageTitle: "Tổng quan hệ thống - Admin Ecommerce",
            body: "../pages/dashboard/index"
        }
    );
}