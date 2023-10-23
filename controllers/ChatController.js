

const SocketEvents = require('../constants/SocketEvents');

const { User,ChatRoom,Message } = require('../model/chat');




async function CreateChat(req, res) {
    try {
        // Récupérez les données de la requête, par exemple, le nom de la salle de chat
        const { chatName } = req.body;

        // Créez une nouvelle salle de chat
        const chatRoom = new ChatRoom(chatName);

        // Enregistrez la salle de chat dans la base de données
        await chatRoom.save();
        socket.emit(SocketEvents.CHAT_CREATED, { chatRoom });

        return res.status(201).json({ chatRoom });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors de la création de la salle de chat.' });
    }
}

async function DeleteChat(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez peut-être ajuster la façon dont vous obtenez l'ID de la salle de chat dans la requête.

        // Vérifiez d'abord si la salle de chat existe
        const chatRoom = await ChatRoom.findById(chatId);
        if (!chatRoom) {
            return res.status(404).json({ error: "La salle de chat n'existe pas." });
        }

        // Supprime la salle de chat
        await chatRoom.remove();
socket.emit(SocketEvents.CHAT_DELETED, { chatRoomId });
        return res.status(200).json({ message: "Salle de chat supprimée avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la suppression de la salle de chat." });
    }
}

async function UpdateChat(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de chat dans la requête.
        const newName = req.body.newName; // Assurez-vous d'avoir un champ "newName" dans le corps de la requête.

        // Vérifiez d'abord si la salle de chat existe
        const chatRoom = await ChatRoom.findById(chatId);
        if (!chatRoom) {
            return res.status(404).json({ error: "La salle de chat n'existe pas." });
        }

        // Mettez à jour le nom de la salle de chat
        chatRoom.name = newName;

        // Enregistrez la mise à jour dans la base de données
        await chatRoom.save();
socket.emit(SocketEvents.CHAT_UPDATED, { chatRoom });
        return res.status(200).json({ message: "Nom de la salle de chat mis à jour avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du nom de la salle de chat." });
    }
}


async function FetchAllChat(req, res) {
    try {
        const chatRooms =  ChatRoom.find();
        return res.status(200).json(chatRooms);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération de toutes les salles de chat." });
    }
}

async function FetchChatById(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de chat dans la requête.
        const chat = await ChatRoom.findById(chatId);

        if (!chat) {
            return res.status(404).json({ error: "La salle de chat n'existe pas." });
        }

        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération de la salle de chat par ID." });
    }
}

async function FetchChatByUserId(req, res) {
    try {
        const userId = req.params.userId; // Vous devrez ajuster la manière dont vous obtenez l'ID de l'utilisateur dans la requête.
        const user =  User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "L'utilisateur n'existe pas." });
        }

        const chatRoom = user.chatRoom;

        if (!chatRoom) {
            return res.status(404).json({ error: "L'utilisateur n'est associé à aucune salle de chat." });
        }

        return res.status(200).json(chatRoom);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération de la salle de chat par l'ID de l'utilisateur." });
    }
}


async function AddUserToChat(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de chat dans la requête.
        const userId = req.params.userId; // Vous devrez ajuster la manière dont vous obtenez l'ID de l'utilisateur dans la requête.

        const chatRoom =  ChatRoom.findById(chatId);
        const user = User.findById(userId);

        if (!chatRoom || !user) {
            return res.status(404).json({ error: "La salle de chat ou l'utilisateur n'existe pas." });
        }

        chatRoom.addUser(user);
 socket.emit(SocketEvents.USER_ADDED_TO_CHAT, { chatRoom, user });
        return res.status(200).json({ message: "Utilisateur ajouté à la salle de chat avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de l'utilisateur à la salle de chat." });
    }
}

