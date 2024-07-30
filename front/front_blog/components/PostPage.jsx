import React from 'react';
import axios from 'axios';


BaseURL = 'http://localhost:8000'

const PostPage = ({ posts }) => {
  return (
    <div>
      <h1>Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get(BaseURL+'/api/post/');
    const posts = response.data;

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
}

export default PostPage;
