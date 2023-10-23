const {prisma} = require('../utils/database');


function createChat(chatData) {
    return prisma.chatData.create({
        data: {
            
        },
    })
}

