import { useEffect, useState } from 'react';
import styles from '../styles/posts.module.scss';

type Post = {
  title: string;
  body: string;
};

export default function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => { console.log(data); return data })
      .then((data) => setPosts(data));
  }, []);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}