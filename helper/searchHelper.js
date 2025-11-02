module.exports = (query) => {
    let ObjectSearch = {
        keyword: "",
    };
    
    // Truy vấn từ khóa tìm kiếm
    if(query.keyword) {
        ObjectSearch.keyword = query.keyword.trim();
        const regex = new RegExp(ObjectSearch.keyword, "i");
        ObjectSearch.regex = regex;
    }
    return ObjectSearch;
}