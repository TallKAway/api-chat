const SocketEvents = require("../constants/SocketEvents");
const {
  createMessage,
  findOrCreateDirectConversation,
  getConversation,
  getConversationMessagesById,
  getConversationsByUserId
} = require("../repository/ChatRepository");
const ResponseMessage = require("../constants/ResponseMessage");


/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints for chat
 */


/**
 * @swagger
 * /conversation/{friendId}:
 *   get:
 *     tags: [Chat]
 *     description: Get conversation by friend ID
 *     parameters:
 *       - in: header 
  *         name: Authorization
  *         schema:
  *          type: string
  *          format: jwt
  *         description: JWT token
  *         required: true
 *       - in: payload
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
  *       - in: path
  *         name: friendId  
  *         schema: 
  *          type: string
  * 
 *     responses:
 *       '201':
 *         description: Get conversation by friend ID
 *       '400':
 *         description: Bad request 
 */
async function GetConversation(req, res) {

  try {
    
    const { userId } = req.payload;
    
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


/**
 * @swagger
 * /conversation/{conversationId}/messages:
 *   get:
 *     tags: [Conversation]
 *     description: Get messages by conversation ID
 *     parameters:
 *       - in: header 
  *         name: Authorization
  *         schema:
  *          type: string
  *          format: jwt
  *         description: JWT token
  *         required: true
 *       - in: payload
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
  *       - in: path
  *         name: conversationId  
  *         schema: 
  *          type: string
  *      
 *     responses:
 *       '201':
 *         description: Get messages by conversation ID
 *       '400':
 *         description: Bad request
 */
async function GetConversationMessages(req, res) {
  try {
    const { userId } = req.payload;

    const id = req.params.conversationId;
    
    const messages = await getConversationMessagesById(id);

    // true if message is sent by the user
    messages.forEach((message) => {
      message.senderId === userId ? message.isMine = true : message.isMine = false;
    });

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
