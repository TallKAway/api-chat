const { Router } = require("express");
const ChatController = require("../controllers/ChatController");
const route = Router();

route.post("/add", ChatController.CreateChat);
route.get("/conversation", ChatController.GetConversation);
route.get("/conversation/:id", ChatController.GetConversationById)

module.exports = route;
