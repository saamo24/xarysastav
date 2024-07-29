import Layout from '../components/layout';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicSignupForm = dynamic(() => import('../components/SignupForm'), { ssr: false });

export default function SignupPage() {
  const router = useRouter();
  const { msg } = router.query;

  return (
    <Layout pageTitle="Signup">
      <Link href="/">Home</Link><br/>
      {msg && <h3 className="red">{msg}</h3>}
      <h2>Sign up</h2>
      <DynamicSignupForm />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  const username = getCookie('username', { req, res });
  
  if (username) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return { props: { username: false } };
}
