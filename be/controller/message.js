import Message from "../model/message.js";


export const getAllMessage = async (req, res) => {
    try{
        const {sender,receiver} = req.body;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ createdAt: 1 });
        if (messages.length > 0) {
            return res.status(200).json(messages);
        } else {
            return res.status(404).json({ msg: 'No messages found' });
        }
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}