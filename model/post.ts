import { Schema, model, models } from "mongoose";

const PostSchema: Schema = new Schema<Post>({
  userEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export interface Post {
  userEmail: string;
  title: string;
}

const PostTable = models.Post || model<Post>("Post", PostSchema);
export default PostTable;
