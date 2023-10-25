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

module.exports = {
  findOrCreateDirectConversation,
  createMessage,
};
