import '../styles/global.css';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout pageTitle={Component.pageTitle}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;