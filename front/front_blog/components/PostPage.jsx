// components/UserPosts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getCookie, deleteCookie } from 'cookies-next';
import Layout from './layout';

const BaseURL = 'http://localhost:8000';

const UserPosts = ({ initialPosts, username }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
            'Authorization': `Bearer ${accessToken}`,
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

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${BaseURL}/api/post/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    if (!initialPosts.length) {
      fetchUserPosts();
    }
  }, [username, initialPosts]);

  return (
    <Layout pageTitle="Posts" handleLogout={isAuthenticated ? handleLogout : null}>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2>Posts by `{username}`</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => router.push('/post')} style={{ marginRight: '10px' }}>
          Back to Posts
        </button>
      </div>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.pid} style={{ marginBottom: '20px', border: '1px solid #0ced6a', padding: '10px', borderRadius: '15px' }}>
              <p>{post.content}</p>
              <p>Date: {post.date}</p>
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

export default UserPosts;
