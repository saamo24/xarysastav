import Layout from '../components/layout';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicLoginForm = dynamic(() => import('../components/LoginForm'), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const { msg } = router.query;

  return (
    <Layout pageTitle="Login">
      <Link href="/">Home</Link><br />
      {msg && <h3 className="red">{msg}</h3>}
      <DynamicLoginForm />
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
