module.exports.index = (req, res) => {
    res.render(
        "client/pages/home/index",
        {
            pageTitle: "Title trang chủ",
        },
        (err, html) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.render("client/layout/default", {
                pageTitle: "Title trang chủ",
                main: html,
            });
        }
    );
}