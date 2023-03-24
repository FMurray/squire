import React from 'react';
import { PostData } from '../api/posts';
import { formatDate } from '../utils/utils';
import './[id].css';

interface PostProps {
    post: PostData;
}

const Post: React.FC<PostProps> = ({ post }) => {
    return (
        <div className='post'>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>Posted on {formatDate(post.date)}</p>
        </div>
    );
};

export default Post;