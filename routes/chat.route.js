const { Router } = require("express");
const ChatController = require("../controllers/ChatController");
const route = Router();
const { isAuthenticated } = require("../middlewares/auth");

route.post("/add", isAuthenticated, ChatController.CreateChat);
route.get("/conversation", isAuthenticated, ChatController.GetConversation);
route.get(
  "/conversation/:id",
  isAuthenticated,
  ChatController.GetConversationById
);

module.exports = route;
