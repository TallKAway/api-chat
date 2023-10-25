const SocketEvents = require("../constants/SocketEvents");
const {
  createMessage,
  findOrCreateDirectConversation,
} = require("../repository/ChatRepository");
const ResponseMessage = require("../constants/ResponseMessage");

async function CreateChat(req, res) {
  try {
    const { senderId, receiverId, content } = req.body;

    // Trouver ou créer la conversation
    const conversation = await findOrCreateDirectConversation(
      senderId,
      receiverId
    );

    // Insérer le message
    const message = await createMessage(senderId, conversation.id, content);

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

module.exports = {
  CreateChat,
};
