const mongoose = require("mongoose");

//hàm connect to database
module.exports.connect = async () => {
    try {
      await  mongoose.connect(process.env.MONGO_URL); //connect to database
      console.log("Connect successfully to MongoDB"); //giải thích: hiển thị khi connect to database thành công
    }catch(error) {
        console.log("Error connect to MongoDB", error); //giải thích: hiển thị lỗi khi connect to database
        process.exit(1); //giải thích: thoát ra khỏi ứng dụng với mã lỗi 1
    }
}
