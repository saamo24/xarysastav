import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import CreatePostPopup from '../components/CreatePostPopup';
import EditPostPopup from '../components/EditPostPopup';

const BaseURL = 'http://localhost:8000';

const PostPage = ({ initialPosts, initialUsername }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [username, setUsername] = useState(initialUsername);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (!accessToken) return;

      const response = await axios.post(
        `${BaseURL}/api/user/logout/`,
        { refresh_token: localStorage.getItem('refreshToken') },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 205) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        deleteCookie('username');
        deleteCookie('accessToken');
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    router.reload();
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(post => (post.pid === updatedPost.pid ? updatedPost : post)));
    setIsEditPopupOpen(false);
    router.reload();
  };

  const handleEditClick = (post) => {
    setEditPost(post);
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (post) => {
    setDeletePost(post);
    setIsDeletePopupOpen(true);
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${BaseURL}/api/post/${deletePost.pid}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setPosts(posts.filter(post => post.pid !== deletePost.pid));
      setIsDeletePopupOpen(false);
      router.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Layout pageTitle="Posts" handleLogout={isAuthenticated ? handleLogout : null}>
      <button onClick={() => setIsPopupOpen(true)} style={{ cursor: 'pointer' }}>
        Create Post
      </button>
      <CreatePostPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        accessToken={accessToken}
        onPostCreated={handlePostCreated}
      />
      {editPost && (
        <EditPostPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          accessToken={accessToken}
          post={editPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
  {isDeletePopupOpen && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'black',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #0ced6a',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
        maxWidth: '24rem',
        width: '100%',
        textAlign: 'center'
      }}>
        <p>Are you sure you want to delete this post?</p>
        <button onClick={handleDeletePost} style={{ marginRight: '10px' }}>Yes</button>
        <button onClick={() => setIsDeletePopupOpen(false)}>No</button>
      </div>
    </div>
  )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        {isAuthenticated ? (
          <>
            <h2>Bonsoir `{username}`</h2>
          </>
        ) : (
          <h2>Please log in to see the posts.</h2>
        )}
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.pid} style={{ marginBottom: '20px', border: '1px solid #0ced6a', padding: '10px', borderRadius: '15px', position: 'relative' }}>
                <p>{post.content}</p>
                <p>Date: {post.date}</p>
                <p>
                  Reporter: <Link href={`/posts/${post.poster_username}`} passHref>
                    <span style={{ color: '#0ced6a', textDecoration: 'underline', cursor: 'pointer' }}>
                      {post.poster_username}
                    </span>
                  </Link>
                </p>
                {isAuthenticated && post.poster_username === username && (
                  <>
                    <button onClick={() => handleEditClick(post)} style={{ marginTop: '10px' }}>
                      Edit
                    </button>
                    <span
                      onClick={() => handleDeleteClick(post)}
                      style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '24px', cursor: 'pointer'}}
                    >
                      🚮
                    </span>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  const username = getCookie('username', { req, res });
  const accessToken = getCookie('accessToken', { req, res });
  const refreshToken = getCookie('refreshToken', { req, res });

  const fetchPosts = async (token) => {
    try {
      const response = await axios.get(`${BaseURL}/api/post/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  try {
    const posts = await fetchPosts(accessToken);
    return {
      props: {
        initialPosts: posts,
        initialUsername: username || false,
      },
    };
  } catch (error) {
    if (error.response && error.response.data.code === 'token_not_valid') {
      try {
        const response = await axios.post(`${BaseURL}/api/user/login/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        setCookie('accessToken', newAccessToken, { req, res });
        const posts = await fetchPosts(newAccessToken);
        return {
          props: {
            initialPosts: posts,
            initialUsername: username || false,
          },
        };
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return {
          props: {
            initialPosts: [],
            initialUsername: username || false,
          },
        };
      }
    }
    return {
      props: {
        initialPosts: [],
        initialUsername: username || false,
      },
    };
  }
}

export default PostPage;
