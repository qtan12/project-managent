// filter và search

//Select trạng thái
const selectStatusElement = document.querySelector("[data-filter='status']");
if(selectStatusElement) {
    let url = new URL(window.location.href);
        
    // Thiết lập giá trị ban đầu từ URL parameters
    const statusFromUrl = url.searchParams.get("status");
    if(statusFromUrl) {
        selectStatusElement.value = statusFromUrl;
    }

    selectStatusElement.addEventListener("change", () => {
        const status = selectStatusElement.value
        // cập nhật url với status
        if(status) {
            url.searchParams.set("status", status)
        } else {
            url.searchParams.delete("status")
        }
        // chuyển hướng
        window.location.href = url.href
    })
}

// Select danh mục
const selectCategoryElement = document.querySelector("[data-filter='category']");
if(selectCategoryElement) {
    let url = new URL(window.location.href);
        
    // Thiết lập giá trị ban đầu từ URL parameters
    const categoryFromUrl = url.searchParams.get("category");
    if(categoryFromUrl) {
        selectCategoryElement.value = categoryFromUrl;
    }

    selectCategoryElement.addEventListener("change", () => {
        const category = selectCategoryElement.value
        // cập nhật url với category
        if(category) {
            url.searchParams.set("category", category)
        } else {
            url.searchParams.delete("category")
        }
        // chuyển hướng
        window.location.href = url.href
    })
}

// form search
const formSearch = document.querySelector("#form-search")
if(formSearch){
    let url = new URL(window.location.href);
    
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if(keyword){
            url.searchParams.set("keyword", keyword)
        } else {
            url.searchParams.delete("keyword")
        }
        // chuyển hướng
        window.location.href = url.href
    })
}
