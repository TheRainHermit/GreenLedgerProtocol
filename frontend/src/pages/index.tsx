import { useState } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Pasa setIsAuthenticated como prop a Login y llama setIsAuthenticated(true) tras login exitoso
  return isAuthenticated ? <Dashboard /> : <Login onLogin={() => setIsAuthenticated(true)} />;
}
