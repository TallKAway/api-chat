const { Router } = require("express");
const ChatController = require("../controllers/ChatController");
const route = Router();
const { isAuthenticated } = require("../middlewares/auth");

// route.post("/add", isAuthenticated, ChatController.CreateChat);
route.get("/conversation/:conversationId/messages", isAuthenticated, ChatController.GetConversationMessages);
route.get("/conversation/:friendId", isAuthenticated, ChatController.GetConversation);
route.get("/conversations", isAuthenticated, ChatController.GetConversationsByUserId);
module.exports = route;
