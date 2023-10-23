const { Router } = require("express");
const ChatController = require("../controllers/ChatController");
const route = Router();



route.post("/add", ChatController.CreateChat);
route.post("/addUser", ChatController.AddUserToChat);
route.post("/send/message", ChatController.SendMessageInChat);
route.get("/all/messages", ChatController.FetchAllChat);
route.get("/getChat/:id", ChatController.FetchChatById);
route.get("/getChatByUser/:id", ChatController.FetchChatByUserId);
route.delete("/delete/message/in/chat/:id", ChatController.DeleteMessageInChat);
route.delete("/delete/user/chat/:userId", ChatController.DeleteUserFromChat);
route.put("/update/chat/name", ChatController.UpdateChat);

route.get("/all/users", ChatController.FetchUser);


module.exports = route;