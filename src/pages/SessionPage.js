import { useState } from 'react'; 
import {useNavigate} from 'react-router-dom'
import { useMilkingSession } from '../hooks/useMilkingSession';
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:8080/api'; 

 function SessionPage() {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [milkQuantity, setMilkQuantity] = useState('');
  const [sessionData, setSessionData] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    setErrorMessage(null);
    const quantity = parseFloat(milkQuantity);
    
    if (!sessionData || isNaN(quantity) || quantity <= 0) {
      setErrorMessage("Please enter a valid milk quantity");
      setIsSaving(false);
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

      
      navigate('/history');

    } catch (error) {
      setErrorMessage('Error saving session. Please ensure the backend is running');
      console.error('Save error:', error);
    }
    finally {
     setIsSaving(false);
    }
  };

 
  if (!isMilking && !showPrompt) {
    return (
        <div className="d-flex flex-column align-items-start p-4  md:p-8 mb-5">
            <h2 className="mt-4">Tap to begin Milking </h2>
            <button
                onClick={handleStart}
                className="btn btn-success btn-md rounded-pill shadow-md p-2 px-4 mt-3 mb-4"
            >
                START
            </button>
        </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-start p-4 md:p-8  mb-5">
      <h2 className="mb-3">Milking Session</h2>
      
      <div className="display-6 fw mb-3">
        {formatTime(timer)}
      </div>

      <div className="d-flex gap-3">
        {!isPaused ? (
          <button onClick={pauseSession} className="btn btn-primary btn-md rounded-pill shadow-md px-4">
            Pause
          </button>
        ) : (
          <button onClick={resumeSession} className="btn btn-secondary btn-md rounded-pill shadow-md px-4">
            Resume
          </button>
        )}
        <button onClick={handleStop} className="btn btn-danger btn-md rounded-pill shadow-md px-4">
          Stop
        </button>
      </div>

    
      {showPrompt && (
        <div className="d-flex flex-column align-items-start p-0 mt-5 text-start w-full md:w-1/2 lg:w-1/3">
          <form onSubmit={handleSaveSession} className="d-grid gap-2">
            <h2 className=" mb-1">Enter Milk Quantity</h2>
            <p className="text-muted mb-2">Duration: {formatTime(sessionData?.duration || 0)}</p>
            {errorMessage && (
        <div className="alert alert-danger p-2 text-center my-2 rounded">
        {errorMessage}
    </div>
)}
            <input
              type="number"
              step="0.1"
              value={milkQuantity}
              onChange={(e) => { setMilkQuantity(e.target.value); setErrorMessage(null); }}
              placeholder="Enter Milk in Liters"
              required
              className="form-control form-control-md mb-2"
            />
            <button 
            type="submit" 
            className="btn btn-success btn-md rounded-pill shadow-md px-4"
            disabled={isSaving}>
              Save Record
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
export default SessionPage;