import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const API_BASE_URL = 'http://localhost:8080/api';

const formatDuration = (seconds) => {
  if (seconds === undefined || seconds === null) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatTime = (isoString) => {
  if (!isoString) return { datePart: 'N/A', timePart: 'N/A' };
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString();
  const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { datePart, timePart };
};

export function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_BASE_URL}/sessions`);
        
        setSessions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load history. Ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); 

 
  if (loading) {
    return <div className="">Loading Milking History...</div>;
  }

  if (error) {
    return <div className="">{error}</div>;
  }

  return (
    <div className="">
      <div className="3">
        <h1 className="">Milking History</h1>
        <Link to="/" className="">
          ← Back to Home
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="">
          No milking sessions recorded yet. Start one from the Home page!
        </div>
      ) : (
        <div className="">
          {sessions.map((session) => (
              <div key={session.id} className="">
                <div className="">
                  <span className="">
                    Date: {formatTime(session.startTime).datePart}
                  </span>
                  <span className="">
                    {session.milkQuantity.toFixed(1)} L
                  </span>
                </div>
                <div className="">
                  <div className="font-medium">Start Time:</div>
                  <div>{formatTime(session.startTime).timePart}</div>
                  <div className="font-medium">End Time:</div>
                  <div>{formatTime(session.endTime).timePart}</div>
                  <div className="font-medium">Duration:</div>
                  <div>{formatDuration(session.duration)}</div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
export default HistoryPage;
