const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/products.controller');

router.get("/", controller.index);     // đi vào hàm index

module.exports = router;