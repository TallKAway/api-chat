const { Router } = require("express");
const ChatController = require("../controllers/ChatController");
const route = Router();

route.post("/add", ChatController.CreateChat);
route.get("/conversation", ChatController.GetConversation);

module.exports = route;
