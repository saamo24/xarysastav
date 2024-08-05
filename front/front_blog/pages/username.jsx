// pages/[username].jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const BaseURL = 'http://localhost:8000';

const UserPostsPage = ({ posts, username }) => {
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

  return (
    <Layout pageTitle={`Posts by ${username}`} handleLogout={isAuthenticated ? handleLogout : null}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        {isAuthenticated ? (
          <h2>Posts by `{username}`</h2>
        ) : (
          <h2>Please log in to see the posts.</h2>
        )}
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.pid} style={{ marginBottom: '20px', border: '1px solid #0ced6a', padding: '10px', borderRadius: '15px' }}>
                <p>{post.content}</p>
                <p>Date: {post.date}</p>
                <p>Reporter: {post.poster_username}</p>
              </div>
            ))
          ) : (
            <p>No posts available for this user.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { username } = context.query;
  const req = context.req;
  const res = context.res;
  const accessToken = getCookie('accessToken', { req, res });

  const fetchUserPosts = async (token, username) => {
    try {
      const response = await axios.get(`${BaseURL}/api/post/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  };

  try {
    const posts = await fetchUserPosts(accessToken, username);
    return {
      props: {
        posts,
        username,
      },
    };
  } catch (error) {
    if (error.response && error.response.data.code === 'token_not_valid') {
      // Token is not valid; handle token refresh
      try {
        const refreshToken = getCookie('refreshToken', { req, res });
        const response = await axios.post(`${BaseURL}/api/user/login/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        
        // Set new access token as cookie
        setCookie('accessToken', newAccessToken, { req, res });

        // Retry fetching posts with new access token
        const posts = await fetchUserPosts(newAccessToken, username);
        return {
          props: {
            posts,
            username,
          },
        };
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return {
          props: {
            posts: [],
            username,
          },
        };
      }
    }

    return {
      props: {
        posts: [],
        username,
      },
    };
  }
}

export default UserPostsPage;
