// import React from 'react';

// const PostPage = () => {
//   return (
//     <div>
//       <h1>Post Page</h1>
//       {/* Your content here */}
//     </div>
//   );
// };

// export default PostPage;


import React from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const DynamicLoginForm = dynamic(() => import('../components/PostPage'), { ssr: false });


const PostPage = ({ posts }) => {
  return (
    <div>
      <h1>Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.pid}>
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
    const response = await axios.get('http://localhost:8000/api/post/');
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
