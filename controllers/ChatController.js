const SocketEvents = require("../constants/SocketEvents");
const {
  createMessage,
  findOrCreateDirectConversation,
  getConversation,
  getConversationMessagesById,
  getConversationsByUserId
} = require("../repository/ChatRepository");
const ResponseMessage = require("../constants/ResponseMessage");

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
    const conversation = await findOrCreateDirectConversation(userId, req.params.friendId);

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

async function GetConversationMessages(req, res) {
  try {
    const id = req.params.conversationId;
    
    const messages = await getConversationMessagesById(id);

    return res.status(200).json({
      status: ResponseMessage.NO_MSG,
      message: "conversation messages retrieved successfully",
      data: messages,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving conversation messages" });
  }
}

async function GetConversationsByUserId(req, res) {
  try {
    const userId = req.payload.userId;
    
    const conversations = await getConversationsByUserId(userId);

    const filteredConversations = conversations.map((conversation) => {
      const friendId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
      return {
        id: conversation.id,
        friendId: friendId,
        createdAt: conversation.createdAt
      };
    });

    return res.status(200).json({
      status: ResponseMessage.NO_MSG,
      message: "conversations retrieved successfully",
      data: filteredConversations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving conversations" });
  }
}

module.exports = {
  CreateChat,
  GetConversation,
  GetConversationMessages,
  GetConversationsByUserId
};
