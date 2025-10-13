import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useMilkingSession } from '../hooks/useMilkingSession';
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:8080/api'; 

export function SessionPage() {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [milkQuantity, setMilkQuantity] = useState('');
  const [sessionData, setSessionData] = useState(null); 

  const {
    timer,
    isMilking,
    isPaused,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    formatTime,
  } = useMilkingSession();

  const handleStart = () => {
      startSession();
  };

  const handleStop = () => {
    const data = stopSession();
    setSessionData(data);
    setShowPrompt(true); 
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    const quantity = parseFloat(milkQuantity);
    
    if (!sessionData || isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid milk quantity.");
      return;
    }

    try {
      const payload = {
        startTime: sessionData.startTime.toISOString(),
        endTime: sessionData.endTime.toISOString(),
        duration: sessionData.duration, 
        milkQuantity: quantity, 
      };

      await axios.post(`${API_BASE_URL}/sessions`, payload);

      alert(`Session saved successfully!`);
      navigate('/history');

    } catch (error) {
      alert('Error saving session. Please ensure the backend is running.');
    }
  };

 
  if (!isMilking && !showPrompt) {
    return (
        <div className="">
            <h1 className="">Tap to begin Milking</h1>
            <button
                onClick={handleStart}
                className=""
            >
                START
            </button>
        </div>
    );
  }

  return (
    <div className="">
      <h1 className="">Milking Session</h1>
      
      <div className="">
        {formatTime(timer)}
      </div>

      <div className="">
        {!isPaused ? (
          <button onClick={pauseSession} className="">
            Pause
          </button>
        ) : (
          <button onClick={resumeSession} className="">
            Resume
          </button>
        )}
        <button onClick={handleStop} className="">
          Stop
        </button>
      </div>

    
      {showPrompt && (
        <div className="">
          <form onSubmit={handleSaveSession} className="">
            <h2 className="">Enter Milk Quantity (Liters)</h2>
            <p className="">Duration: {formatTime(sessionData?.duration || 0)}</p>
            <input
              type="number"
              step="0.1"
              value={milkQuantity}
              onChange={(e) => setMilkQuantity(e.target.value)}
              placeholder="Enter Milk in Liters"
              required
              className=""
            />
            <button type="submit" className="">
              Save Record
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
export default SessionPage;
