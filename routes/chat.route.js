const { Router } = require("express");
const ChatController = require("../controllers/ChatController");
const route = Router();

route.post("/add", ChatController.CreateChat);

module.exports = route;
