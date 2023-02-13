import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Authenticator = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!login || !role || !token) {
      router.push('/auth');
    } else if (role === 'admin') {
      router.push('/cabinet/admin');
    } else {
      router.push(`/cabinet/${role}/${login}`);
    }
  }, []);

  return <>{children}</>;
};

export default Authenticator;