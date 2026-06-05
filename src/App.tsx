import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ContractDetail } from './pages/ContractDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contracts/:id" element={<ContractDetail />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem' }}>404</h2>
              <p style={{ color: 'var(--text-muted)' }}>Page not found.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
