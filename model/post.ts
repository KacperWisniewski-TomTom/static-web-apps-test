import { Schema, model, models } from "mongoose";

const PostSchema: Schema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

export default models.Post || model('Post', PostSchema)