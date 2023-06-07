import { Post } from '@prisma/client';


interface PostListProps {
    posts: Post[] | undefined,
    error: any,
    isLoading: boolean
}

export default function PostList({posts, error, isLoading}: PostListProps) {
    if (error) return <div>failed to load</div>
    if (isLoading || !posts) return <div>loading...</div>
   
    // render data
    return <div>
        {posts.map(post => (<div key={post.id} className='flex gap-2'>
            <p>{post.userEmail}</p>
            <p>{post.title}</p>
        </div>))}
    </div>
}