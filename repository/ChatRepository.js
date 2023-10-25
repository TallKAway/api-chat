const { prisma } = require("../utils/database");

async function findOrCreateDirectConversation(userId1, userId2) {
  // Rechercher une conversation existante
  let conversation = await prisma.directConversation.findFirst({
    where: {
      OR: [
        { user1Id: userId1, user2Id: userId2 },
        { user1Id: userId2, user2Id: userId1 },
      ],
    },
  });

  // Si aucune conversation n'est trouvée, alors on la crée
  if (!conversation) {
    conversation = await prisma.directConversation.create({
      data: {
        user1Id: userId1,
        user2Id: userId2,
      },
    });
  }

  return conversation;
}

async function createMessage(senderId, conversationId, content) {
  return await prisma.directMessage.create({
    data: {
      content: content,
      senderId: senderId,
      direcConversationId: conversationId,
    },
  });
}

async function getConversation(userId, receiverId) {
  return await prisma.directConversation.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: receiverId },
        { user1Id: receiverId, user2Id: userId },
      ],
    },
  });
}

async function getConversationById(id) {
  return await prisma.directMessage.findMany({
    where: {
      direcConversationId: id,
    },
  });
}

module.exports = {
  findOrCreateDirectConversation,
  createMessage,
  getConversation,
  getConversationById
};
