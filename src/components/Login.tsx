import { useState, FormEvent } from 'react';
import { Credentials } from '../types';

interface LoginProps {
  onLogin: (credentials: Credentials) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [idInstance, setIdInstance] = useState<string>('');
  const [apiTokenInstance, setApiTokenInstance] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Заполните все поля');
      return;
    }
    onLogin({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Вход в MAX</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
          />
          <input
            type="password"
            placeholder="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
}