import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SessionPage from './pages/SessionPage';
import HistoryPage from './pages/HistoryPage';



export function App() {
 
  return (
    <Router>
      <div className="">
        <main className="">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
