module.exports.index = (req, res) => {
    res.render("client/pages/home/index", {
        pageTitle: "Title trang chủ",
    });
}