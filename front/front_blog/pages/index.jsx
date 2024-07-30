// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Layout from '../components/layout';
// import { getCookie } from 'cookies-next';

// export default function HomePage({ username }) {
//   return (
//     <Layout pageTitle="Home">
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
//         {username ? (
//           <>
//             <h2>Hi {username}</h2>
//             <Link href="/profile">Profile</Link><br/>
//             <Link href="/api/logout">Logout</Link>
//           </>
//         ) : (
//           <>
//             <h2>Log in</h2>
//             <Link href="/login">Login</Link><br/>
//             <Link href="/signup">Signup</Link>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// }

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   const username = getCookie('username', { req, res });
  
//   return { props: { username: username || false } };
// }

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/layout';
import { getCookie, deleteCookie } from 'cookies-next';
import axios from 'axios';
import { useRouter } from 'next/router';

const BaseURL = 'http://localhost:8000';

export default function HomePage({ username }) {
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
  
      const response = await axios.post(
        BaseURL+'/api/user/logout/',  // Adjust the URL if needed
        { refresh_token: refreshToken },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,  // Important if you are dealing with cookies
        }
      );
      const router = useRouter();

      if (response.status === 205) {
        console.log('Logout successful');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        deleteCookie('username');
        router.push('/'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  

  return (
    <Layout pageTitle="Home">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        {username ? (
          <>
            <h2>Hi {username}</h2>
            {/* <Link href="/profile">Profile</Link><br /> */}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <h2>Log in</h2>
            <Link href="/login">Login</Link><br />
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  const username = getCookie('username', { req, res });

  return { props: { username: username || false } };
}
