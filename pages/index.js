import { useEffect } from 'react';

const Main = (props) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/course/kazLang/speachKaz';
    }
  }, []);

  return <div>Redirecting...</div>;
};

Main.getInitialProps = async ({ res }) => {
    res.writeHead(302, { Location: '/course/kazLang/speachKaz' });
    res.end();
    return {};
};

export default Main;