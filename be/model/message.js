import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image:{
        type:String,
    },
    seen:{
        type:Boolean,
        default: false
    },
},
    {timestamps: true}
)

const Message = mongoose.model('message', messageSchema);
export default Message;