module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả trạng thái",
            status: "", 
        },
        {
            name: "Đang bán",
            status: "active", 
        },
        {
            name: "Ngừng bán",
            status: "inactive", 
        },
        {
            name: "Hết hàng",
            status: "out_of_stock", 
        },
    ];

    // Truy vấn trạng thái sản phẩm
    if(query.status) {
        const index = filterStatus.findIndex(item => item.status === query.status);
        filterStatus[index].class = "active";
    } else{
        const index = filterStatus.findIndex(item => item.status === "");
        filterStatus[index].class = "active";   
    }
    return filterStatus;
}