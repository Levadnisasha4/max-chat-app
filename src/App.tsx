import { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import { Credentials } from './types';

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  if (!credentials) {
    return <Login onLogin={setCredentials} />;
  }

  return <Chat credentials={credentials} onLogout={() => setCredentials(null)} />;
}