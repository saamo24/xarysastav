import { useState } from 'react';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const BaseURL = 'http://localhost:8000';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BaseURL}/api/user/login/`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        setCookie('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setCookie('username', username);
        setIsAuthenticated(true);
        router.push('/post'); // Redirect after login
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        setError('Login failed. Please check your credentials and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
