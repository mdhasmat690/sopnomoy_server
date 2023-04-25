const express = require("express");
const chatController = require("../../controllers/chat");

const router = express.Router();

router.get("/get", chatController.index);
router.post("/", chatController.create);

module.exports = router;
