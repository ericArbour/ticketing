import { useState, SyntheticEvent } from 'react';
import Router from 'next/router';

import useRequest from '../hooks/use-request';

type AuthForm = {
  type: 'signup' | 'signin';
};

export default function AuthForm({ type }: AuthForm) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, error } = useRequest({
    url: `/api/users/${type}`,
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    doRequest();
  };

  const text = type === 'signup' ? 'Sign Up' : 'Sign In';

  return (
    <form onSubmit={onSubmit}>
      <h1>{text}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error}
      <button className="btn btn-primary">{text}</button>
    </form>
  );
}
