import { Post } from "@/model/post"
import { HydratedDocument } from "mongoose"

interface PostListProps {
    posts: HydratedDocument<Post>[] | undefined,
    error: any,
    isLoading: boolean
}

export default function PostList({posts, error, isLoading}: PostListProps) {
    if (error) return <div>failed to load</div>
    if (isLoading || !posts) return <div>loading...</div>
   
    // render data
    return <div>
        {posts.map(post => (<div key={post._id.toString()} className='flex gap-2'>
            <p>{post.userEmail}</p>
            <p>{post.title}</p>
        </div>))}
    </div>
}