async function FetchChatMessages(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de chat dans la requête.
        const chatRoom =  ChatRoom.findById(chatId);

        if (!chatRoom) {
            return res.status(404).json({ error: "La salle de chat n'existe pas." });
        }

        const messages = chatRoom.messages; // Vous pouvez ajuster cette partie pour obtenir les messages depuis la base de données.

        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des messages de la salle de chat." });
    }
}


async function SendMessageInChat(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de chat dans la requête.
        const chatRoom = await ChatRoom.findById(chatId);

        if (!chatRoom) {
            return res.status(404).json({ error: "La salle de chat n'existe pas." });
        }

        const userId = req.body.userId; // Vous devrez ajuster la manière dont vous obtenez l'ID de l'utilisateur à partir de la requête.
        const content = req.body.content; // Vous devrez ajuster la manière dont vous obtenez le contenu du message à partir de la requête.

        // Vérifiez si l'utilisateur existe (vous devrez créer cette fonction dans votre modèle User)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "L'utilisateur n'existe pas." });
        }

        const timestamp = new Date();
        const message = new Message(user, content, timestamp);

        // Ajoute le message à la salle de chat
        chatRoom.messages.push(message);

        // Vous pouvez également ajouter le message à la base de données si nécessaire.
socket.emit(SocketEvents.NEW_MESSAGE, { chatRoom, message });

        return res.status(201).json(message); // Renvoie le message ajouté en réponse.
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi du message dans la salle de chat." });
    }
}



async function DeleteMessageInChat(req, res) {
    try {
        const chatId = req.params.chatId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de chat dans la requête.
        const chatRoom = await ChatRoom.findById(chatId);

        if (!chatRoom) {
            return res.status(404).json({ error: "La salle de chat n'existe pas." });
        }

        const messageId = req.params.messageId; // Vous devrez ajuster la manière dont vous obtenez l'ID du message dans la requête.

        // Recherchez le message dans la salle de chat
        const message = chatRoom.messages.find((msg) => msg.id === messageId);

        if (!message) {
            return res.status(404).json({ error: "Le message n'existe pas dans cette salle de chat." });
        }

        // Supprime le message de la salle de chat
        chatRoom.messages = chatRoom.messages.filter((msg) => msg.id !== messageId);

        // Vous pouvez également supprimer le message de la base de données si nécessaire.
socket.emit(SocketEvents.MESSAGE_DELETED, { chatRoom, messageId });

        return res.status(200).json({ message: "Le message a été supprimé avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la suppression du message dans la salle de chat." });
    }
}

async function DeleteUserFromChat(req, res) {
    try {
        const chatRoomId = req.params.chatRoomId; // Vous devrez ajuster la manière dont vous obtenez l'ID de la salle de discussion dans la requête.
        const userId = req.params.userId; // Vous devrez ajuster la manière dont vous obtenez l'ID de l'utilisateur dans la requête.

        const chatRoom = await ChatRoom.findById(chatRoomId);
        const user = await User.findById(userId);

        if (!chatRoom || !user) {
            return res.status(404).json({ error: "La salle de discussion ou l'utilisateur n'existe pas." });
        }

        // Supprime l'utilisateur de la salle de discussion
        chatRoom.removeUser(user);

        // Vous pouvez également ajouter des opérations pour supprimer l'utilisateur de la base de données si nécessaire.
socket.emit(SocketEvents.USER_REMOVED_FROM_CHAT, { chatRoom, user });
        return res.status(200).json({ message: "Utilisateur supprimé de la salle de discussion avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la suppression de l'utilisateur de la salle de discussion." });
    }
}


async function FetchUser(req, res) {
    try {
        const users = User.find();
       
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération de tous les utilisateurs." });
    }
}


module.exports = {
    CreateChat,

    UpdateChat,
    FetchAllChat,
    FetchChatById,
    FetchChatByUserId,
    AddUserToChat,
    FetchChatMessages,
    SendMessageInChat,
    DeleteMessageInChat,
    DeleteUserFromChat,
    DeleteChat,
    FetchUser


}