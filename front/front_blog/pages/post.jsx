// import React from 'react';
// import axios from 'axios';
// import Layout from '../components/layout';
// import { getCookie, deleteCookie, setCookie } from 'cookies-next';
// import { useRouter } from 'next/router';

// const BaseURL = 'http://localhost:8000';

// const PostPage = ({ posts, username }) => {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       const refreshToken = localStorage.getItem('refreshToken');

//       const response = await axios.post(
//         BaseURL + '/api/user/logout/',
//         { refresh_token: refreshToken },
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 205) {
//         console.log('Logout successful');
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         deleteCookie('username');
//         router.push('/login');
//       } else {
//         console.error('Logout failed');
//       }
//     } catch (error) {
//       console.error('An error occurred during logout:', error);
//     }
//   };

//   return (
//     <Layout pageTitle="Posts" handleLogout={username ? handleLogout : null}>
//       <div>
//         <h1>Posts</h1>
//         {posts.length > 0 ? (
//           posts.map((post) => (
//             <div key={post.pid}>
//               <h2>{post.content}</h2>
//               <p>{post.date}</p>
//             </div>
//           ))
//         ) : (
//           <p>No posts available</p>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   const username = getCookie('username', { req, res });
//   const accessToken = getCookie('accessToken', { req, res });
//   const refreshToken = getCookie('refreshToken', { req, res });

//   const fetchPosts = async (token) => {
//     try {
//       const response = await axios.get(BaseURL + '/api/post/', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       throw error;
//     }
//   };

//   try {
//     const posts = await fetchPosts(accessToken);
//     return {
//       props: {
//         posts,
//         username: username || false,
//       },
//     };
//   } catch (error) {
//     if (error.response && error.response.data.code === 'token_not_valid') {
//       // Refresh token logic
//       try {
//         const response = await axios.post(BaseURL + '/api/token/refresh/', { refresh: refreshToken });
//         const newAccessToken = response.data.access;
        
//         // Set new access token as cookie
//         setCookie('accessToken', newAccessToken, { req, res });

//         // Retry fetching posts with new access token
//         const posts = await fetchPosts(newAccessToken);
//         return {
//           props: {
//             posts,
//             username: username || false,
//           },
//         };
//       } catch (refreshError) {
//         console.error('Error refreshing token:', refreshError);
//         return {
//           props: {
//             posts: [],
//             username: username || false,
//           },
//         };
//       }
//     }

//     return {
//       props: {
//         posts: [],
//         username: username || false,
//       },
//     };
//   }
// }

// export default PostPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';

const BaseURL = 'http://localhost:8000';

const PostPage = ({ posts, username }) => {
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
    <Layout pageTitle="Posts" handleLogout={isAuthenticated ? handleLogout : null}>
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
              <div key={post.pid} style={{ marginBottom: '20px', border: '1px solid #0ced6a', padding: '10px', borderRadius: '15px', display: 'auto' }}>
                <p>{post.content}</p>
                <p>Date: {post.date}</p>
                <p>reporter: {post.poster_username}</p>
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
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
        posts,
        username: username || false,
      },
    };
  } catch (error) {
    if (error.response && error.response.data.code === 'token_not_valid') {
      // Token is not valid; handle token refresh
      try {
        const response = await axios.post(`${BaseURL}/api/login/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        
        // Set new access token as cookie
        setCookie('accessToken', newAccessToken, { req, res });

        // Retry fetching posts with new access token
        const posts = await fetchPosts(newAccessToken);
        return {
          props: {
            posts,
            username: username || false,
          },
        };
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return {
          props: {
            posts: [],
            username: username || false,
          },
        };
      }
    }

    return {
      props: {
        posts: [],
        username: username || false,
      },
    };
  }
}

export default PostPage;
