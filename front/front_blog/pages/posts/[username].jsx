// pages/posts/[username].jsx
import React from 'react';
import UserPosts from '../../components/PostPage';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';

const BaseURL = 'http://localhost:8000';

const UserPostsPage = ({ initialPosts, username }) => {
  return <UserPosts initialPosts={initialPosts} username={username} />;
};

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const username = params.username;
  const accessToken = getCookie('accessToken', { req, res });
  const refreshToken = getCookie('refreshToken', { req, res });

  const fetchUserPosts = async (token) => {
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
    const posts = await fetchUserPosts(accessToken);
    return {
      props: {
        initialPosts: posts,
        username,
      },
    };
  } catch (error) {
    if (error.response && error.response.data.code === 'token_not_valid') {
      try {
        const response = await axios.post(`${BaseURL}/api/user/login/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        setCookie('accessToken', newAccessToken, { req, res });
        const posts = await fetchUserPosts(newAccessToken);
        return {
          props: {
            initialPosts: posts,
            username,
          },
        };
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return {
          props: {
            initialPosts: [],
            username,
          },
        };
      }
    }
    return {
      props: {
        initialPosts: [],
        username,
      },
    };
  }
}

export default UserPostsPage;
