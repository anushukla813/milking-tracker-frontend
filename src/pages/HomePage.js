import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="vh-100 d-flex flex-column align-items-start justify-content-start text-center p-3  text-white">
      <h1 className="display-6 fw-bold mb-5 mt-5 text-dark">Milking Tracker 🐄</h1>
      <Link
        to="/session"
        className="btn btn-primary btn-md rounded-pill shadow-md p-3 px-5 mb-4 mt-5">
        Start Milking
      </Link>

      <Link to="/history" className="btn btn-secondary btn-md rounded-pill shadow-md p-3 px-4 mb-4">
        View Milking History
      </Link>
    </div>
  );
}
export default HomePage;
