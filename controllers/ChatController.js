const SocketEvents = require("../constants/SocketEvents");
const {
  createMessage,
  findOrCreateDirectConversation,
  getConversation,
  getConversationById,
} = require("../repository/ChatRepository");
const ResponseMessage = require("../constants/ResponseMessage");
const { get } = require("mongoose");

async function CreateChat(req, res) {
  try {
    const userId = req.payload.userId;

    const { receiverId, content } = req.body;

    const conversation = await findOrCreateDirectConversation(
      userId,
      receiverId
    );

    const message = await createMessage(userId, conversation.id, content);

    return res.status(201).json({
      status: ResponseMessage.MSG_300,
      message: "chat created successfully",
      data: {
        conversation: conversation,
        message: message,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la création du message." });
  }
}

async function GetConversation(req, res) {
  try {
    const userId = req.payload.userId;

    const { receiverId } = req.body;

    const conversation = await getConversation(userId, receiverId);

    return res.status(200).json({
      status: ResponseMessage.NO_MSG,
      message: "conversation retrieved successfully",
      data: conversation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving conversation" });
  }
}

async function GetConversationById(req, res) {
  try {
    const { id } = req.params;

    const messages = await getConversationById(id);

    return res.status(200).json({
      status: ResponseMessage.NO_MSG,
      message: "conversation retrieved successfully",
      data: messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving conversation" });
  }
}

module.exports = {
  CreateChat,
  GetConversation,
  GetConversationById,
};
