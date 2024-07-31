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

export default function HomePage({ username }) {

  return (
    <Layout pageTitle="Home">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        {username ? (
          <>
            {/* <h2>Hi {username}</h2> */}
            {/* <button onClick={handleLogout}>Logout</button> */}
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
