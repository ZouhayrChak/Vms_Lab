import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Userlab from './pages/UserLab'
import './App.css';
import Home from './pages/HomePage';
import { Toaster } from 'sonner';

function App() {

  const token = localStorage.getItem("token");
  const path = token ? "/p/".concat(token) : "/p";

  return (
    <div id="app-container">
      <Toaster position="bottom-right" richColors closeButton expand={false} theme='dark' />
      <Router>
        <Routes>
          <Route path="/" element={token ? <Userlab /> : <Home />} />
          <Route path={path} element={<Userlab />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
