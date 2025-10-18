import React, { useState, useEffect, useCallback } from 'react';
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
  

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000); 
  };

 
    const fetchHistory = useCallback(async () => {
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
      }, [setSessions, setLoading, setError]);
    
    
  
 useEffect(() => {
    fetchHistory();
}, [fetchHistory]);
  const handleDeleteSession = async(sessionId)=>{
  const confirmed = window.confirm("Are you sure you want to delete this session permanently?");

  if(confirmed) {
   try{
      await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`);
      showToast(`Session deleted Successfully  : ${sessionId}`);
      fetchHistory();
      
       
    } 
    catch(error){
      showToast('Error deleting session. Please check your network connection.');
      console.error('Delete error:', error);
    }

  }
}

 
  if (loading) {
    return <div className="">Loading Milking History...</div>;
  }

  if (error) {
    return <div className="">{error}</div>;
  }

  
  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Milking History</h2>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Back to Home
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="alert alert-info text-center mt-4">
          No milking sessions recorded yet. Start one from the Home page!
        </div>
      ) : (
        <div className="table-responsive">
                <table className="table table-hover table-striped "> 
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Start Time</th>
                            <th scope="col">End Time</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (

                            <tr key={session.id}>
                                <td className="fw-bold">
                                    {formatTime(session.startTime).datePart}
                                </td>

                                <td className="text-primary fw-bold"> 
                                    {session.milkQuantity.toFixed(1)} L
                                </td>
                                
                                <td>{formatTime(session.startTime).timePart}</td>
                                
                                <td>{formatTime(session.endTime).timePart}</td>

                                <td>{formatDuration(session.duration)}</td>
                                 <td>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                     onClick={() => handleDeleteSession(session.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
      )}


 {toastMessage && (
           
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
                <div 
              
                    className={`alert ${toastMessage.includes("Error") ? 'alert-danger' : 'alert-success'} alert-dismissible fade show m-0`} 
                    role="alert"
                >
                    {toastMessage}
                </div>
            </div>
        )}
        
 </div>
 );
}


export default HistoryPage;
