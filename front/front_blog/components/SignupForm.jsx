import { useState } from 'react';
import axios from 'axios';

const BaseURL = 'http://localhost:8000';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${BaseURL}/api/user/register/`, {
        username,
        password,
      });

      if (response.status === 201) {
        setSuccess('Signup successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/login'; // Redirect after signup
        }, 2000);
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <div>
          {/* <label>Username:</label> */}
          <input
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <label>Password:</label> */}
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <label>Confirm Password:</label> */}
          <input
            type="password"
            value={confirmPassword}
            placeholder='Comfirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default SignupForm;
