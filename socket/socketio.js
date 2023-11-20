const { Server } = require('socket.io');
const { findOrCreateDirectConversation, addMessageToConversation } = require('../repository/ChatRepository');
const { decodeToken } = require('../middlewares/auth');
const e = require('express');

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

        socket.on('join_conversation', async ({ token, conversationId }) => {
            const { userId } = decodeToken(token);
            socket.join(conversationId);
            console.log(`User ${userId} joined room: ${conversationId}`);
          });
        
        socket.on('send_message', async ({ token, receiverId, content }) => {
            const { userId } = decodeToken(token);
            console.log(`User ${userId} sent message to ${receiverId}: ${content}`);
            const conversation = await findOrCreateDirectConversation(userId, receiverId);
            const message = await addMessageToConversation(userId, conversation.id, content);

            message.senderId === userId ? message.isMine = true : message.isMine = false;
            console.log("message", message);
            io.to(conversation.id).emit('message', message); 
        });

        socket.on('leave_conversation', ({ conversationId }) => {
            socket.leave(conversationId);
            console.log(`User ${socket.id} left room ${conversationId}`);
          });
    });
};
