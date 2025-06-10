import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext.jsx';
import AppRoutes from './Routes/AppRoutes.jsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {AppRoutes()}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;