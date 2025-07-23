import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Laptops from './pages/Laptops.jsx'
import Header from './components/Header.jsx';
import './App.css'

function App() {

  return (
        <Router>
      {/* Place ToastContainer here to make it work globally */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Routes>
        {/* Redirect root (/) to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Laptops />} />


      </Routes>
    </Router>
  );
}

export default App
