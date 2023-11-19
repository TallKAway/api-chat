const { Server } = require('socket.io');
const { findOrCreateDirectConversation, addMessageToConversation } = require('../repository/ChatRepository');
const { decodeToken } = require('../middlewares/auth');

module.exports = (server) => {
    const io = new Server(server, {
        path: '/socket.io',
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });


    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join_conversation', async ({ token, receiverId, conversationId }) => {
            const { userId } = decodeToken(token);
            socket.join(conversationId);
            console.log(`User ${userId} joined room: ${conversationId}`);
          });
        
        socket.on('send_message', async ({ token, receiverId, content }) => {
            const { userId } = decodeToken(token);
            const conversation = await findOrCreateDirectConversation(userId, receiverId);
            await addMessageToConversation(userId, conversation.id, content);
            io.to(conversation.id).emit('message', {content, senderId: userId, conversationId: conversation.id}); 
        });

        socket.on('leave_conversation', ({ conversationId }) => {
            socket.leave(conversationId);
            console.log(`User ${socket.id} left room ${conversationId}`);
          });
    });
};
